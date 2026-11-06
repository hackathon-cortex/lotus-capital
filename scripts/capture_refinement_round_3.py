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
SCREENSHOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'screenshots', 'refinement-round-3'))
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 4280
CDP_PORT = 9295

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
    temp_profile = tempfile.mkdtemp(prefix="chrome_refinement_r3_")
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

            async def capture_screen(filename):
                res = await send("Page.captureScreenshot", {"format": "png"})
                img_data = base64.b64decode(res["result"]["data"])
                out_path = os.path.join(SCREENSHOT_DIR, filename)
                with open(out_path, "wb") as f:
                    f.write(img_data)
                print(f"[SCREENSHOT] Saved: {filename}")

            await send("Page.enable")
            await send("DOM.enable")

            # -------------------------------------------------------------
            # 1. Desktop: Home Scrolled (Header backdrop over content)
            # -------------------------------------------------------------
            await set_viewport(1440, 900)
            await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}/"})
            await asyncio.sleep(2.0)
            await evaluate("window.scrollTo(0, 320)")
            await asyncio.sleep(0.5)
            await capture_screen("01-home-header-scrolled-backdrop-1440.png")

            # -------------------------------------------------------------
            # 2. Desktop: Home Equity board (navy-800 cards on navy-900)
            # -------------------------------------------------------------
            await evaluate("document.getElementById('equity')?.scrollIntoView({ block: 'center' })")
            await asyncio.sleep(0.6)
            await capture_screen("02-home-equity-navy800-card-1440.png")

            # -------------------------------------------------------------
            # 3. Desktop: Home How We Work PinnedStage
            # -------------------------------------------------------------
            await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}/?progress=0.45#process"})
            await asyncio.sleep(1.5)
            await capture_screen("03-home-how-we-work-stage-1440.png")

            # -------------------------------------------------------------
            # 4. Desktop: Home Learn Before You Invest (3 equal cards in 1 row)
            # -------------------------------------------------------------
            await evaluate("document.getElementById('learn')?.scrollIntoView({ block: 'center' })")
            await asyncio.sleep(0.6)
            await capture_screen("04-home-learn-cards-1row-1440.png")

            # -------------------------------------------------------------
            # 5. Desktop: About Our Journey Timeline
            # -------------------------------------------------------------
            await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}/about-us?progress=0.35#journey"})
            await asyncio.sleep(1.8)
            await capture_screen("05-about-our-journey-timeline-1440.png")

            # -------------------------------------------------------------
            # 6. Desktop: General Insurance Hero & StepScroller
            # -------------------------------------------------------------
            await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}/services/general-insurance?stepProgress=0.4#process"})
            await asyncio.sleep(1.8)
            await capture_screen("06-general-insurance-stepscroller-1440.png")

            # -------------------------------------------------------------
            # 7. Desktop: Health Insurance Timeline (alternating cards, no 1-letter squish)
            # -------------------------------------------------------------
            await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}/services/health-insurance?timelineProgress=0.3#process"})
            await asyncio.sleep(1.8)
            await evaluate("document.getElementById('process')?.scrollIntoView({ block: 'center' })")
            await asyncio.sleep(0.6)
            await capture_screen("07-health-insurance-process-timeline-1440.png")

            # -------------------------------------------------------------
            # 8. Desktop: Equity Broking Partner Frame & Rotating Seal Ring
            # -------------------------------------------------------------
            await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}/investments/equity#broking"})
            await asyncio.sleep(1.8)
            await evaluate("document.getElementById('broking')?.scrollIntoView({ block: 'center' })")
            await asyncio.sleep(0.6)
            await capture_screen("08-equity-broking-seal-frame-1440.png")

            # -------------------------------------------------------------
            # 9. Mobile (375px): Home
            # -------------------------------------------------------------
            await set_viewport(375, 812, is_mobile=True)
            await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}/"})
            await asyncio.sleep(1.8)
            await capture_screen("09-home-mobile-375.png")

            # -------------------------------------------------------------
            # 10. Mobile (375px): General Insurance Vertical Timeline Fallback
            # -------------------------------------------------------------
            await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}/services/general-insurance#process"})
            await asyncio.sleep(1.5)
            await evaluate("document.getElementById('process')?.scrollIntoView({ block: 'start' })")
            await asyncio.sleep(0.6)
            await capture_screen("10-gi-mobile-vertical-steps-375.png")

            # -------------------------------------------------------------
            # 11. Mobile (375px): Health Insurance Vertical Timeline Fallback
            # -------------------------------------------------------------
            await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}/services/health-insurance#process"})
            await asyncio.sleep(1.5)
            await evaluate("document.getElementById('process')?.scrollIntoView({ block: 'start' })")
            await asyncio.sleep(0.6)
            await capture_screen("11-health-mobile-timeline-375.png")

            print("\n[SUCCESS] All 11 verification screenshots captured!")

    finally:
        proc.terminate()
        try:
            proc.wait(timeout=2)
        except subprocess.TimeoutExpired:
            proc.kill()
        time.sleep(0.5)
        shutil.rmtree(temp_profile, ignore_errors=True)

if __name__ == '__main__':
    asyncio.run(main())

