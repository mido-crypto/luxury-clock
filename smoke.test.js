/* Smoke tests — run with:  npm install  &&  npm test
   Uses Playwright (Chromium) and a tiny built-in static server. */
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");
const assert = require("assert");

const ROOT = path.resolve(__dirname, "..");
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
    ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml", ".png": "image/png" };

function serve() {
    return new Promise(resolve => {
        const server = http.createServer((req, res) => {
            const url = req.url.split("?")[0];
            const file = path.join(ROOT, url === "/" ? "index.html" : url);
            if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
            res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
            fs.createReadStream(file).pipe(res);
        }).listen(0, () => resolve(server));
    });
}

const results = [];
async function test(name, fn) {
    try { await fn(); results.push([true, name]); console.log("  ✓", name); }
    catch (e) { results.push([false, name]); console.log("  ✗", name, "\n    ", e.message); }
}

(async () => {
    const server = await serve();
    const base = `http://localhost:${server.address().port}/`;
    const browser = await chromium.launch();
    const newPage = async (opts = {}) => {
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "en-US", ...opts });
        const page = await ctx.newPage();
        page.errors = [];
        page.on("pageerror", e => page.errors.push(e.message));
        return page;
    };
    console.log("fikra Luxury Time — smoke tests");

    await test("loads without JavaScript errors and shows the footer credit", async () => {
        const p = await newPage();
        await p.goto(base);
        assert.strictEqual(p.errors.length, 0, p.errors.join("; "));
        assert.match(await p.locator("footer").innerText(), /Fikra Digital/);
        assert.match(await p.title(), /fikra Luxury Time/);
        await p.context().close();
    });

    await test("analog hands move and digital time renders", async () => {
        const p = await newPage();
        await p.goto(base);
        const t1 = await p.locator("#secondHand").evaluate(e => e.style.transform);
        await p.waitForTimeout(300);
        const t2 = await p.locator("#secondHand").evaluate(e => e.style.transform);
        assert.notStrictEqual(t1, t2);
        assert.match(await p.locator("#digitalTime").innerText(), /^\d{2}:\d{2}:\d{2}$/);
        await p.context().close();
    });

    await test("navigation switches views and updates the hash", async () => {
        const p = await newPage();
        await p.goto(base);
        for (const v of ["timer", "stopwatch", "alarm", "world", "clock"]) {
            await p.click(`.nav-btn[data-view="${v}"]`);
            assert.ok(await p.locator(`#${v}View`).isVisible(), v);
            assert.ok((await p.url()).endsWith("#" + v));
        }
        await p.context().close();
    });

    await test("timer counts down, pauses and resets", async () => {
        const p = await newPage();
        await p.goto(base + "#timer");
        await p.fill("#timerMinutes", "0"); await p.fill("#timerSeconds", "30");
        await p.click("#startTimer");
        await p.waitForTimeout(1300);
        const running = await p.locator("#timerDisplay").innerText();
        assert.ok(running < "00:00:30", running);
        await p.click("#pauseTimer");
        const paused = await p.locator("#timerDisplay").innerText();
        await p.waitForTimeout(700);
        assert.strictEqual(await p.locator("#timerDisplay").innerText(), paused);
        await p.click("#resetTimer");
        assert.strictEqual(await p.locator("#timerDisplay").innerText(), "00:00:30");
        await p.context().close();
    });

    await test("timer rings a modal when it finishes", async () => {
        const p = await newPage();
        await p.goto(base + "#timer");
        await p.fill("#timerMinutes", "0"); await p.fill("#timerSeconds", "2");
        await p.click("#startTimer");
        await p.waitForSelector("#modal:not([hidden])", { timeout: 5000 });
        await p.click("#modalStop");
        assert.ok(await p.locator("#modal").isHidden());
        await p.context().close();
    });

    await test("stopwatch records laps", async () => {
        const p = await newPage();
        await p.goto(base + "#stopwatch");
        await p.click("#startStopwatch");
        await p.waitForTimeout(250); await p.click("#lapStopwatch");
        await p.waitForTimeout(250); await p.click("#lapStopwatch");
        assert.strictEqual(await p.locator("#lapsList tr").count(), 2);
        await p.click("#resetStopwatch");
        assert.strictEqual(await p.locator("#lapsList tr").count(), 0);
        await p.context().close();
    });

    await test("alarms: add, persist after reload, delete", async () => {
        const p = await newPage();
        await p.goto(base + "#alarm");
        await p.fill("#alarmTime", "06:30");
        await p.fill("#alarmLabel", "Gym");
        await p.click("#saveAlarm");
        assert.strictEqual(await p.locator(".alarm-item").count(), 1);
        await p.reload();
        assert.match(await p.locator(".alarm-item").innerText(), /Gym/);
        await p.click('.alarm-actions button[aria-label="Delete alarm"]');
        assert.strictEqual(await p.locator(".alarm-item").count(), 0);
        await p.context().close();
    });

    await test("alarm rings at the right minute and can be snoozed", async () => {
        const p = await newPage();
        await p.clock.install({ time: new Date(2026, 10, 4, 6, 59, 50) });
        await p.goto(base + "#alarm");
        await p.fill("#alarmTime", "07:00");
        await p.click("#saveAlarm");
        await p.clock.runFor(15000);
        assert.ok(await p.locator("#modal").isVisible(), "modal should be visible");
        await p.click("#modalSnooze");
        assert.ok(await p.locator("#modal").isHidden());
        await p.clock.runFor(5 * 60 * 1000 + 2000);
        assert.ok(await p.locator("#modal").isVisible(), "snoozed alarm should ring again");
        await p.context().close();
    });

    await test("world clock: add and remove a city", async () => {
        const p = await newPage();
        await p.goto(base + "#world");
        const before = await p.locator(".world-item").count();
        await p.selectOption("#citySelect", "Asia/Seoul");
        await p.click("#addCity");
        assert.strictEqual(await p.locator(".world-item").count(), before + 1);
        await p.locator(".world-remove").last().click();
        assert.strictEqual(await p.locator(".world-item").count(), before);
        await p.context().close();
    });

    await test("settings persist across reloads (face, hand colour, theme, 12h)", async () => {
        const p = await newPage();
        await p.goto(base);
        await p.click("#settingsBtn");
        await p.click('.option[data-face="sport"]');
        await p.click('.color-choice[data-color="#00cfff"]');
        await p.click('.option[data-theme-choice="ivory"]');
        await p.check("#hour12");
        await p.reload();
        assert.strictEqual(await p.locator("#watchInner").getAttribute("data-face"), "sport");
        assert.strictEqual(await p.evaluate(() => document.documentElement.dataset.theme), "ivory");
        assert.match(await p.locator("#digitalTime").innerText(), /(AM|PM)/);
        assert.strictEqual(await p.evaluate(() => document.documentElement.style.getPropertyValue("--hand")), "#00cfff");
        await p.context().close();
    });

    await test("Arabic switches direction to RTL and translates the UI", async () => {
        const p = await newPage();
        await p.goto(base);
        await p.click("#langBtn");
        assert.strictEqual(await p.evaluate(() => document.documentElement.dir), "rtl");
        assert.match(await p.locator('.nav-btn[data-view="alarm"]').innerText(), /المنبّه/);
        assert.match(await p.locator("footer").innerText(), /Fikra Digital/);
        await p.context().close();
    });

    await test("settings drawer opens, traps focus and closes with Escape", async () => {
        const p = await newPage();
        await p.goto(base);
        await p.click("#settingsBtn");
        await p.waitForTimeout(400);
        assert.ok(await p.locator("#customization").isVisible());
        assert.strictEqual(await p.evaluate(() => document.activeElement.id), "closeSettings");
        await p.keyboard.press("Escape");
        await p.waitForTimeout(800);
        assert.ok(await p.locator("#customization").isHidden());
        await p.context().close();
    });

    await test("mobile layout: no horizontal scroll and bottom navigation", async () => {
        const p = await newPage({ viewport: { width: 390, height: 844 } });
        await p.goto(base);
        const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        assert.ok(overflow <= 0, "horizontal overflow: " + overflow);
        const box = await p.locator("#mainNav").boundingBox();
        assert.ok(box.y > 600, "nav should sit at the bottom, y=" + box.y);
        await p.context().close();
    });

    await test("PWA files are served and the service worker registers", async () => {
        const p = await newPage();
        await p.goto(base);
        for (const f of ["manifest.webmanifest", "sw.js", "icons/icon-192.png", "icons/icon-512.png", "icons/icon.svg"]) {
            const r = await p.request.get(base + f);
            assert.ok(r.ok(), f);
        }
        const reg = await p.evaluate(async () => !!(await navigator.serviceWorker.ready));
        assert.ok(reg);
        await p.context().close();
    });

    await browser.close();
    server.close();
    const failed = results.filter(r => !r[0]).length;
    console.log(`\n${results.length - failed}/${results.length} passed`);
    process.exit(failed ? 1 : 0);
})();
