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
SCREENSHOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'screenshots', 'insights-v2'))
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 4214
CDP_PORT = 9244

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

    pages = [
        {
            'url': f"http://127.0.0.1:{PORT}/insights",
            'captures': [
                # 1. Hero with search and category pills
                ('hero', '01-listing-hero', None),
                # 2. Featured Guide Card
                ('featured', '02-listing-featured', None),
                # 3. Complete Library Bento Grid
                ('library', '03-listing-library-bento', None),
                # 4. Curated Learning Paths
                ('paths', '04-listing-learning-paths', None),
                # 5. Jargon Buster Front Cards
                ('jargon', '05-listing-jargon-front', None),
                # 6. Jargon Buster Flipped Card
                ('jargon', '06-listing-jargon-flipped', """
                    const card = document.querySelector('.jargon-flip-card-container');
                    if (card) {
                        card.click();
                    }
                """),
                # 7. Enquiry Section
                ('enquiry', '07-listing-enquiry', None),
            ]
        },
        {
            'url': f"http://127.0.0.1:{PORT}/insights/mutual-funds-direct-vs-regular-plan",
            'captures': [
                # 8. Article Hero
                (None, '08-article-hero', "window.scrollTo({ top: 0, behavior: 'instant' });"),
                # 9. Table of Contents & Takeaways
                (None, '09-article-toc-takeaways', """
                    const el = document.querySelector('.article-layout-grid');
                    if (el) {
                        const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
                        window.scrollTo({ top: top, behavior: 'instant' });
                    }
                """),
                # 10. Compare Table
                (None, '10-article-compare-table', """
                    const el = document.querySelector('table');
                    if (el) {
                        const top = el.getBoundingClientRect().top + window.pageYOffset - 140;
                        window.scrollTo({ top: top, behavior: 'instant' });
                    }
                """),
                # 11. Questions Checklist & Disclaimer
                (None, '11-article-checklist-disclaimer', """
                    const el = document.getElementById('questions-to-ask') || document.querySelector('.article-content-body');
                    if (el) {
                        const top = el.getBoundingClientRect().top + window.pageYOffset - 120;
                        window.scrollTo({ top: top, behavior: 'instant' });
                    }
                """),
                # 12. Local Advisory & Navigation
                (None, '12-article-footer-nav', """
                    window.scrollTo({ top: document.body.scrollHeight - 1200, behavior: 'instant' });
                """),
            ]
        }
    ]

    viewports = [
        (1440, 900, '1440'),
        (375, 812, '375'),
    ]

    for width, height, vp_label in viewports:
        for page_info in pages:
            url = page_info['url']
            print(f"\n--- Launching Chrome for {url} at Viewport {vp_label}px ({width}x{height}) ---", flush=True)
            user_data = tempfile.mkdtemp(prefix=f"chrome_cdp_insights_{vp_label}_")
            chrome_cmd = [
                CHROME_PATH,
                "--headless=new",
                "--disable-gpu",
                "--hide-scrollbars",
                f"--user-data-dir={user_data}",
                f"--remote-debugging-port={CDP_PORT}",
                f"--window-size={width},{height}",
                url,
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
                        "width": width,
                        "height": height,
                        "deviceScaleFactor": 2,
                        "mobile": width <= 500,
                    })
                    await asyncio.sleep(1.0)

                    for sec_id, filename, script in page_info['captures']:
                        if sec_id:
                            scroll_script = f"""
                                (() => {{
                                    const el = document.getElementById('{sec_id}');
                                    if (el) {{
                                        const absTop = el.getBoundingClientRect().top + window.pageYOffset;
                                        window.scrollTo({{ top: Math.max(0, absTop - 70), behavior: 'instant' }});
                                    }}
                                }})()
                            """
                            await send("Runtime.evaluate", {"expression": scroll_script})
                            await asyncio.sleep(0.4)

                        if script:
                            await send("Runtime.evaluate", {"expression": script})
                            await asyncio.sleep(0.4)

                        shot = await send("Page.captureScreenshot", {"format": "png"})
                        data = base64.b64decode(shot["result"]["data"])
                        out_path = os.path.join(SCREENSHOT_DIR, f"{filename}-{vp_label}.png")
                        with open(out_path, "wb") as f:
                            f.write(data)
                        print(f"  [SAVED] {os.path.basename(out_path)} ({len(data)} bytes)", flush=True)

            finally:
                proc.terminate()
                try:
                    proc.wait(timeout=3)
                except subprocess.TimeoutExpired:
                    proc.kill()
                shutil.rmtree(user_data, ignore_errors=True)
                await asyncio.sleep(0.5)

    print("\nAll CDP captures completed successfully!", flush=True)

if __name__ == "__main__":
    asyncio.run(capture_all())

