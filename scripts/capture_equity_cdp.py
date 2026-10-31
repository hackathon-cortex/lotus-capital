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
SCREENSHOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'screenshots', 'equity-v2'))
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 4212
CDP_PORT = 9242

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
        # 1. Hero & Market Board
        ('hero', '01-hero', None),

        # 2. Broking Partner Frame (Single Viewport)
        ('broking', '02-broking-partner', None),

        # 3. Services Stage (Market floor layout - each tab)
        ('services', '03-services-tab0-demat', "Array.from(document.querySelectorAll('.equity-tab-item'))[0]?.click();"),
        ('services', '03-services-tab1-trading', "Array.from(document.querySelectorAll('.equity-tab-item'))[1]?.click();"),
        ('services', '03-services-tab2-ipo', "Array.from(document.querySelectorAll('.equity-tab-item'))[2]?.click();"),
        ('services', '03-services-tab3-education', "Array.from(document.querySelectorAll('.equity-tab-item'))[3]?.click();"),

        # 4. Account Journey (Graph stepped line at 0%, 25%, 50%, 75%, 100%)
        ('journey', '04-journey-progress-00', """
            const j = document.getElementById('journey');
            if (j) {
                const absTop = j.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({ top: absTop, behavior: 'instant' });
            }
        """),
        ('journey', '04-journey-progress-25', """
            const j = document.getElementById('journey');
            if (j) {
                const absTop = j.getBoundingClientRect().top + window.pageYOffset;
                const scrollDist = (j.offsetHeight - window.innerHeight) * 0.25;
                window.scrollTo({ top: absTop + scrollDist, behavior: 'instant' });
            }
        """),
        ('journey', '04-journey-progress-50', """
            const j = document.getElementById('journey');
            if (j) {
                const absTop = j.getBoundingClientRect().top + window.pageYOffset;
                const scrollDist = (j.offsetHeight - window.innerHeight) * 0.50;
                window.scrollTo({ top: absTop + scrollDist, behavior: 'instant' });
            }
        """),
        ('journey', '04-journey-progress-75', """
            const j = document.getElementById('journey');
            if (j) {
                const absTop = j.getBoundingClientRect().top + window.pageYOffset;
                const scrollDist = (j.offsetHeight - window.innerHeight) * 0.75;
                window.scrollTo({ top: absTop + scrollDist, behavior: 'instant' });
            }
        """),
        ('journey', '04-journey-progress-100', """
            const j = document.getElementById('journey');
            if (j) {
                const absTop = j.getBoundingClientRect().top + window.pageYOffset;
                const scrollDist = (j.offsetHeight - window.innerHeight) * 1.0;
                window.scrollTo({ top: absTop + scrollDist, behavior: 'instant' });
            }
        """),

        # 5. FAQs with Filter Categories
        ('faqs', '05-faqs-all', "Array.from(document.querySelectorAll('#faqs button')).find(b => b.textContent.trim() === 'All')?.click();"),
        ('faqs', '05-faqs-basics', "Array.from(document.querySelectorAll('#faqs button')).find(b => b.textContent.trim() === 'Basics')?.click();"),
        ('faqs', '05-faqs-account', "Array.from(document.querySelectorAll('#faqs button')).find(b => b.textContent.trim() === 'Account')?.click();"),
        ('faqs', '05-faqs-costs-risk', "Array.from(document.querySelectorAll('#faqs button')).find(b => b.textContent.trim() === 'Costs & risk')?.click();"),
        ('faqs', '05-faqs-support', "Array.from(document.querySelectorAll('#faqs button')).find(b => b.textContent.trim() === 'Support')?.click();"),

        # 6. Securities Risk Disclosure Note
        ('faqs', '06-risk-disclosure', """
            const note = document.querySelector('.risk-disclosure-note');
            if (note) {
                const absTop = note.getBoundingClientRect().top + window.pageYOffset - 120;
                window.scrollTo({ top: absTop, behavior: 'instant' });
            }
        """),

        # 7. Enquiry Section
        ('enquiry', '07-enquiry', None),
    ]

    viewports = [
        (1440, 900, '1440'),
        (375, 812, '375'),
    ]

    for width, height, vp_label in viewports:
        print(f"\n--- Launching Chrome for Viewport {vp_label}px ({width}x{height}) ---", flush=True)
        user_data = tempfile.mkdtemp(prefix=f"chrome_cdp_equity_{vp_label}_")
        chrome_cmd = [
            CHROME_PATH,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            f"--user-data-dir={user_data}",
            f"--remote-debugging-port={CDP_PORT}",
            f"--window-size={width},{height}",
            f"http://127.0.0.1:{PORT}/investments/equity",
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
                    await asyncio.sleep(0.35)

                    if extra_js:
                        await send_cmd("Runtime.evaluate", {"expression": extra_js})
                        await asyncio.sleep(0.35)

                    # Trigger scroll event
                    await send_cmd("Runtime.evaluate", {"expression": "window.dispatchEvent(new Event('scroll'));"})
                    await asyncio.sleep(0.25)

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

    print("\nAll Equity v2 CDP screenshots captured successfully!", flush=True)

if __name__ == '__main__':
    asyncio.run(capture_all())
