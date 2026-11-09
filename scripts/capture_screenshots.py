import http.server
import socketserver
import os
import subprocess
import threading
import time

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
SCREENSHOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'screenshots'))
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 4173

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def do_GET(self):
        # Translate requested path against dist directory
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path):
            self.path = '/index.html'
        return super().do_GET()

    def log_message(self, format, *args):
        # Silence HTTP logs
        pass

def run_server():
    with socketserver.TCPServer(("127.0.0.1", PORT), SPAHandler) as httpd:
        httpd.serve_forever()

def main():
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)

    # Start static SPA server in background
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    time.sleep(1)

    routes = [
        ('/', 'home'),
        ('/about-us', 'about-us'),
        ('/services', 'services'),
        ('/services/health-insurance', 'health-insurance'),
        ('/investments/mutual-funds', 'mutual-funds'),
        ('/investments/equity', 'equity'),
        ('/contact-us', 'contact-us'),
        ('/admin/dashboard', 'admin-dashboard'),
    ]

    viewports = [
        (375, 812, '375'),
        (768, 1024, '768'),
        (1440, 900, '1440'),
    ]

    print("Beginning screenshot capture across 8 routes and 3 viewport sizes (24 screenshots)...")

    for route, slug in routes:
        for width, height, vp_label in viewports:
            out_file = os.path.join(SCREENSHOT_DIR, f"{slug}-{vp_label}.png")
            url = f"http://127.0.0.1:{PORT}{route}"

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

            print(f"Capturing {slug} ({vp_label}px) -> {out_file}...")
            res = subprocess.run(cmd, capture_output=True, text=True)
            if res.returncode != 0:
                print(f"Error capturing {slug}-{vp_label}: {res.stderr}")
            else:
                if os.path.exists(out_file):
                    size_kb = os.path.getsize(out_file) / 1024
                    print(f"[OK] Saved {slug}-{vp_label}.png ({size_kb:.1f} KB)")
                else:
                    print(f"[FAIL] File not created: {out_file}")

    print("\nScreenshot capture process complete!")

if __name__ == '__main__':
    main()
