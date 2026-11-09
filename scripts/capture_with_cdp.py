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

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
SCREENSHOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'screenshots', 'home-v2'))
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 4175
CDP_PORT = 9225

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def do_GET(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path):
            self.path = '/index.html'
        return super().do_GET()

    def log_message(self, format, *args):
        pass

def run_server():
    with socketserver.TCPServer(("127.0.0.1", PORT), SPAHandler) as httpd:
        httpd.serve_forever()

async def capture_sections():
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)

    # Start static server
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    time.sleep(1)

    sections = [
        ('hero', '01-hero'),
        ('about', '02-about'),
        ('services', '03-services'),
        ('mutual-funds', '04-sip-calculator'),
        ('equity', '05-equity'),
        ('insurance', '06-insurance'),
        ('trust', '07-trust'),
        ('partners', '08-partners'),
        ('process', '08b-how-we-work'),
        ('learn', '11-learn'),
        ('faq', '09-faq'),
        ('enquiry', '10-enquiry'),
    ]

    viewports = [
        (1440, 900, '1440'),
        (375, 812, '375'),
    ]

    for width, height, vp_label in viewports:
        print(f"\n--- Launching Chrome for Viewport {vp_label}px ({width}x{height}) ---")
        chrome_cmd = [
            CHROME_PATH,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            f"--remote-debugging-port={CDP_PORT}",
            f"--window-size={width},{height}",
            "about:blank",
        ]
        proc = subprocess.Popen(chrome_cmd)
        await asyncio.sleep(1.5)

        try:
            # Query CDP targets
            req = urllib.request.urlopen(f"http://127.0.0.1:{CDP_PORT}/json")
            targets = json.loads(req.read().decode())
            ws_url = targets[0]["webSocketDebuggerUrl"]

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

                # Enable Page and Runtime
                await send_cmd("Page.enable")
                await send_cmd("Runtime.enable")
                await send_cmd("DOM.enable")

                # Navigate to Home
                print(f"Navigating to http://127.0.0.1:{PORT}/ ...")
                await send_cmd("Page.navigate", {"url": f"http://127.0.0.1:{PORT}/"})
                await asyncio.sleep(2.0)

                # Force all [data-reveal] to be visible for screenshot capture
                await send_cmd("Runtime.evaluate", {
                    "expression": "document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'))"
                })
                await asyncio.sleep(0.5)

                for sec_id, slug in sections:
                    out_file = os.path.join(SCREENSHOT_DIR, f"{slug}-{vp_label}.png")
                    print(f"Scrolling to #{sec_id} for {slug}-{vp_label}...")

                    # Scroll element into view with alignment
                    scroll_expr = f"""
                    (function() {{
                        const el = document.getElementById('{sec_id}');
                        if (el) {{
                            el.scrollIntoView({{ behavior: 'instant', block: 'start' }});
                            return true;
                        }}
                        return false;
                    }})();
                    """
                    await send_cmd("Runtime.evaluate", {"expression": scroll_expr})
                    await asyncio.sleep(0.6)

                    # Re-trigger visible class
                    await send_cmd("Runtime.evaluate", {
                        "expression": "document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'))"
                    })
                    await asyncio.sleep(0.4)

                    # Capture screenshot
                    shot_res = await send_cmd("Page.captureScreenshot", {"format": "png"})
                    img_b64 = shot_res.get("result", {}).get("data")
                    if img_b64:
                        with open(out_file, "wb") as f:
                            f.write(base64.b64decode(img_b64))
                        size_kb = os.path.getsize(out_file) / 1024
                        print(f"  [OK] Saved {slug}-{vp_label}.png ({size_kb:.1f} KB)")
                    else:
                        print(f"  [FAIL] No image data returned for {slug}-{vp_label}")

        finally:
            proc.terminate()
            proc.wait()
            await asyncio.sleep(1)

    print("\nAll CDP screenshots captured successfully!")

if __name__ == '__main__':
    asyncio.run(capture_sections())
