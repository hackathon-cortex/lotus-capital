import http.server
import socketserver
import os
import subprocess
import threading
import time
import tempfile
import shutil

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
SCREENSHOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'screenshots', 'life-insurance-v2'))
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 4194

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
    user_data = tempfile.mkdtemp(prefix="chrome_scr_li_")
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
        ('01-hero', '/services/life-insurance?section=hero'),
        ('01-hero-lifestage-slider', '/services/life-insurance?section=hero'),
        ('02-types-stack-pos0', '/services/life-insurance?section=types&stackCard=0'),
        ('02-types-stack-pos2', '/services/life-insurance?section=types&stackCard=2'),
        ('02-types-stack-pos4', '/services/life-insurance?section=types&stackCard=4'),
        ('03-compare-term', '/services/life-insurance?section=compare&compareTab=term'),
        ('03-compare-savings', '/services/life-insurance?section=compare&compareTab=savings'),
        ('04-timeline-0', '/services/life-insurance?section=process&timelineProgress=0.0'),
        ('04-timeline-33', '/services/life-insurance?section=process&timelineProgress=0.33'),
        ('04-timeline-66', '/services/life-insurance?section=process&timelineProgress=0.66'),
        ('04-timeline-100', '/services/life-insurance?section=process&timelineProgress=1.0'),
        ('05-partners', '/services/life-insurance?section=partners'),
        ('06-faq', '/services/life-insurance?section=faqs'),
        ('07-enquiry', '/services/life-insurance?section=enquiry'),
    ]

    viewports = [
        (1440, 900, '1440'),
        (375, 812, '375'),
    ]

    print(f"Beginning Life Insurance v2 screenshot capture ({len(captures) * len(viewports)} total screenshots)...")

    for slug, url_path in captures:
        for width, height, vp_label in viewports:
            out_file = os.path.join(SCREENSHOT_DIR, f"{slug}-{vp_label}.png")
            url = f"http://127.0.0.1:{PORT}{url_path}"

            print(f"Capturing {slug} ({vp_label}px)...")
            success = capture_one(url, width, height, out_file)
            if not success:
                print(f"  Retrying {slug} with delay...")
                time.sleep(0.5)
                capture_one(url, width, height, out_file)

            if os.path.exists(out_file):
                size_kb = os.path.getsize(out_file) / 1024
                print(f"  [OK] Saved {slug}-{vp_label}.png ({size_kb:.1f} KB)")
            else:
                print(f"  [FAIL] Could not capture {out_file}")

    print("\nLife Insurance v2 screenshot capture complete!")

if __name__ == '__main__':
    main()

