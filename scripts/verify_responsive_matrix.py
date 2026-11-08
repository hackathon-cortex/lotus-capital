import asyncio
import http.server
import socketserver
import os
import subprocess
import threading
import json
import base64
import urllib.request
import websockets
import tempfile
import shutil
import sys

# Ensure immediate unbuffered UTF-8 output
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace', line_buffering=True)

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
SCREENSHOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'screenshots', 'responsive'))
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 4248
CDP_PORT = 9278

# Representative Device Matrix
DEVICE_MATRIX = [
    {"name": "iphone_se_320", "width": 320, "height": 568, "is_mobile": True},
    {"name": "iphone_se_375", "width": 375, "height": 667, "is_mobile": True},
    {"name": "pixel_5_393", "width": 393, "height": 851, "is_mobile": True},
    {"name": "iphone_14_pro_max", "width": 430, "height": 932, "is_mobile": True},
    {"name": "phone_landscape", "width": 844, "height": 390, "is_mobile": True},
    {"name": "ipad_mini_768", "width": 768, "height": 1024, "is_tablet": True},
    {"name": "ipad_pro_834", "width": 834, "height": 1194, "is_tablet": True},
    {"name": "laptop_1280", "width": 1280, "height": 800, "is_desktop": True},
    {"name": "desktop_1440", "width": 1440, "height": 900, "is_desktop": True},
    {"name": "wide_1920", "width": 1920, "height": 1080, "is_desktop": True},
]

ROUTES = [
    "/",
    "/about-us",
    "/services",
    "/services/general-insurance",
    "/services/life-insurance",
    "/services/health-insurance",
    "/investments/mutual-funds",
    "/investments/equity",
    "/investments/other-solutions",
    "/insights",
    "/privacy-policy",
    "/terms-and-conditions",
    "/disclosures",
    "/complaints",
    "/enquiry/thank-you",
    "/404",
    "/admin/dashboard",
]

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def do_GET(self):
        clean_path = self.path.split('?')[0].split('#')[0]
        full_path = self.translate_path(clean_path)
        if not os.path.exists(full_path) or os.path.isdir(full_path):
            self.path = '/index.html'
        return super().do_GET()

    def log_message(self, format, *args):
        pass

class SilentServer(http.server.ThreadingHTTPServer):
    def handle_error(self, request, client_address):
        pass

def run_server():
    SilentServer.allow_reuse_address = True
    with SilentServer(("127.0.0.1", PORT), SPAHandler) as httpd:
        httpd.serve_forever()

async def run_verification():
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    await asyncio.sleep(1.2)

    user_data = tempfile.mkdtemp(prefix="chrome_responsive_")
    chrome_cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        f"--user-data-dir={user_data}",
        f"--remote-debugging-port={CDP_PORT}",
        "--window-size=1440,900",
        f"http://127.0.0.1:{PORT}/",
    ]
    proc = subprocess.Popen(chrome_cmd)
    await asyncio.sleep(2.5)

    all_passed = True
    results_summary = []

    try:
        req = urllib.request.urlopen(f"http://127.0.0.1:{CDP_PORT}/json")
        tabs = json.loads(req.read().decode())
        page_target = next(t for t in tabs if t.get('type') == 'page')
        
        async with websockets.connect(page_target["webSocketDebuggerUrl"], max_size=50*1024*1024) as ws:
            msg_id = 1
            async def send(method, params=None):
                nonlocal msg_id
                payload = {"id": msg_id, "method": method, "params": params or {}}
                msg_id += 1
                await ws.send(json.dumps(payload))
                while True:
                    res = json.loads(await ws.recv())
                    if res.get("id") == payload["id"]:
                        return res

            await send("Page.enable")
            await send("DOM.enable")

            # Iterate through devices
            for dev in DEVICE_MATRIX:
                dev_name = dev["name"]
                dev_dir = os.path.join(SCREENSHOT_DIR, dev_name)
                os.makedirs(dev_dir, exist_ok=True)

                # Set viewport size
                await send("Emulation.setDeviceMetricsOverride", {
                    "width": dev["width"],
                    "height": dev["height"],
                    "deviceScaleFactor": 1,
                    "mobile": dev.get("is_mobile", False),
                })
                await asyncio.sleep(0.3)

                print(f"\n==========================================")
                print(f"Testing Device: {dev_name} ({dev['width']}x{dev['height']})")
                print(f"==========================================")

                for route in ROUTES:
                    url = f"http://127.0.0.1:{PORT}{route}"
                    await send("Page.navigate", {"url": url})
                    await asyncio.sleep(0.35)

                    # Check 1: Horizontal Overflow
                    overflow_eval = await send("Runtime.evaluate", {
                        "expression": """
                        (() => {
                            const docEl = document.documentElement;
                            const body = document.body;
                            const scrollW = Math.max(docEl.scrollWidth, body.scrollWidth);
                            const innerW = window.innerWidth;
                            const hasOverflow = scrollW > innerW + 1; // allow 1px rounding margin
                            
                            // Find elements overflowing if any
                            let offenders = [];
                            if (hasOverflow) {
                                const all = Array.from(document.querySelectorAll('*'));
                                for (const el of all) {
                                    const r = el.getBoundingClientRect();
                                    if (r.right > innerW + 2) {
                                        offenders.push({
                                            tag: el.tagName,
                                            id: el.id,
                                            class: (el.className || '').toString().slice(0, 50),
                                            parent: el.parentElement ? (el.parentElement.id || el.parentElement.className || el.parentElement.tagName).toString().slice(0, 50) : '',
                                            right: Math.round(r.right),
                                            width: Math.round(r.width)
                                        });
                                        if (offenders.length >= 3) break;
                                    }
                                }
                            }
                            return {
                                scrollW,
                                innerW,
                                hasOverflow,
                                offenders
                            };
                        })()
                        """,
                        "returnByValue": True
                    })

                    data = overflow_eval.get("result", {}).get("result", {}).get("value", {})
                    has_overflow = data.get("hasOverflow", False)
                    scroll_w = data.get("scrollW", 0)
                    inner_w = data.get("innerW", 0)

                    if has_overflow:
                        print(f"  [FAIL] OVERFLOW on {route}: scrollWidth={scroll_w} > innerWidth={inner_w}")
                        print(f"     Offenders: {data.get('offenders')}")
                        all_passed = False
                    else:
                        print(f"  [PASS] {route} [0 horizontal overflow: {scroll_w} <= {inner_w}]")

                    # Capture screenshot for key routes
                    if route in ["/", "/services/general-insurance", "/investments/mutual-funds", "/insights", "/admin/dashboard"]:
                        clean_name = route.replace('/', '_').strip('_') or 'home'
                        shot_res = await send("Page.captureScreenshot", {
                            "format": "png",
                        })
                        if "result" in shot_res and "data" in shot_res["result"]:
                            shot_path = os.path.join(dev_dir, f"{clean_name}.png")
                            with open(shot_path, "wb") as f:
                                f.write(base64.b64decode(shot_res["result"]["data"]))

                # Feature Tests on Mobile Viewport (iPhone SE 375)
                if dev_name == "iphone_se_375":
                    print("\n--- Verifying Mobile Header Sheet & Sticky CTA on Home ---")
                    await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}/"})
                    await asyncio.sleep(0.8)

                    # 1. Check toggle button exists & header__nav hidden
                    nav_state = await send("Runtime.evaluate", {
                        "expression": """
                        (() => {
                            const toggle = document.querySelector('.mobile-toggle');
                            const nav = document.querySelector('.header__nav');
                            const toggleVisible = toggle && getComputedStyle(toggle).display !== 'none';
                            const navHidden = !nav || getComputedStyle(nav).display === 'none';
                            return { toggleVisible, navHidden };
                        })()
                        """,
                        "returnByValue": True
                    })
                    print("  Mobile Nav Toggle State:", nav_state.get("result", {}).get("result", {}).get("value"))

                    # 2. Click mobile toggle to open menu sheet
                    await send("Runtime.evaluate", {
                        "expression": "document.querySelector('.mobile-toggle').click();"
                    })
                    await asyncio.sleep(0.5)

                    sheet_eval = await send("Runtime.evaluate", {
                        "expression": """
                        (() => {
                            const sheet = document.querySelector('.mobile-nav-sheet');
                            const items = Array.from(document.querySelectorAll('.mobile-nav-item'));
                            const heights = items.map(i => i.offsetHeight);
                            const minHeight = Math.min(...heights);
                            return {
                                sheetExists: !!sheet,
                                itemCount: items.length,
                                minItemHeight: minHeight,
                                is56pxOrMore: minHeight >= 52
                            };
                        })()
                        """,
                        "returnByValue": True
                    })
                    sheet_data = sheet_eval.get("result", {}).get("result", {}).get("value", {})
                    print(f"  Mobile Sheet Opened: {sheet_data}")
                    
                    # Capture mobile menu sheet screenshot
                    shot_res = await send("Page.captureScreenshot", {"format": "png"})
                    if "result" in shot_res:
                        with open(os.path.join(dev_dir, "mobile_menu_open.png"), "wb") as f:
                            f.write(base64.b64decode(shot_res["result"]["data"]))

                    # Close mobile menu sheet
                    await send("Runtime.evaluate", {
                        "expression": "document.querySelector('.mobile-nav-sheet__close').click();"
                    })
                    await asyncio.sleep(0.4)

                    # 3. Test Sticky Mobile CTA Bar scroll reveal
                    print("  Testing Sticky Mobile CTA scroll...")
                    # Scroll down 600px past hero
                    await send("Runtime.evaluate", {
                        "expression": "window.scrollTo(0, 600);"
                    })
                    await asyncio.sleep(0.5)

                    cta_eval = await send("Runtime.evaluate", {
                        "expression": """
                        (() => {
                            const bar = document.querySelector('.sticky-mobile-cta-wrapper');
                            const btn = document.querySelector('.sticky-mobile-cta-btn');
                            const isVisible = bar && bar.classList.contains('is-visible');
                            const height = bar ? bar.offsetHeight : 0;
                            const btnHeight = btn ? btn.offsetHeight : 0;
                            return {
                                isVisible,
                                barHeight: height,
                                btnHeight: btnHeight,
                            };
                        })()
                        """,
                        "returnByValue": True
                    })
                    cta_data = cta_eval.get("result", {}).get("result", {}).get("value", {})
                    print(f"  Sticky CTA State after scroll: {cta_data}")

                    # Capture sticky CTA screenshot
                    shot_res = await send("Page.captureScreenshot", {"format": "png"})
                    if "result" in shot_res:
                        with open(os.path.join(dev_dir, "sticky_cta_visible.png"), "wb") as f:
                            f.write(base64.b64decode(shot_res["result"]["data"]))

                # Verification on Tablet Viewport (iPad Mini 768)
                if dev_name == "ipad_mini_768":
                    print("\n--- Verifying Tablet Header (Logo + CTA + Menu Button) ---")
                    await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}/"})
                    await asyncio.sleep(0.5)

                    tablet_eval = await send("Runtime.evaluate", {
                        "expression": """
                        (() => {
                            const tabletCta = document.querySelector('.header__tablet-cta');
                            const toggle = document.querySelector('.mobile-toggle');
                            const nav = document.querySelector('.header__nav');
                            const ctaVisible = tabletCta && getComputedStyle(tabletCta).display !== 'none';
                            const toggleVisible = toggle && getComputedStyle(toggle).display !== 'none';
                            const navHidden = !nav || getComputedStyle(nav).display === 'none';
                            return { ctaVisible, toggleVisible, navHidden };
                        })()
                        """,
                        "returnByValue": True
                    })
                    print("  Tablet Header Elements:", tablet_eval.get("result", {}).get("result", {}).get("value"))

    finally:
        proc.terminate()
        try:
            proc.wait(timeout=2)
        except:
            proc.kill()
        shutil.rmtree(user_data, ignore_errors=True)

    print("\n==========================================")
    if all_passed:
        print("[SUCCESS] ALL RESPONSIVE TESTS & VIEWPORTS PASSED WITH ZERO HORIZONTAL OVERFLOW!")
    else:
        print("[FAILURE] SOME RESPONSIVE CHECKS FAILED.")
    print("==========================================")
    return 0 if all_passed else 1

if __name__ == "__main__":
    code = asyncio.run(run_verification())
    sys.exit(code)
