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
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace', line_buffering=True)

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
SCREENSHOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'screenshots', 'dot-nav-removed'))
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 4259
CDP_PORT = 9289

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def do_GET(self):
        potential_path = os.path.join(DIST_DIR, self.path.lstrip('/').split('?')[0])
        if not os.path.exists(potential_path) or os.path.isdir(potential_path):
            self.path = '/index.html'
        return super().do_GET()

    def log_message(self, format, *args):
        pass

def run_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), SPAHandler) as httpd:
        httpd.serve_forever()

async def main():
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)

    # 1. Start Server
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    print(f"[INIT] Local test server started on http://127.0.0.1:{PORT}")

    # 2. Launch Chrome
    temp_profile = tempfile.mkdtemp(prefix="chrome_dot_nav_v3_")
    chrome_cmd = [
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={CDP_PORT}",
        f"--user-data-dir={temp_profile}",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-extensions",
        "about:blank",
    ]
    proc = subprocess.Popen(chrome_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(2.0)

    try:
        req = urllib.request.urlopen(f"http://127.0.0.1:{CDP_PORT}/json", timeout=4)
        tabs = json.loads(req.read().decode())
        page_target = next(t for t in tabs if t.get('type') == 'page')
        ws_url = page_target["webSocketDebuggerUrl"]

        async with websockets.connect(ws_url, max_size=100 * 1024 * 1024) as ws:
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

            async def evaluate(expr):
                resp = await send("Runtime.evaluate", {
                    "expression": expr,
                    "returnByValue": True,
                })
                val = resp.get("result", {})
                if isinstance(val, dict) and "result" in val:
                    return val["result"].get("value")
                return val.get("value")

            async def set_viewport(width, height, is_mobile=False):
                await send("Emulation.setDeviceMetricsOverride", {
                    "width": width,
                    "height": height,
                    "deviceScaleFactor": 1,
                    "mobile": is_mobile,
                })

            async def navigate(path):
                await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}{path}"})
                await asyncio.sleep(1.8)

            async def take_screenshot(filename):
                resp = await send("Page.captureScreenshot", {"format": "png"})
                b64 = resp["result"]["data"]
                out_path = os.path.join(SCREENSHOT_DIR, filename)
                with open(out_path, "wb") as f:
                    f.write(base64.b64decode(b64))
                print(f"  [SAVED] {filename}")

            async def verify_and_capture(filename, width, height, route, is_mobile=False, scroll_y=0):
                await set_viewport(width, height, is_mobile)
                await navigate(route)
                if scroll_y > 0:
                    await evaluate(f"window.scrollTo(0, {scroll_y});")
                    await asyncio.sleep(0.5)

                # Audit check
                check = await evaluate("""
                (() => {
                    const dotNav = document.querySelector('.dot-navigator');
                    const dotTestId = document.querySelector('[data-testid="dot-navigator"]');
                    const ariaNav = document.querySelector('[aria-label*="Section navigation"]');
                    const dotItems = document.querySelectorAll('.dot-nav-item');
                    const overflow = document.documentElement.scrollWidth > window.innerWidth;
                    return {
                        hasDotNav: !!dotNav,
                        hasDotTestId: !!dotTestId,
                        hasAriaNav: !!ariaNav,
                        dotItemCount: dotItems.length,
                        hasOverflow: overflow,
                        scrollWidth: document.documentElement.scrollWidth,
                        innerWidth: window.innerWidth
                    };
                })()
                """)

                print(f"[{route} @ {width}x{height}] Verification:")
                print(f"  hasDotNav: {check.get('hasDotNav')}")
                print(f"  hasDotTestId: {check.get('hasDotTestId')}")
                print(f"  hasAriaNav: {check.get('hasAriaNav')}")
                print(f"  dotItemCount: {check.get('dotItemCount')}")
                print(f"  hasOverflow: {check.get('hasOverflow')} (scrollWidth={check.get('scrollWidth')}, innerWidth={check.get('innerWidth')})")

                assert not check.get('hasDotNav'), f"Dot navigator found on {route}"
                assert not check.get('hasDotTestId'), f"Dot navigator test id found on {route}"
                assert not check.get('hasAriaNav'), f"Section navigation found on {route}"
                assert check.get('dotItemCount') == 0, f"Dot items found on {route}"
                assert not check.get('hasOverflow'), f"Horizontal overflow on {route}"

                await take_screenshot(filename)

            print("\n=== STARTING DOT NAVIGATOR REMOVAL VERIFICATION & SCREENSHOTS ===")

            # 1. 1440px Home
            await verify_and_capture("01_1440_home_no_dot_nav.png", 1440, 900, "/")

            # 2. 1440px Mutual Funds
            await verify_and_capture("02_1440_mutual_funds_no_dot_nav.png", 1440, 900, "/investments/mutual-funds")

            # 3. 1440px Equity
            await verify_and_capture("03_1440_equity_no_dot_nav.png", 1440, 900, "/investments/equity")

            # 4. 1440px Insights
            await verify_and_capture("04_1440_insights_no_dot_nav.png", 1440, 900, "/insights")

            # 5. 1440px Services Hub
            await verify_and_capture("05_1440_services_no_dot_nav.png", 1440, 900, "/services")

            # 6. 1440px About Us
            await verify_and_capture("06_1440_about_no_dot_nav.png", 1440, 900, "/about-us")

            # 7. 1920px Ultra-Wide Home (Right edge audit)
            await verify_and_capture("07_1920_home_right_edge.png", 1920, 1080, "/")

            # 8. 1024px Tablet Life Insurance
            await verify_and_capture("08_1024_life_insurance_tablet.png", 1024, 768, "/services/life-insurance")

            # 9. 375px Mobile Home
            await verify_and_capture("09_375_home_mobile.png", 375, 667, "/", is_mobile=True)

            print("\n=== ALL 9 CHECKS PASSED & SCREENSHOTS CAPTURED SUCCESSFULLY ===")

    except Exception as e:
        print(f"[ERROR] Exception during CDP execution: {e}")
        raise
    finally:
        proc.kill()
        proc.wait()
        shutil.rmtree(temp_profile, ignore_errors=True)

if __name__ == "__main__":
    asyncio.run(main())
