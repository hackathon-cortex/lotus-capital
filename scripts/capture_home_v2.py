import http.server
import socketserver
import os
import subprocess
import threading
import time

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
SCREENSHOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'screenshots', 'home-v2'))
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 4174

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def do_GET(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path):
            self.path = '/index.html'
        return super().do_GET()

    def log_message(self, format, *args):
        pass

def run_server():
    with socketserver.TCPServer(("127.0.0.1", PORT), SPAHandler) as httpd:
        httpd.serve_forever()

def main():
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)

    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    time.sleep(1)

    sections = [
        ('hero', '01-hero'),
        ('about', '02-about'),
        ('services', '03-services'),
        ('mutual-funds', '04-sip-calculator'),
        ('equity', '05-equity'),
        ('insurance', '06-insurance'),
        ('trust', '07-trust'),
        ('partners', '08-partners'),
        ('process', '08b-how-we-work'),
        ('learn', '11-learn'),
        ('faq', '09-faq'),
        ('enquiry', '10-enquiry'),
    ]

    viewports = [
        (1440, 900, '1440'),
        (375, 812, '375'),
    ]

    print("Capturing Home v2 section screenshots at 1440px and 375px...")

    for sec_id, slug in sections:
        for width, height, vp_label in viewports:
            out_file = os.path.join(SCREENSHOT_DIR, f"{slug}-{vp_label}.png")
            url = f"http://127.0.0.1:{PORT}/#{sec_id}"

            cmd = [
                CHROME_PATH,
                "--headless=new",
                "--disable-gpu",
                "--hide-scrollbars",
                "--virtual-time-budget=3000",
                "--run-all-compositor-stages-before-draw",
                f"--window-size={width},{height}",
                f"--screenshot={out_file}",
                url,
            ]

            print(f"Capturing {slug} ({vp_label}px)...")
            res = subprocess.run(cmd, capture_output=True, text=True)
            if res.returncode != 0:
                print(f"Error capturing {slug}-{vp_label}: {res.stderr}")
            else:
                if os.path.exists(out_file):
                    size_kb = os.path.getsize(out_file) / 1024
                    print(f"  [OK] Saved {slug}-{vp_label}.png ({size_kb:.1f} KB)")
                else:
                    print(f"  [FAIL] File not found: {out_file}")

    print("\nHome v2 screenshots capture complete!")

if __name__ == '__main__':
    main()
