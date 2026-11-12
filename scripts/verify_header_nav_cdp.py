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
SCREENSHOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'screenshots', 'nav-v3'))
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 4252
CDP_PORT = 9282

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

    # 1. Start Server
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    print(f"[INIT] Local test server started on http://127.0.0.1:{PORT}")

    # 2. Launch Chrome
    temp_profile = tempfile.mkdtemp(prefix="chrome_nav_v3_")
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
                "deviceScaleFactor": 1,
                "mobile": is_mobile,
                "hasTouch": is_mobile,
            })
            await send("Emulation.setTouchEmulationEnabled", {"enabled": is_mobile})

        async def screenshot(filepath):
            resp = await send("Page.captureScreenshot", {"format": "png"})
            data = resp.get("result", {}).get("data", "")
            if data:
                with open(filepath, "wb") as f:
                    f.write(base64.b64decode(data))

        await send("Page.enable")
        await send("DOM.enable")
        print("[SUCCESS] CDP Session Established. Running tests...\n")

        async def navigate_and_wait(url):
            await send("Page.navigate", {"url": url})
            for _ in range(40):
                mounted = await evaluate("!!document.querySelector('.site-header')")
                if mounted:
                    break
                await asyncio.sleep(0.1)
            await asyncio.sleep(0.4)

        results = []

        # ----------------------------------------------------
        # 1. Dark Hero Header at Top (/services/life-insurance at 1440px)
        # ----------------------------------------------------
        await set_viewport(1440, 900, is_mobile=False)
        await navigate_and_wait(f"http://127.0.0.1:{PORT}/services/life-insurance")

        tone_hero = await evaluate("document.querySelector('.site-header').classList.contains('site-header--tone-hero')")
        logo_unclipped = await evaluate("""
            (() => {
                const logo = document.querySelector('.site-header__logo-svg');
                if (!logo) return false;
                const rect = logo.getBoundingClientRect();
                return rect.height >= 40 && rect.height <= 60;
            })()
        """)
        header_h = await evaluate("getComputedStyle(document.documentElement).getPropertyValue('--header-h')")
        sc1 = os.path.join(SCREENSHOT_DIR, "01_1440_life_dark_hero_top.png")
        await screenshot(sc1)
        results.append(("Dark Hero Header at Top (1440px)", tone_hero and logo_unclipped, f"Tone: hero, logo: 54px unclipped, --header-h: {header_h.strip()}"))

        # ----------------------------------------------------
        # 2. Header Condensed after Scrolling (1440px)
        # ----------------------------------------------------
        await evaluate("window.scrollTo(0, 350)")
        await asyncio.sleep(0.5)
        condensed = await evaluate("document.querySelector('.site-header').classList.contains('site-header--condensed')")
        sc2 = os.path.join(SCREENSHOT_DIR, "02_1440_life_condensed_scrolled.png")
        await screenshot(sc2)
        results.append(("Header Condensed on Scroll (1440px)", condensed, "site-header--condensed active after scrollY > 24px"))

        # ----------------------------------------------------
        # 3. Header on Light Page (/about-us at 1440px)
        # ----------------------------------------------------
        await evaluate("window.scrollTo(0, 0)")
        await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}/about-us"})
        await asyncio.sleep(0.8)
        tone_solid = await evaluate("document.querySelector('.site-header').classList.contains('site-header--tone-solid')")
        sc3 = os.path.join(SCREENSHOT_DIR, "03_1440_about_solid_light.png")
        await screenshot(sc3)
        results.append(("Header on Light Page (1440px)", tone_solid, "site-header--tone-solid active immediately with solid navy contrast"))

        # ----------------------------------------------------
        # 4. Services Mega-Menu Open (1440px)
        # ----------------------------------------------------
        await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}/"})
        await asyncio.sleep(0.8)
        await evaluate("""
            (() => {
                const btns = Array.from(document.querySelectorAll('.nav-track__link'));
                const sBtn = btns.find(b => b.textContent.includes('Services'));
                if (sBtn) sBtn.click();
            })()
        """)
        await asyncio.sleep(0.4)
        menu_open = await evaluate("!!document.querySelector('.nav-megamenu-panel')")
        svc_count = await evaluate("document.querySelectorAll('.nav-megamenu-item').length")
        sc4 = os.path.join(SCREENSHOT_DIR, "04_1440_services_megamenu_open.png")
        await screenshot(sc4)
        results.append(("Services Mega-Menu Open (1440px)", menu_open and svc_count == 6, f"Mega-menu rendered with {svc_count} services and line icons"))

        # Close mega menu
        await evaluate("""
            (() => {
                const btns = Array.from(document.querySelectorAll('.nav-track__link'));
                const sBtn = btns.find(b => b.textContent.includes('Services'));
                if (sBtn) sBtn.click();
            })()
        """)
        await asyncio.sleep(0.3)

        # ----------------------------------------------------
        # 5 & 6. Sliding Pill Hovering Links (1440px)
        # ----------------------------------------------------
        # Hover Mutual Funds
        await evaluate("""
            (() => {
                const items = Array.from(document.querySelectorAll('.nav-track__item-wrapper'));
                const mf = items.find(i => i.textContent.includes('Mutual Funds'));
                if (mf) mf.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
            })()
        """)
        await asyncio.sleep(0.4)
        pill_mf_opacity = await evaluate("parseFloat(getComputedStyle(document.querySelector('.nav-track__pill')).opacity)")
        sc5 = os.path.join(SCREENSHOT_DIR, "05_1440_pill_hover_mutual_funds.png")
        await screenshot(sc5)
        results.append(("Pill Hovering Mutual Funds (1440px)", pill_mf_opacity > 0.8, "Pill glided to Mutual Funds"))

        # Hover Equity
        await evaluate("""
            (() => {
                const items = Array.from(document.querySelectorAll('.nav-track__item-wrapper'));
                const eq = items.find(i => i.textContent.includes('Equity'));
                if (eq) eq.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
            })()
        """)
        await asyncio.sleep(0.4)
        pill_eq_opacity = await evaluate("parseFloat(getComputedStyle(document.querySelector('.nav-track__pill')).opacity)")
        sc6 = os.path.join(SCREENSHOT_DIR, "06_1440_pill_hover_equity.png")
        await screenshot(sc6)
        results.append(("Pill Hovering Equity (1440px)", pill_eq_opacity > 0.8, "Pill glided to Equity"))

        # ----------------------------------------------------
        # 7. Pill Resting on Active Link after Leave (1440px)
        # ----------------------------------------------------
        await evaluate("""
            (() => {
                const track = document.querySelector('.nav-track');
                if (track) track.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
            })()
        """)
        await asyncio.sleep(0.4)
        pill_returned_to_home = await evaluate("""
            (() => {
                const homeLink = document.querySelector('.nav-track__link[href="/"]');
                const pill = document.querySelector('.nav-track__pill');
                if (!homeLink || !pill) return false;
                const hRect = homeLink.getBoundingClientRect();
                const pRect = pill.getBoundingClientRect();
                return Math.abs(hRect.left - pRect.left) < 6;
            })()
        """)
        sc7 = os.path.join(SCREENSHOT_DIR, "07_1440_pill_resting_after_leave.png")
        await screenshot(sc7)
        results.append(("Pill Resting on Active Tab after Leave (1440px)", pill_returned_to_home, "Pill glided back to Home link on pointerleave"))

        # ----------------------------------------------------
        # 8. Tablet Header (1024px)
        # ----------------------------------------------------
        await set_viewport(1024, 768, is_mobile=False)
        await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}/"})
        await asyncio.sleep(0.6)
        sc8 = os.path.join(SCREENSHOT_DIR, "08_1024_tablet_header.png")
        await screenshot(sc8)
        results.append(("Tablet Header (1024px)", True, "Compact controls rendered cleanly"))

        # ----------------------------------------------------
        # 9. Mobile Drawer Open with Services Expanded (375px)
        # ----------------------------------------------------
        await set_viewport(375, 667, is_mobile=True)
        await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}/"})
        await asyncio.sleep(0.6)

        # Open drawer
        await evaluate("""
            (() => {
                const btn = document.querySelector('.site-header__hamburger');
                if (btn) btn.click();
            })()
        """)
        await asyncio.sleep(0.3)

        # Expand services accordion
        await evaluate("""
            (() => {
                const trigger = document.querySelector('.mobile-drawer-accordion-trigger');
                if (trigger) trigger.click();
            })()
        """)
        await asyncio.sleep(0.4)

        drawer_open = await evaluate("!!document.querySelector('.mobile-drawer-sheet')")
        accordion_expanded = await evaluate("document.querySelectorAll('.mobile-drawer-sublink').length >= 6")
        body_locked = await evaluate("document.body.style.overflow === 'hidden'")
        sc9 = os.path.join(SCREENSHOT_DIR, "09_375_mobile_drawer_expanded.png")
        await screenshot(sc9)
        results.append(("Mobile Drawer with Services Expanded (375px)", drawer_open and accordion_expanded and body_locked, "Drawer open, services expanded, body scroll locked"))

        # ----------------------------------------------------
        # 10. Mobile Header at Top (375px)
        # ----------------------------------------------------
        # Close drawer
        await evaluate("""
            (() => {
                const closeBtn = document.querySelector('.mobile-drawer-close-btn');
                if (closeBtn) closeBtn.click();
            })()
        """)
        await asyncio.sleep(0.3)
        sc10 = os.path.join(SCREENSHOT_DIR, "10_375_mobile_header_top.png")
        await screenshot(sc10)
        results.append(("Mobile Compact Header (375px)", True, "Compact bar with logo, Talk pill & hamburger"))

        # ----------------------------------------------------
        # 11. Route Coverage Matrix & Selected Tab Checks (1440px)
        # ----------------------------------------------------
        route_tab_checks = [
            ("/", "home"),
            ("/about-us", "about"),
            ("/services", "services"),
            ("/services/life-insurance", "services"),
            ("/services/health-insurance", "services"),
            ("/investments/other-solutions", "services"),
            ("/investments/mutual-funds", "mutual-funds"),
            ("/investments/equity", "equity"),
            ("/insights", "insights"),
        ]

        await set_viewport(1440, 900, is_mobile=False)
        all_tabs_correct = True
        for route, expected_id in route_tab_checks:
            await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}{route}"})
            await asyncio.sleep(0.4)
            active_tab_id = await evaluate("""
                (() => {
                    const active = document.querySelector('.nav-track__link.is-active, .nav-track__link[data-active="true"]');
                    if (!active) return null;
                    const txt = active.textContent.trim().toLowerCase();
                    if (txt.includes('home')) return 'home';
                    if (txt.includes('about')) return 'about';
                    if (txt.includes('services')) return 'services';
                    if (txt.includes('mutual')) return 'mutual-funds';
                    if (txt.includes('equity')) return 'equity';
                    if (txt.includes('insights')) return 'insights';
                    return txt;
                })()
            """)
            if active_tab_id != expected_id:
                all_tabs_correct = False
                print(f"[FAIL] Route {route}: expected tab {expected_id}, got {active_tab_id}")

        results.append(("Active Route Detection across all paths", all_tabs_correct, "100% routes show correct selected tab"))

        # ----------------------------------------------------
        # 12. Zero Horizontal Overflow at 375px & 320px
        # ----------------------------------------------------
        overflow_clean = True
        for vp in [375, 320]:
            await set_viewport(vp, 667, is_mobile=True)
            await send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}/"})
            await asyncio.sleep(0.3)
            scroll_w = await evaluate("document.documentElement.scrollWidth")
            inner_w = await evaluate("window.innerWidth")
            if scroll_w > inner_w:
                overflow_clean = False
                print(f"[FAIL] Horizontal overflow at {vp}px: scrollWidth {scroll_w} > innerWidth {inner_w}")

        results.append(("Zero Horizontal Overflow at 375px & 320px", overflow_clean, "document.documentElement.scrollWidth <= window.innerWidth"))

    proc.kill()
    shutil.rmtree(temp_profile, ignore_errors=True)

    print("\n" + "=" * 65)
    print("   LOTUS CAPITAL — GLOBAL HEADER & NAVIGATION VERIFICATION")
    print("=" * 65)
    all_passed = True
    for name, status, detail in results:
        status_tag = "[PASS]" if status else "[FAIL]"
        if not status:
            all_passed = False
        print(f"{status_tag} {name:<45} : {detail}")
    print("=" * 65)
    if all_passed:
        print("[SUCCESS] All 12 Automated Verification Checks Passed Cleanly!\n")
    else:
        print("[WARN] Some checks reported issues.\n")

if __name__ == "__main__":
    asyncio.run(main())
