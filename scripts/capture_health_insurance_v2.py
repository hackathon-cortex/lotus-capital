import http.server
import socketserver
import os
import subprocess
import threading
import time
import tempfile
import shutil

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
SCREENSHOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'screenshots', 'health-insurance-v2'))
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 4208

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

def capture_one(url, width, height, out_file):
    user_data = tempfile.mkdtemp(prefix="chrome_scr_hi_")
    try:
        cmd = [
            CHROME_PATH,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            f"--user-data-dir={user_data}",
            "--virtual-time-budget=4500",
            "--run-all-compositor-stages-before-draw",
            f"--window-size={width},{height}",
            f"--screenshot={out_file}",
            url,
        ]
        subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        return os.path.exists(out_file) and os.path.getsize(out_file) > 10000
    finally:
        shutil.rmtree(user_data, ignore_errors=True)

def main():
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)

    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    time.sleep(1.5)

    captures = [
        ('01-hero', '/services/health-insurance?section=hero'),
        ('01-hero-careboard-household', '/services/health-insurance?section=hero&household=3&policyType=senior'),
        ('02-overview', '/services/health-insurance?section=overview'),
        ('03-categories-pos0', '/services/health-insurance?section=types&catIndex=0'),
        ('03-categories-pos1-family', '/services/health-insurance?section=types&catIndex=1'),
        ('03-categories-pos2-senior', '/services/health-insurance?section=types&catIndex=2'),
        ('04-compare-param0-sum-insured', '/services/health-insurance?section=compare&compareParam=sum_insured'),
        ('04-compare-param1-waiting-periods', '/services/health-insurance?section=compare&compareParam=waiting_periods'),
        ('04-compare-param3-room-rent', '/services/health-insurance?section=compare&compareParam=room_rent'),
        ('05-timeline-0', '/services/health-insurance?section=process&timelineProgress=0.0'),
        ('05-timeline-33', '/services/health-insurance?section=process&timelineProgress=0.33'),
        ('05-timeline-66', '/services/health-insurance?section=process&timelineProgress=0.66'),
        ('05-timeline-100', '/services/health-insurance?section=process&timelineProgress=1.0'),
        ('06-partners', '/services/health-insurance?section=partners'),
        ('07-faq', '/services/health-insurance?section=faqs'),
        ('08-enquiry', '/services/health-insurance?section=enquiry'),
    ]

    viewports = [
        (1440, 900, '1440'),
        (375, 812, '375'),
    ]

    print(f"Beginning Health Insurance v2 screenshot capture ({len(captures) * len(viewports)} total screenshots)...", flush=True)

    for slug, url_path in captures:
        for width, height, vp_label in viewports:
            out_file = os.path.join(SCREENSHOT_DIR, f"{slug}-{vp_label}.png")
            url = f"http://127.0.0.1:{PORT}{url_path}"

            print(f"Capturing {slug} ({vp_label}px)...", flush=True)
            success = capture_one(url, width, height, out_file)
            if not success:
                print(f"  Retrying {slug} with delay...", flush=True)
                time.sleep(0.5)
                capture_one(url, width, height, out_file)

            if os.path.exists(out_file):
                size_kb = os.path.getsize(out_file) / 1024
                print(f"  [OK] Saved {slug}-{vp_label}.png ({size_kb:.1f} KB)", flush=True)
            else:
                print(f"  [FAIL] Could not capture {out_file}", flush=True)

    print("\nHealth Insurance v2 screenshot capture complete!", flush=True)

if __name__ == '__main__':
    main()

