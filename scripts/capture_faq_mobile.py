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

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DIST_DIR = os.path.join(ROOT_DIR, 'frontend', 'dist')
SCREENSHOT_DIR = os.path.join(ROOT_DIR, 'docs', 'screenshots', 'faq-mobile')
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 4293
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

TARGETS = [
    {"name": "equity_faq_360px.png", "url": "/investments/equity", "anchor": "faqs"},
    {"name": "home_faq_360px.png", "url": "/", "anchor": "faq"},
    {"name": "general_insurance_faq_360px.png", "url": "/services/general-insurance", "anchor": "faqs"},
    {"name": "life_insurance_faq_360px.png", "url": "/services/life-insurance", "anchor": "faqs"},
    {"name": "health_insurance_faq_360px.png", "url": "/services/health-insurance", "anchor": "faqs"},
    {"name": "mutual_funds_faq_360px.png", "url": "/investments/mutual-funds", "anchor": "faqs"},
    {"name": "article_faq_360px.png", "url": "/insights/navigating-market-volatility", "anchor": "faqs"},
]

async def main():
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)

    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    print(f"[INIT] Server running on http://127.0.0.1:{PORT}")

    temp_profile = tempfile.mkdtemp(prefix="chrome_faq_")
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
    time.sleep(2.5)

    try:
        req = urllib.request.urlopen(f"http://127.0.0.1:{CDP_PORT}/json", timeout=6)
        tabs = json.loads(req.read().decode())
        page_target = next(t for t in tabs if t.get('type') == 'page')
        ws_url = page_target["webSocketDebuggerUrl"]
    except Exception as e:
        print(f"[FAIL] Could not connect to Chrome CDP: {e}")
        proc.kill()
        shutil.rmtree(temp_profile, ignore_errors=True)
        return

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

        # Set mobile viewport 360x780 (standard Galaxy A55 width)
        await send("Emulation.setDeviceMetricsOverride", {
            "width": 360,
            "height": 780,
            "deviceScaleFactor": 2.0,
            "mobile": True,
        })
        await send("Emulation.setVisibleSize", {"width": 360, "height": 780})

        for t in TARGETS:
            print(f"[CAPTURE] Loading {t['url']}...")
            await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}{t['url']}"})
            await asyncio.sleep(1.0)
            for _ in range(25):
                ready = await evaluate("document.readyState")
                if ready == "complete":
                    break
                await asyncio.sleep(0.1)

            # Scroll to FAQ anchor
            await evaluate(f"""
                (() => {{
                    const el = document.getElementById('{t["anchor"]}') || document.querySelector('.faq-section, .faq-layout');
                    if (el) {{
                        el.scrollIntoView({{ behavior: 'instant', block: 'start' }});
                    }}
                }})()
            """)
            await asyncio.sleep(0.6)

            # Open first FAQ item if present
            await evaluate("""
                (() => {
                    const btn = document.querySelector('.faq-card-button, .home-faq-button');
                    if (btn && btn.getAttribute('aria-expanded') !== 'true') {
                        btn.click();
                    }
                })()
            """)
            await asyncio.sleep(0.4)

            # Capture screenshot
            res = await send("Page.captureScreenshot", {"format": "png"})
            data = res["result"]["data"]
            out_path = os.path.join(SCREENSHOT_DIR, t["name"])
            with open(out_path, "wb") as f:
                f.write(base64.b64decode(data))
            print(f"[SAVED] {out_path}")

    proc.kill()
    shutil.rmtree(temp_profile, ignore_errors=True)
    print("[DONE] All 360px FAQ screenshots captured successfully.")

if __name__ == '__main__':
    asyncio.run(main())

