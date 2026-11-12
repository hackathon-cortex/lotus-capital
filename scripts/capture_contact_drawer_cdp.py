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
SCREENSHOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'screenshots', 'contact-drawer'))
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 4224
CDP_PORT = 9254

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
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    await asyncio.sleep(1)

    targets = [
        {
            'url': f"http://127.0.0.1:{PORT}/?contact=open",
            'name': '01_desktop_contact_drawer_default.png',
            'width': 1440,
            'height': 900
        },
        {
            'url': f"http://127.0.0.1:{PORT}/?contact=open&service=mutual-funds",
            'name': '02_desktop_contact_drawer_mf_preselected.png',
            'width': 1440,
            'height': 900
        },
        {
            'url': f"http://127.0.0.1:{PORT}/contact-us?service=equity",
            'name': '03_desktop_contact_us_redirect_equity.png',
            'width': 1440,
            'height': 900
        },
        {
            'url': f"http://127.0.0.1:{PORT}/?contact=open",
            'name': '04_mobile_contact_drawer_default.png',
            'width': 375,
            'height': 812
        },
        {
            'url': f"http://127.0.0.1:{PORT}/?contact=open&service=general-insurance",
            'name': '05_mobile_contact_drawer_gi_preselected.png',
            'width': 375,
            'height': 812
        }
    ]

    for target in targets:
        user_data = tempfile.mkdtemp(prefix="chrome_cdp_drawer_")
        chrome_cmd = [
            CHROME_PATH,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            f"--user-data-dir={user_data}",
            f"--remote-debugging-port={CDP_PORT}",
            f"--window-size={target['width']},{target['height']}",
            target['url'],
        ]
        proc = subprocess.Popen(chrome_cmd)
        await asyncio.sleep(2.5)

        try:
            req = urllib.request.urlopen(f"http://127.0.0.1:{CDP_PORT}/json")
            tabs = json.loads(req.read().decode())
            page_target = next(t for t in tabs if t.get('type') == 'page')
            ws_url = page_target["webSocketDebuggerUrl"]

            async with websockets.connect(ws_url, max_size=50*1024*1024) as ws:
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
                    "width": target['width'],
                    "height": target['height'],
                    "deviceScaleFactor": 2,
                    "mobile": target['width'] <= 500,
                })
                await asyncio.sleep(1.0)

                shot = await send("Page.captureScreenshot", {"format": "png"})
                out_path = os.path.join(SCREENSHOT_DIR, target['name'])
                with open(out_path, "wb") as f:
                    f.write(base64.b64decode(shot["result"]["data"]))
                print(f"Captured: {target['name']}", flush=True)

        finally:
            proc.terminate()
            proc.wait()
            shutil.rmtree(user_data, ignore_errors=True)

    print("All ContactDrawer screenshots successfully captured!", flush=True)

if __name__ == '__main__':
    asyncio.run(capture_all())
