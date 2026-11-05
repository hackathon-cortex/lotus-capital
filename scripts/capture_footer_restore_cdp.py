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

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
SCREENSHOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'screenshots', 'footer-v2'))
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 4242
CDP_PORT = 9272

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

async def capture_footer_shots():
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    await asyncio.sleep(1)

    # 1. Desktop 1440px Footer
    user_data = tempfile.mkdtemp(prefix="chrome_footer_1440_")
    chrome_cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        f"--user-data-dir={user_data}",
        f"--remote-debugging-port={CDP_PORT}",
        f"--window-size=1440,900",
        f"http://127.0.0.1:{PORT}/about-us",
    ]
    proc = subprocess.Popen(chrome_cmd)
    await asyncio.sleep(2.5)

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

            # Scroll to footer
            await send("Runtime.evaluate", {
                "expression": "window.scrollTo(0, document.body.scrollHeight)"
            })
            await asyncio.sleep(1.0)

            # Measure footer dimensions & coordinates
            eval_res = await send("Runtime.evaluate", {
                "expression": """
                (() => {
                    const footer = document.querySelector('footer');
                    const grid = document.querySelector('.site-footer__grid');
                    const cols = Array.from(document.querySelectorAll('.site-footer__col'));
                    const rects = cols.map(c => ({
                        className: c.className,
                        top: c.getBoundingClientRect().top,
                        left: c.getBoundingClientRect().left,
                        width: c.getBoundingClientRect().width,
                        height: c.getBoundingClientRect().height
                    }));
                    return {
                        footerHeight: footer ? footer.offsetHeight : 0,
                        gridColumns: window.getComputedStyle(grid).gridTemplateColumns,
                        colRects: rects
                    };
                })()
                """,
                "returnByValue": True
            })
            print("Desktop 1440px Footer measurements:", json.dumps(eval_res.get("result", {}).get("value"), indent=2))

            shot = await send("Page.captureScreenshot", {"format": "png"})
            out_path = os.path.join(SCREENSHOT_DIR, "footer_desktop_1440.png")
            with open(out_path, "wb") as f:
                f.write(base64.b64decode(shot["result"]["data"]))
            print("Captured: footer_desktop_1440.png", flush=True)
    finally:
        proc.terminate()
        proc.wait()
        shutil.rmtree(user_data, ignore_errors=True)

    # 2. Mobile 375px Footer
    user_data_m = tempfile.mkdtemp(prefix="chrome_footer_375_")
    chrome_cmd_m = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        f"--user-data-dir={user_data_m}",
        f"--remote-debugging-port={CDP_PORT}",
        f"--window-size=375,812",
        f"http://127.0.0.1:{PORT}/about-us",
    ]
    proc_m = subprocess.Popen(chrome_cmd_m)
    await asyncio.sleep(2.5)

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
            await send("Emulation.setDeviceMetricsOverride", {
                "width": 375,
                "height": 812,
                "deviceScaleFactor": 2,
                "mobile": True,
            })
            await asyncio.sleep(0.5)

            # Scroll to footer
            await send("Runtime.evaluate", {
                "expression": "window.scrollTo(0, document.body.scrollHeight)"
            })
            await asyncio.sleep(1.0)

            # Measure mobile footer stacking
            eval_res_m = await send("Runtime.evaluate", {
                "expression": """
                (() => {
                    const cols = Array.from(document.querySelectorAll('.site-footer__col'));
                    return cols.map(c => ({
                        className: c.className,
                        top: c.getBoundingClientRect().top,
                        order: window.getComputedStyle(c).order
                    }));
                })()
                """,
                "returnByValue": True
            })
            print("Mobile 375px Footer stacking:", json.dumps(eval_res_m.get("result", {}).get("value"), indent=2))

            shot = await send("Page.captureScreenshot", {"format": "png"})
            out_path = os.path.join(SCREENSHOT_DIR, "footer_mobile_375.png")
            with open(out_path, "wb") as f:
                f.write(base64.b64decode(shot["result"]["data"]))
            print("Captured: footer_mobile_375.png", flush=True)
    finally:
        proc_m.terminate()
        proc_m.wait()
        shutil.rmtree(user_data_m, ignore_errors=True)

    print("All footer screenshots and measurements captured successfully!", flush=True)

if __name__ == '__main__':
    asyncio.run(capture_footer_shots())

