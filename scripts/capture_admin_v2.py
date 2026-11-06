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
SCREENSHOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'screenshots', 'admin-v2'))
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 4288
CDP_PORT = 9298

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

    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    print(f"[INIT] Server running on http://127.0.0.1:{PORT}")

    temp_profile = tempfile.mkdtemp(prefix="chrome_admin_v2_")
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

        async def set_viewport(width, height, is_mobile=False):
            await send("Emulation.setDeviceMetricsOverride", {
                "width": width,
                "height": height,
                "deviceScaleFactor": 2.0,
                "mobile": is_mobile,
            })
            await send("Emulation.setVisibleSize", {"width": width, "height": height})

        async def navigate(url):
            await send("Page.navigate", {"url": url})
            await asyncio.sleep(1.2)
            for _ in range(25):
                ready = await evaluate("document.readyState")
                if ready == "complete":
                    break
                await asyncio.sleep(0.1)
            await asyncio.sleep(0.4)

        async def capture_screenshot(filename):
            res = await send("Page.captureScreenshot", {"format": "png"})
            data = res["result"]["data"]
            out_path = os.path.join(SCREENSHOT_DIR, filename)
            with open(out_path, "wb") as f:
                f.write(base64.b64decode(data))
            print(f"[SAVED] {out_path}")

        # 1. Desktop 1440x900 - Dashboard with Sidebar Expanded
        print("[TEST] 1. Desktop 1440x900 - Dashboard with Sidebar Expanded")
        await set_viewport(1440, 900, is_mobile=False)
        await navigate(f"http://127.0.0.1:{PORT}/admin/dashboard")
        await asyncio.sleep(0.8)
        await capture_screenshot("01_dashboard_1440x900_expanded.png")

        # 2. Desktop 1440x900 - Sidebar Collapsed
        print("[TEST] 2. Desktop 1440x900 - Sidebar Collapsed")
        await evaluate("""
            (() => {
                const btn = document.querySelector('.admin-sidebar__toggle-btn');
                if (btn) btn.click();
            })()
        """)
        await asyncio.sleep(0.5)
        await capture_screenshot("02_dashboard_1440x900_collapsed.png")

        # 3. Desktop 1440x900 - Chart Filter set to Insurance
        print("[TEST] 3. Desktop 1440x900 - Chart Filter set to Insurance")
        # Expand sidebar back
        await evaluate("""
            (() => {
                const toggle = document.querySelector('.admin-sidebar__toggle-btn');
                if (toggle) toggle.click();
                const buttons = Array.from(document.querySelectorAll('.admin-chart-pill-btn'));
                const insBtn = buttons.find(b => b.textContent && b.textContent.includes('Insurance'));
                if (insBtn) insBtn.click();
            })()
        """)
        await asyncio.sleep(0.5)
        await capture_screenshot("03_dashboard_1440x900_chart_insurance.png")

        # 4. Enquiries & Leads Page (/admin/leads)
        print("[TEST] 4. Leads Page (/admin/leads)")
        await navigate(f"http://127.0.0.1:{PORT}/admin/leads")
        await asyncio.sleep(0.6)
        await capture_screenshot("04_leads_page_1440x900.png")

        # 5. Page Content (/admin/content/pages)
        print("[TEST] 5. Content Pages (/admin/content/pages)")
        await navigate(f"http://127.0.0.1:{PORT}/admin/content/pages")
        await asyncio.sleep(0.6)
        await capture_screenshot("05_page_content_1440x900.png")

        # 6. Tablet 1024x768 - Dashboard (Auto-collapsed icon rail)
        print("[TEST] 6. Tablet 1024x768 - Dashboard")
        await set_viewport(1024, 768, is_mobile=False)
        await navigate(f"http://127.0.0.1:{PORT}/admin/dashboard")
        await asyncio.sleep(0.8)
        await capture_screenshot("06_dashboard_1024x768.png")

        # 7. Mobile 375x812 - Dashboard
        print("[TEST] 7. Mobile 375x812 - Dashboard")
        await set_viewport(375, 812, is_mobile=True)
        await navigate(f"http://127.0.0.1:{PORT}/admin/dashboard")
        await asyncio.sleep(0.8)
        await capture_screenshot("07_dashboard_375x812_mobile.png")

        # 8. Mobile 375x812 - Drawer Open
        print("[TEST] 8. Mobile 375x812 - Drawer Open")
        await evaluate("""
            (() => {
                const burger = document.querySelector('.admin-topbar__hamburger');
                if (burger) burger.click();
            })()
        """)
        await asyncio.sleep(0.6)
        await capture_screenshot("08_mobile_drawer_open_375x812.png")

    proc.kill()
    shutil.rmtree(temp_profile, ignore_errors=True)
    print("[DONE] All 8 admin v2 verification screenshots captured successfully.")

if __name__ == '__main__':
    asyncio.run(main())

