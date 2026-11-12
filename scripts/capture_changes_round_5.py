import http.server
import socketserver
import os
import subprocess
import threading
import time
import tempfile
import shutil

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
SCREENSHOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'screenshots', 'changes-round-5'))

# Mac Chrome Path
CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT = 4199

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
    with socketserver.TCPServer(("127.0.0.1", PORT), SPAHandler) as httpd:
        httpd.serve_forever()

def capture_one(url, width, height, out_file):
    user_data = tempfile.mkdtemp(prefix="chrome_scr_r5_")
    try:
        cmd = [
            CHROME_PATH,
            "--headless=new",
            "--disable-gpu",
            "--force-prefers-reduced-motion",
            "--hide-scrollbars",
            f"--user-data-dir={user_data}",
            "--virtual-time-budget=4000",
            "--run-all-compositor-stages-before-draw",
            f"--window-size={width},{height}",
            f"--screenshot={out_file}",
            url,
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        success = os.path.exists(out_file) and os.path.getsize(out_file) > 1000
        print(f"Captured {os.path.basename(out_file)} ({width}x{height}): {'OK' if success else 'FAILED'}")
        return success
    finally:
        shutil.rmtree(user_data, ignore_errors=True)

def main():
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)

    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    time.sleep(1.5)

    targets = [
        ("about", "/about-us"),
        ("home_services", "/#services"),
        ("general_insurance_travel", "/services/general-insurance#travel"),
        ("health_rohini_section", "/services/health-insurance#rohini"),
        ("rohini_page", "/services/rohini-cashless-empanelment"),
        ("common_enquiry_form", "/?contact=open"),
        ("admin_login_mfa", "/admin/login"),
    ]

    viewports = [
        ("desktop_1440", 1440, 900),
        ("mobile_375", 375, 812),
    ]

    for name, path in targets:
        for vp_label, w, h in viewports:
            out_name = f"{name}_{vp_label}.png"
            out_file = os.path.join(SCREENSHOT_DIR, out_name)
            url = f"http://127.0.0.1:{PORT}{path}"
            capture_one(url, w, h, out_file)

    print("\nAll Round 5 screenshots captured in:", SCREENSHOT_DIR)

if __name__ == '__main__':
    main()

