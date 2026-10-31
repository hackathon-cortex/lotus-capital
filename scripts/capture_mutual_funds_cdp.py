import asyncio
import http.server
import socketserver
import os
import subprocess
import threading
import time
import json
import base64
import urllib.request
import websockets
import tempfile
import shutil

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
SCREENSHOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'screenshots', 'mutual-funds-v2'))
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 4211
CDP_PORT = 9241

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

def run_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), SPAHandler) as httpd:
        httpd.serve_forever()

async def capture_all():
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)
    print(f"Dist dir: {DIST_DIR}", flush=True)
    print(f"Screenshot dir: {SCREENSHOT_DIR}", flush=True)

    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    await asyncio.sleep(1)

    captures = [
        # 1. Hero & period tabs
        ('hero', '01-hero', None),
        ('hero', '01-hero-period-1y', "Array.from(document.querySelectorAll('.mf-hero-scheme-card button')).find(b => b.textContent === '1Y')?.click();"),
        ('hero', '01-hero-period-3y', "Array.from(document.querySelectorAll('.mf-hero-scheme-card button')).find(b => b.textContent === '3Y')?.click();"),
        ('hero', '01-hero-period-5y', "Array.from(document.querySelectorAll('.mf-hero-scheme-card button')).find(b => b.textContent === '5Y')?.click();"),
        ('hero', '01-hero-period-10y', "Array.from(document.querySelectorAll('.mf-hero-scheme-card button')).find(b => b.textContent === '10Y')?.click();"),

        # 2. SIP Board (One calculator) at 3 positions
        ('sip-calculator', '02-sip-calculator-pos0', None),
        ('sip-calculator', '02-sip-calculator-pos1', "Array.from(document.querySelectorAll('.sip-illustration-frame button')).find(b => b.textContent === '5Y')?.click();"),
        ('sip-calculator', '02-sip-calculator-pos2', "Array.from(document.querySelectorAll('.sip-illustration-frame button')).find(b => b.textContent === '20Y')?.click();"),

        # 3. Three Ways to Invest
        ('ways-to-invest', '03-ways-to-invest', None),

        # 4. Fund Category Explorer (all 5 tabs)
        ('categories', '04-categories-equity', "Array.from(document.querySelectorAll('.category-tabs-column button')).find(b => b.textContent.includes('Equity'))?.click();"),
        ('categories', '04-categories-debt', "Array.from(document.querySelectorAll('.category-tabs-column button')).find(b => b.textContent.includes('Debt'))?.click();"),
        ('categories', '04-categories-hybrid', "Array.from(document.querySelectorAll('.category-tabs-column button')).find(b => b.textContent.includes('Hybrid'))?.click();"),
        ('categories', '04-categories-index', "Array.from(document.querySelectorAll('.category-tabs-column button')).find(b => b.textContent.includes('Index'))?.click();"),
        ('categories', '04-categories-elss', "Array.from(document.querySelectorAll('.category-tabs-column button')).find(b => b.textContent.includes('ELSS'))?.click();"),

        # 5. Compare Section (Both switches in both states)
        ('compare', '05-compare-methods-sip', "Array.from(document.querySelectorAll('.mf-compare-section button')).find(b => b.textContent.includes('How you invest'))?.click(); Array.from(document.querySelectorAll('.mf-compare-module button')).find(b => b.textContent.includes('Systematic Investment Plan'))?.click();"),
        ('compare', '05-compare-methods-lumpsum', "Array.from(document.querySelectorAll('.mf-compare-section button')).find(b => b.textContent.includes('How you invest'))?.click(); Array.from(document.querySelectorAll('.mf-compare-module button')).find(b => b.textContent.includes('Lump Sum'))?.click();"),
        ('compare', '05-compare-plans-regular', "Array.from(document.querySelectorAll('.mf-compare-section button')).find(b => b.textContent.includes('Which plan'))?.click(); Array.from(document.querySelectorAll('.mf-compare-module button')).find(b => b.textContent.includes('Regular Plan'))?.click();"),
        ('compare', '05-compare-plans-direct', "Array.from(document.querySelectorAll('.mf-compare-section button')).find(b => b.textContent.includes('Which plan'))?.click(); Array.from(document.querySelectorAll('.mf-compare-module button')).find(b => b.textContent.includes('Direct Plan'))?.click();"),

        # 6. FAQ & Disclosure
        ('faqs', '06-faqs', None),

        # 7. Enquiry Panel
        ('enquiry', '07-enquiry', None),
    ]

    viewports = [
        (1440, 900, '1440'),
        (375, 812, '375'),
    ]

    for width, height, vp_label in viewports:
        print(f"\n--- Launching Chrome for Viewport {vp_label}px ({width}x{height}) ---", flush=True)
        user_data = tempfile.mkdtemp(prefix=f"chrome_cdp_mf_{vp_label}_")
        chrome_cmd = [
            CHROME_PATH,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            f"--user-data-dir={user_data}",
            f"--remote-debugging-port={CDP_PORT}",
            f"--window-size={width},{height}",
            f"http://127.0.0.1:{PORT}/investments/mutual-funds",
        ]
        proc = subprocess.Popen(chrome_cmd)
        await asyncio.sleep(2.5)

        try:
            req = urllib.request.urlopen(f"http://127.0.0.1:{CDP_PORT}/json")
            targets = json.loads(req.read().decode())
            page_target = next(t for t in targets if t.get('type') == 'page')
            ws_url = page_target["webSocketDebuggerUrl"]
            print(f"Connected to CDP page target: {page_target.get('title', '')}", flush=True)

            async with websockets.connect(ws_url, max_size=50*1024*1024) as ws:
                msg_id = 1

                async def send_cmd(method, params=None):
                    nonlocal msg_id
                    cmd = {"id": msg_id, "method": method, "params": params or {}}
                    msg_id += 1
                    await ws.send(json.dumps(cmd))
                    while True:
                        res = await ws.recv()
                        data = json.loads(res)
                        if data.get("id") == cmd["id"]:
                            return data

                await send_cmd("Page.enable")
                await send_cmd("Runtime.enable")
                await send_cmd("DOM.enable")

                await asyncio.sleep(1.5)

                for sec_id, slug, extra_js in captures:
                    out_file = os.path.join(SCREENSHOT_DIR, f"{slug}-{vp_label}.png")
                    print(f"Positioning to #{sec_id} for {slug}-{vp_label}...", flush=True)

                    scroll_expr = f"""
                    (function() {{
                        const el = document.getElementById('{sec_id}');
                        if (el) {{
                            const top = Math.max(0, el.offsetTop - 70);
                            window.scrollTo({{ top: top, behavior: 'instant' }});
                            return true;
                        }}
                        return false;
                    }})();
                    """
                    await send_cmd("Runtime.evaluate", {"expression": scroll_expr})
                    await asyncio.sleep(0.4)

                    if extra_js:
                        await send_cmd("Runtime.evaluate", {"expression": extra_js})
                        await asyncio.sleep(0.4)

                    # Trigger scroll event
                    await send_cmd("Runtime.evaluate", {"expression": "window.dispatchEvent(new Event('scroll'));"})
                    await asyncio.sleep(0.3)

                    shot_res = await send_cmd("Page.captureScreenshot", {"format": "png"})
                    img_b64 = shot_res.get("result", {}).get("data")
                    if img_b64:
                        with open(out_file, "wb") as f:
                            f.write(base64.b64decode(img_b64))
                        size_kb = os.path.getsize(out_file) / 1024
                        print(f"  [OK] Saved {slug}-{vp_label}.png ({size_kb:.1f} KB)", flush=True)
                    else:
                        print(f"  [FAIL] No image data returned for {slug}-{vp_label}", flush=True)

        finally:
            proc.terminate()
            proc.wait()
            shutil.rmtree(user_data, ignore_errors=True)
            await asyncio.sleep(1)

    print("\nAll Mutual Funds v2 CDP screenshots captured successfully!", flush=True)

if __name__ == '__main__':
    asyncio.run(capture_all())

