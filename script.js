"use strict";

/* =========================================================
   fikra LUXURY TIME
   Sections: helpers · i18n · design · clock · timer ·
   stopwatch · alarms · world clock · navigation · settings
   ========================================================= */

const $ = (id) => document.getElementById(id);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Tiny DOM builder — always uses textContent, never innerHTML, so user text can't inject markup. */
function h(tag, props = {}, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
        else if (v === true) el.setAttribute(k, "");
        else if (v !== false && v != null) el.setAttribute(k, v);
    }
    children.flat().forEach(c => c != null && el.append(c));
    return el;
}
function icon(id) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#" + id);
    svg.append(use);
    return svg;
}

const LS = {
    design: "fikra.design.v2",
    alarms: "fikra.alarms.v2",
    timer: "fikra.timer.v1",
    world: "fikra.world.v1",
    appBg: "fikra.appBackground",
    watchBg: "fikra.watchBackground"
};

const store = {
    get(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw == null ? fallback : JSON.parse(raw);
        } catch { return fallback; }
    },
    set(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); return true; }
        catch { return false; }
    },
    del(key) { try { localStorage.removeItem(key); } catch { /* ignore */ } }
};

const pad2 = (n) => String(n).padStart(2, "0");
const BASE_TITLE = document.title;

/* =========================================================
   i18n  (English / Arabic)
   ========================================================= */

const T = {
    en: {
        skip: "Skip to content",
        "nav.label": "Main navigation", "nav.clock": "Clock", "nav.timer": "Timer", "nav.stopwatch": "Stopwatch", "nav.alarm": "Alarm", "nav.world": "World",
        "lang.switch": "Switch language", "settings.open": "Open settings", "settings.close": "Close settings", "settings.title": "Settings",
        "watch.label": "Analog watch showing the current time",
        tagline: "TIME • STYLE • YOURS",
        "tc.title": "Customize Time", "tc.mode": "Clock mode", "tc.real": "Real Time", "tc.manual": "Manual", "tc.speed": "Speed",
        "tc.hint.real": "Showing your device's current time.",
        "tc.hint.manual": "The clock runs from the time you choose.",
        "tc.hint.speed": "The clock runs faster or slower than real time.",
        "tc.speedLabel": "Time speed", "tc.manualLabel": "Choose date and time", "tc.apply": "Apply Custom Time", "tc.reset": "Reset to Real Time",
        "sp.1": "1× (Normal)", "sp.2": "2× Faster", "sp.10": "10× Faster", "sp.60": "60× Faster", "sp.05": "0.5× Slower", "sp.01": "0.1× Slower",
        "mode.real": "REAL TIME", "mode.manual": "MANUAL TIME", "mode.speed": "TIME SPEED",
        "u.min": "min", "u.hour": "hr", "u.hours": "Hours", "u.minutes": "Minutes", "u.seconds": "Seconds", "u.d": "d", "u.h": "h", "u.m": "m",
        "b.start": "Start", "b.pause": "Pause", "b.reset": "Reset", "b.lap": "Lap", "b.cancel": "Cancel", "b.choose": "Choose image", "b.remove": "Remove",
        "b.snooze": "Snooze 5 min", "b.stop": "Stop", "b.resume": "Resume",
        "timer.ready": "Timer ready", "timer.running": "Timer running", "timer.paused": "Timer paused", "timer.done": "Time's up!",
        "timer.presets": "Quick presets", "timer.doneTitle": "Timer finished",
        "sw.laps": "Laps", "sw.lap": "Lap", "sw.total": "Total",
        "al.new": "New alarm", "al.edit": "Edit alarm", "al.time": "Alarm time", "al.label": "Label (optional)", "al.labelPh": "e.g. Wake up",
        "al.repeat": "Repeat", "al.repeatHint": "No days selected = rings once.", "al.tone": "Sound", "al.preview": "Preview",
        "al.add": "Add alarm", "al.save": "Save changes", "al.note": "Alarms ring while this page (or the installed app) is open.",
        "al.list": "Your alarms", "al.empty": "No alarms yet. Add your first one.",
        "al.ringing": "Alarm", "al.once": "Once", "al.every": "Every day", "al.next": "Next alarm in", "al.none": "No active alarms",
        "al.added": "Alarm added.", "al.updated": "Alarm updated.", "al.deleted": "Alarm deleted.", "al.snoozed": "Snoozed for 5 minutes.",
        "al.toggle": "Enable alarm", "al.editBtn": "Edit alarm", "al.deleteBtn": "Delete alarm",
        "tone.classic": "Classic beep", "tone.chime": "Soft chime", "tone.digital": "Digital",
        "d.0": "Sun", "d.1": "Mon", "d.2": "Tue", "d.3": "Wed", "d.4": "Thu", "d.5": "Fri", "d.6": "Sat",
        am: "AM", pm: "PM",
        "wc.add": "Add a city", "wc.addBtn": "Add city", "wc.same": "Same time as you", "wc.ahead": "ahead", "wc.behind": "behind", "wc.remove": "Remove city", "wc.empty": "No cities added.",
        made: "Made by",
        "set.logo": "Logo name", "set.subtitle": "Subtitle", "set.hand": "Hand color", "set.face": "Face style", "set.numerals": "Numerals", "set.bezel": "Bezel",
        "set.theme": "Theme", "set.lang": "Language", "set.hour12": "12-hour format", "set.showDate": "Show date", "set.glow": "Glow effect",
        "set.appbg": "Application background", "set.watchbg": "Watch face background",
        "set.auto": "Your changes are saved automatically on this device.", "set.resetAll": "Reset to default",
        "col.gold": "Gold", "col.cyan": "Cyan", "col.silver": "Silver", "col.rose": "Rose", "col.custom": "Custom color",
        "face.classic": "Classic", "face.minimal": "Minimal", "face.sport": "Sport", "num.none": "None",
        "bezel.gold": "Gold", "bezel.steel": "Steel", "bezel.black": "Black",
        "theme.midnight": "Midnight", "theme.emerald": "Emerald", "theme.ivory": "Ivory",
        "toast.pickTime": "Choose a date and time first.", "toast.invalidTime": "Invalid date or time.", "toast.applied": "Custom time applied.",
        "toast.synced": "Clock synced to your device.", "toast.setDuration": "Set a timer duration first.", "toast.startFirst": "Start the stopwatch first.",
        "toast.pickAlarm": "Choose an alarm time.", "toast.reset": "Design reset to default.",
        "toast.notImage": "Please choose an image file.", "toast.bgSaved": "Background updated.", "toast.bgUnsaved": "Background applied, but it is too large to be remembered.",
        "toast.bgRemoved": "Background removed.", "toast.cityExists": "That city is already in your list."
    },
    ar: {
        skip: "تخطَّ إلى المحتوى",
        "nav.label": "التنقل الرئيسي", "nav.clock": "الساعة", "nav.timer": "المؤقّت", "nav.stopwatch": "ساعة الإيقاف", "nav.alarm": "المنبّه", "nav.world": "العالم",
        "lang.switch": "تغيير اللغة", "settings.open": "فتح الإعدادات", "settings.close": "إغلاق الإعدادات", "settings.title": "الإعدادات",
        "watch.label": "ساعة عقارب تعرض الوقت الحالي",
        tagline: "الوقت • الأناقة • لك",
        "tc.title": "تخصيص الوقت", "tc.mode": "وضع الساعة", "tc.real": "الوقت الحقيقي", "tc.manual": "يدوي", "tc.speed": "السرعة",
        "tc.hint.real": "تعرض الساعة الوقت الحالي لجهازك.",
        "tc.hint.manual": "تعمل الساعة بدءاً من الوقت الذي تختاره.",
        "tc.hint.speed": "تعمل الساعة أسرع أو أبطأ من الوقت الحقيقي.",
        "tc.speedLabel": "سرعة الوقت", "tc.manualLabel": "اختر التاريخ والوقت", "tc.apply": "تطبيق الوقت المخصص", "tc.reset": "العودة للوقت الحقيقي",
        "sp.1": "1× (عادي)", "sp.2": "2× أسرع", "sp.10": "10× أسرع", "sp.60": "60× أسرع", "sp.05": "0.5× أبطأ", "sp.01": "0.1× أبطأ",
        "mode.real": "الوقت الحقيقي", "mode.manual": "وقت يدوي", "mode.speed": "سرعة الوقت",
        "u.min": "د", "u.hour": "س", "u.hours": "ساعات", "u.minutes": "دقائق", "u.seconds": "ثوانٍ", "u.d": "ي", "u.h": "س", "u.m": "د",
        "b.start": "ابدأ", "b.pause": "إيقاف مؤقت", "b.reset": "إعادة ضبط", "b.lap": "لفّة", "b.cancel": "إلغاء", "b.choose": "اختر صورة", "b.remove": "إزالة",
        "b.snooze": "غفوة 5 دقائق", "b.stop": "إيقاف", "b.resume": "متابعة",
        "timer.ready": "المؤقّت جاهز", "timer.running": "المؤقّت يعمل", "timer.paused": "المؤقّت متوقف مؤقتاً", "timer.done": "انتهى الوقت!",
        "timer.presets": "اختيارات سريعة", "timer.doneTitle": "انتهى المؤقّت",
        "sw.laps": "اللفّات", "sw.lap": "اللفّة", "sw.total": "الإجمالي",
        "al.new": "منبّه جديد", "al.edit": "تعديل المنبّه", "al.time": "وقت المنبّه", "al.label": "اسم (اختياري)", "al.labelPh": "مثال: الاستيقاظ",
        "al.repeat": "التكرار", "al.repeatHint": "بدون أيام = يرن مرة واحدة.", "al.tone": "الصوت", "al.preview": "معاينة",
        "al.add": "إضافة منبّه", "al.save": "حفظ التعديلات", "al.note": "يرن المنبّه طالما هذه الصفحة (أو التطبيق المثبّت) مفتوحة.",
        "al.list": "منبّهاتك", "al.empty": "لا توجد منبّهات بعد. أضف أول منبّه.",
        "al.ringing": "منبّه", "al.once": "مرة واحدة", "al.every": "كل يوم", "al.next": "أقرب منبّه بعد", "al.none": "لا توجد منبّهات مفعّلة",
        "al.added": "تمت إضافة المنبّه.", "al.updated": "تم تحديث المنبّه.", "al.deleted": "تم حذف المنبّه.", "al.snoozed": "تم تأجيل المنبّه 5 دقائق.",
        "al.toggle": "تفعيل المنبّه", "al.editBtn": "تعديل المنبّه", "al.deleteBtn": "حذف المنبّه",
        "tone.classic": "رنين كلاسيكي", "tone.chime": "جرس هادئ", "tone.digital": "رقمي",
        "d.0": "الأحد", "d.1": "الإثنين", "d.2": "الثلاثاء", "d.3": "الأربعاء", "d.4": "الخميس", "d.5": "الجمعة", "d.6": "السبت",
        am: "ص", pm: "م",
        "wc.add": "أضف مدينة", "wc.addBtn": "إضافة مدينة", "wc.same": "نفس توقيتك", "wc.ahead": "قبلك", "wc.behind": "بعدك", "wc.remove": "إزالة المدينة", "wc.empty": "لم تتم إضافة مدن.",
        made: "صُنع بواسطة",
        "set.logo": "اسم الشعار", "set.subtitle": "العنوان الفرعي", "set.hand": "لون العقارب", "set.face": "شكل الميناء", "set.numerals": "الأرقام", "set.bezel": "الإطار",
        "set.theme": "المظهر", "set.lang": "اللغة", "set.hour12": "نظام 12 ساعة", "set.showDate": "إظهار التاريخ", "set.glow": "تأثير التوهج",
        "set.appbg": "خلفية التطبيق", "set.watchbg": "خلفية وجه الساعة",
        "set.auto": "تُحفظ تغييراتك تلقائياً على هذا الجهاز.", "set.resetAll": "استعادة الإعدادات الافتراضية",
        "col.gold": "ذهبي", "col.cyan": "سماوي", "col.silver": "فضي", "col.rose": "وردي", "col.custom": "لون مخصص",
        "face.classic": "كلاسيكي", "face.minimal": "بسيط", "face.sport": "رياضي", "num.none": "بدون",
        "bezel.gold": "ذهبي", "bezel.steel": "فولاذي", "bezel.black": "أسود",
        "theme.midnight": "منتصف الليل", "theme.emerald": "زمردي", "theme.ivory": "عاجي",
        "toast.pickTime": "اختر التاريخ والوقت أولاً.", "toast.invalidTime": "تاريخ أو وقت غير صالح.", "toast.applied": "تم تطبيق الوقت المخصص.",
        "toast.synced": "تمت مزامنة الساعة مع جهازك.", "toast.setDuration": "حدّد مدة المؤقّت أولاً.", "toast.startFirst": "ابدأ ساعة الإيقاف أولاً.",
        "toast.pickAlarm": "اختر وقت المنبّه.", "toast.reset": "تمت استعادة التصميم الافتراضي.",
        "toast.notImage": "يرجى اختيار ملف صورة.", "toast.bgSaved": "تم تحديث الخلفية.", "toast.bgUnsaved": "تم تطبيق الخلفية لكنها كبيرة جداً ولن تُحفظ.",
        "toast.bgRemoved": "تمت إزالة الخلفية.", "toast.cityExists": "هذه المدينة موجودة بالفعل في قائمتك."
    }
};

let lang = "en";
const t = (key) => (T[lang] && T[lang][key]) ?? T.en[key] ?? key;

function setText(el, key) {
    el.dataset.i18n = key;
    el.textContent = t(key);
}

function applyI18n(root = document) {
    if (root === document) {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
    $$("[data-i18n]", root).forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-aria]", root).forEach(el => {
        const label = t(el.dataset.i18nAria);
        el.setAttribute("aria-label", label);
        if (el.tagName === "LABEL") el.title = label;
    });
    $$("[data-i18n-ph]", root).forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
}

/* =========================================================
   TOAST
   ========================================================= */

let toastTimeout = null;
function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("show"), 2800);
}

/* =========================================================
   DESIGN / SETTINGS STATE
   ========================================================= */

const defaultDesign = {
    logo: "fikra",
    subtitle: "LUXURY TIME",
    hand: "#ffd166",
    face: "classic",
    numerals: "roman",
    bezel: "gold",
    showDate: true,
    glow: true,
    hour12: false,
    theme: "midnight",
    lang: (navigator.language || "en").toLowerCase().startsWith("ar") ? "ar" : "en"
};

let design = { ...defaultDesign };

// Load saved design (also understands the old v1 key so nobody loses their settings)
(function loadDesign() {
    const saved = store.get(LS.design) || store.get("fikraLuxuryDesign");
    if (saved && typeof saved === "object") design = { ...defaultDesign, ...saved };
    if (!["en", "ar"].includes(design.lang)) design.lang = "en";
    lang = design.lang;
})();

const saveDesign = () => store.set(LS.design, design);

const THEME_COLOR = { midnight: "#000913", emerald: "#00110c", ivory: "#f7f2e8" };

function markSelected(selector, datasetKey, value) {
    $$(selector).forEach(btn => {
        const on = btn.dataset[datasetKey] === value;
        btn.classList.toggle("selected", on);
        btn.setAttribute("aria-pressed", String(on));
    });
}

function applyDesign() {
    const logo = design.logo || defaultDesign.logo;
    const subtitle = design.subtitle || defaultDesign.subtitle;

    $("brandName").textContent = logo;
    $("faceBrand").textContent = logo;
    $("footBrand").textContent = logo;
    $("brandSubtitle").textContent = subtitle;
    $("faceSubtitle").textContent = subtitle;

    document.documentElement.style.setProperty("--hand", design.hand);
    document.documentElement.dataset.theme = design.theme;
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = THEME_COLOR[design.theme] || "#000913";

    document.body.classList.toggle("no-glow", !design.glow);
    $("watch").dataset.bezel = design.bezel;
    $("watchInner").dataset.face = design.face;

    $("showDate").checked = design.showDate;
    $("glowEffect").checked = design.glow;
    $("hour12").checked = design.hour12;
    if (document.activeElement !== $("logoInput")) $("logoInput").value = design.logo;
    if (document.activeElement !== $("subtitleInput")) $("subtitleInput").value = design.subtitle;
    $("handCustom").value = /^#[0-9a-f]{6}$/i.test(design.hand) ? design.hand : "#ffd166";

    $$(".color-choice").forEach(btn => {
        const on = btn.dataset.color.toLowerCase() === String(design.hand).toLowerCase();
        btn.classList.toggle("selected", on);
        btn.setAttribute("aria-pressed", String(on));
    });
    markSelected(".option[data-face]", "face", design.face);
    markSelected(".option[data-numerals]", "numerals", design.numerals);
    markSelected(".option[data-bezel]", "bezel", design.bezel);
    markSelected(".option[data-theme-choice]", "themeChoice", design.theme);
    markSelected(".option[data-lang-choice]", "langChoice", design.lang);

    $("dateWindow").style.display = design.showDate ? "" : "none";
}

function bindDesignControls() {
    $("logoInput").addEventListener("input", e => { design.logo = e.target.value.trim() || defaultDesign.logo; applyDesign(); saveDesign(); });
    $("subtitleInput").addEventListener("input", e => { design.subtitle = e.target.value.trim() || defaultDesign.subtitle; applyDesign(); saveDesign(); });

    $$(".color-choice").forEach(btn => btn.addEventListener("click", () => { design.hand = btn.dataset.color; applyDesign(); saveDesign(); }));
    $("handCustom").addEventListener("input", e => { design.hand = e.target.value; applyDesign(); saveDesign(); });

    $$(".option[data-face]").forEach(b => b.addEventListener("click", () => { design.face = b.dataset.face; applyDesign(); saveDesign(); }));
    $$(".option[data-numerals]").forEach(b => b.addEventListener("click", () => { design.numerals = b.dataset.numerals; buildMarkers(); applyDesign(); saveDesign(); }));
    $$(".option[data-bezel]").forEach(b => b.addEventListener("click", () => { design.bezel = b.dataset.bezel; applyDesign(); saveDesign(); }));
    $$(".option[data-theme-choice]").forEach(b => b.addEventListener("click", () => { design.theme = b.dataset.themeChoice; applyDesign(); saveDesign(); }));
    $$(".option[data-lang-choice]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.langChoice)));

    $("showDate").addEventListener("change", e => { design.showDate = e.target.checked; applyDesign(); saveDesign(); });
    $("glowEffect").addEventListener("change", e => { design.glow = e.target.checked; applyDesign(); saveDesign(); });
    $("hour12").addEventListener("change", e => {
        design.hour12 = e.target.checked;
        buildFormatters(); lastSecKey = -1; renderAlarms(); tickWorld(true); saveDesign();
    });

    $("langBtn").addEventListener("click", () => setLang(lang === "ar" ? "en" : "ar"));

    $("resetDesign").addEventListener("click", () => {
        const keepLang = design.lang;
        design = { ...defaultDesign, lang: keepLang };
        clearAppBackground(true);
        clearWatchBackground(true);
        buildMarkers(); applyDesign(); buildFormatters(); lastSecKey = -1; renderAlarms();
        saveDesign();
        showToast(t("toast.reset"));
    });
}

function setLang(next) {
    lang = next;
    design.lang = next;
    saveDesign();
    applyI18n();
    $("langBtn").textContent = next === "ar" ? "English" : "العربية";
    buildFormatters();
    lastSecKey = -1;
    renderDays();
    renderAlarms();
    renderTimer();
    renderStopwatchLaps();
    updateSwButton();
    updateModeUi();
    fillCitySelect();
    renderWorld();
    updateAlarmStatus();
}

/* ---------- background images (resized before saving so they fit in storage) ---------- */

function loadImageScaled(file, maxDim, quality) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(img.width * scale));
            canvas.height = Math.max(1, Math.round(img.height * scale));
            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("bad image")); };
        img.src = url;
    });
}

function applyAppBackground(dataUrl) {
    document.body.style.setProperty("--app-bg-image", `url("${dataUrl}")`);
    document.body.classList.add("has-bg");
}
function clearAppBackground(silent) {
    document.body.style.removeProperty("--app-bg-image");
    document.body.classList.remove("has-bg");
    store.del(LS.appBg);
    $("backgroundInput").value = "";
    if (!silent) showToast(t("toast.bgRemoved"));
}
function applyWatchBackground(dataUrl) {
    const face = $("watchInner");
    face.style.backgroundImage = `url("${dataUrl}")`;
    face.classList.add("has-custom-bg");
}
function clearWatchBackground(silent) {
    const face = $("watchInner");
    face.style.backgroundImage = "";
    face.classList.remove("has-custom-bg");
    store.del(LS.watchBg);
    $("watchBackgroundInput").value = "";
    if (!silent) showToast(t("toast.bgRemoved"));
}

function bindBackgroundControls() {
    const wire = (chooseId, resetId, inputId, maxDim, quality, apply, storeKey, clear) => {
        $(chooseId).addEventListener("click", () => $(inputId).click());
        $(resetId).addEventListener("click", () => clear(false));
        $(inputId).addEventListener("change", async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (!file.type.startsWith("image/")) { showToast(t("toast.notImage")); return; }
            try {
                const dataUrl = await loadImageScaled(file, maxDim, quality);
                apply(dataUrl);
                showToast(store.set(storeKey, dataUrl) ? t("toast.bgSaved") : t("toast.bgUnsaved"));
            } catch {
                showToast(t("toast.notImage"));
            }
        });
    };
    wire("chooseBackground", "resetBackground", "backgroundInput", 1600, 0.72, applyAppBackground, LS.appBg, clearAppBackground);
    wire("chooseWatchBackground", "resetWatchBackground", "watchBackgroundInput", 700, 0.85, applyWatchBackground, LS.watchBg, clearWatchBackground);

    // restore on startup (the old version saved the watch background but never reloaded it)
    const appBg = store.get(LS.appBg) || store.get("fikraAppBackground");
    if (typeof appBg === "string") applyAppBackground(appBg);
    else {
        try { const legacy = localStorage.getItem("fikraAppBackground"); if (legacy) applyAppBackground(legacy); } catch { /* ignore */ }
    }
    const watchBg = store.get(LS.watchBg);
    if (typeof watchBg === "string") applyWatchBackground(watchBg);
    else {
        try { const legacy = localStorage.getItem("fikraWatchBackground"); if (legacy) applyWatchBackground(legacy); } catch { /* ignore */ }
    }
}

/* =========================================================
   ANALOG + DIGITAL CLOCK
   ========================================================= */

const clockState = { mode: "real", speed: 1, base: Date.now(), start: Date.now() };
const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

let fmtTime, fmtDate;
function buildFormatters() {
    const locale = lang === "ar" ? "ar-EG-u-nu-latn" : "en-US";
    fmtTime = new Intl.DateTimeFormat(locale, {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hourCycle: design.hour12 ? "h12" : "h23"
    });
    fmtDate = new Intl.DateTimeFormat(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function getClockDate() {
    if (clockState.mode === "real") return new Date();
    return new Date(clockState.base + (Date.now() - clockState.start) * clockState.speed);
}

function buildMarkers() {
    const root = $("markers");
    root.textContent = "";
    const frag = document.createDocumentFragment();

    for (let i = 0; i < 60; i++) {
        const tick = h("div", { class: "tick" + (i % 5 === 0 ? " major" : "") + (i === 0 ? " twelve" : "") });
        tick.style.setProperty("--a", `${i * 6}deg`);
        frag.append(tick);
    }

    if (design.numerals !== "none") {
        const roman = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
        const radius = 36.5;
        for (let i = 0; i < 12; i++) {
            const rad = (i * 30 * Math.PI) / 180;
            const el = h("div", {
                class: "numeral" + (design.numerals === "english" ? " arabic-digits" : ""),
                text: design.numerals === "roman" ? roman[i] : String(i === 0 ? 12 : i)
            });
            el.style.left = `${50 + radius * Math.sin(rad)}%`;
            el.style.top = `${50 - radius * Math.cos(rad)}%`;
            frag.append(el);
        }
    }
    root.append(frag);
}

let lastSecKey = -1;
let clockRaf = 0;

function updateDigital(now) {
    $("digitalTime").textContent = fmtTime.format(now);
    $("digitalDate").textContent = fmtDate.format(now);
    $("dateWindow").textContent = pad2(now.getDate());
}

function clockFrame() {
    const now = getClockDate();
    const ms = reduceMotion ? 0 : now.getMilliseconds();
    const sec = now.getSeconds() + ms / 1000;
    const min = now.getMinutes() + sec / 60;
    const hr = (now.getHours() % 12) + min / 60;

    $("hourHand").style.transform = `rotate(${hr * 30}deg)`;
    $("minuteHand").style.transform = `rotate(${min * 6}deg)`;
    $("secondHand").style.transform = `rotate(${sec * 6}deg)`;

    const key = Math.floor(now.getTime() / 1000);
    if (key !== lastSecKey) {
        lastSecKey = key;
        updateDigital(now);
    }
    clockRaf = requestAnimationFrame(clockFrame);
}

function startClockLoop() { if (!clockRaf) clockRaf = requestAnimationFrame(clockFrame); }
function stopClockLoop() { cancelAnimationFrame(clockRaf); clockRaf = 0; }

function toLocalInputValue(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

function updateModeUi() {
    const mode = clockState.mode;
    $$(".seg").forEach(btn => {
        const on = btn.dataset.mode === mode;
        btn.classList.toggle("selected", on);
        btn.setAttribute("aria-pressed", String(on));
    });
    $("manualControls").classList.toggle("hidden", mode !== "manual");
    $("speedControls").classList.toggle("hidden", mode !== "speed");
    $("modeHint").textContent = t("tc.hint." + mode);
    $("modeIndicator").textContent = mode === "speed"
        ? `${t("mode.speed")} ${clockState.speed}×`
        : t("mode." + mode);
    $("resetTime").classList.toggle("hidden", mode === "real");
}

function setClockMode(mode) {
    const current = getClockDate();
    clockState.mode = mode;
    clockState.base = current.getTime();
    clockState.start = Date.now();
    clockState.speed = mode === "speed" ? (Number($("timeSpeed").value) || 1) : 1;
    if (mode === "manual") $("manualDateTime").value = toLocalInputValue(current);
    lastSecKey = -1;
    updateModeUi();
}

function bindClockControls() {
    $$(".seg").forEach(btn => btn.addEventListener("click", () => setClockMode(btn.dataset.mode)));

    $("timeSpeed").addEventListener("change", () => {
        if (clockState.mode === "speed") setClockMode("speed");
    });

    $("applyManualTime").addEventListener("click", () => {
        const value = $("manualDateTime").value;
        if (!value) { showToast(t("toast.pickTime")); return; }
        const selected = new Date(value);
        if (Number.isNaN(selected.getTime())) { showToast(t("toast.invalidTime")); return; }
        clockState.base = selected.getTime();
        clockState.start = Date.now();
        clockState.speed = 1;
        lastSecKey = -1;
        showToast(t("toast.applied"));
    });

    $("resetTime").addEventListener("click", () => {
        setClockMode("real");
        showToast(t("toast.synced"));
    });
}

/* =========================================================
   AUDIO + RING (shared by timer and alarms)
   ========================================================= */

let audioCtx = null;
function unlockAudio() {
    if (!audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) { try { audioCtx = new Ctx(); } catch { audioCtx = null; } }
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume().catch(() => { });
}
["pointerdown", "keydown", "touchstart"].forEach(evt => window.addEventListener(evt, unlockAudio, { passive: true }));

function beep(freq, start, dur, type = "sine", vol = 0.2) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const t0 = audioCtx.currentTime + start;
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
}

const TONES = {
    classic: () => [0, 0.3, 0.6].forEach(d => beep(880, d, 0.2, "square", 0.1)),
    chime: () => [[523.25, 0], [659.25, 0.25], [783.99, 0.5], [1046.5, 0.75]].forEach(([f, d]) => beep(f, d, 0.9, "sine", 0.22)),
    digital: () => { for (let i = 0; i < 6; i++) beep(i % 2 ? 900 : 1250, i * 0.12, 0.1, "square", 0.09); }
};
function playTone(name) {
    unlockAudio();
    (TONES[name] || TONES.classic)();
}

function ensureNotifyPermission() {
    try {
        if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
    } catch { /* ignore */ }
}
function notify(title, body) {
    try {
        if ("Notification" in window && Notification.permission === "granted" && document.hidden) {
            new Notification(title, { body, icon: "icons/icon-192.png", tag: "fikra-time" });
        }
    } catch { /* ignore */ }
}

const ringQueue = [];
let ringing = null;
let ringInterval = null;
let ringAutoStop = null;
let titleInterval = null;
let ringReturnFocus = null;

function ring(opts) {
    if (ringing) { ringQueue.push(opts); return; }
    ringing = opts;
    ringReturnFocus = document.activeElement;

    $("modalTitle").textContent = opts.title;
    $("modalText").textContent = opts.text;
    $("modalSnooze").hidden = !opts.snooze;
    document.querySelector(".modal-actions").classList.toggle("single", !opts.snooze);
    $("modal").hidden = false;
    $("modalStop").focus();

    playTone(opts.tone);
    ringInterval = setInterval(() => playTone(opts.tone), 2400);
    ringAutoStop = setTimeout(() => stopRing(), 120000);
    if (navigator.vibrate) try { navigator.vibrate([300, 150, 300]); } catch { /* ignore */ }

    let flash = false;
    titleInterval = setInterval(() => { flash = !flash; document.title = flash ? `🔔 ${opts.title}` : BASE_TITLE; }, 800);
    notify(opts.title, opts.text);
}

function stopRing(snooze) {
    if (!ringing) return;
    const finished = ringing;
    clearInterval(ringInterval);
    clearInterval(titleInterval);
    clearTimeout(ringAutoStop);
    document.title = BASE_TITLE;
    $("modal").hidden = true;
    ringing = null;
    if (snooze && finished.onSnooze) finished.onSnooze();
    if (ringReturnFocus && ringReturnFocus.focus) try { ringReturnFocus.focus(); } catch { /* ignore */ }
    if (ringQueue.length) ring(ringQueue.shift());
}

function bindModal() {
    $("modalStop").addEventListener("click", () => stopRing(false));
    $("modalSnooze").addEventListener("click", () => stopRing(true));
}

/* =========================================================
   TIMER
   ========================================================= */

const RING_LENGTH = 2 * Math.PI * 90;
const timer = { state: "ready", total: 600, remaining: 600, end: 0, interval: null };

function formatHMS(totalSeconds) {
    totalSeconds = Math.max(0, Math.ceil(totalSeconds));
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${pad2(hrs)}:${pad2(mins)}:${pad2(secs)}`;
}

function timerInputSeconds() {
    const clamp = (id, max) => Math.max(0, Math.min(max, Math.floor(Number($(id).value) || 0)));
    return clamp("timerHours", 99) * 3600 + clamp("timerMinutes", 59) * 60 + clamp("timerSeconds", 59);
}

function setTimerInputs(totalSeconds) {
    $("timerHours").value = Math.floor(totalSeconds / 3600);
    $("timerMinutes").value = Math.floor((totalSeconds % 3600) / 60);
    $("timerSeconds").value = totalSeconds % 60;
}

function renderTimer() {
    $("timerDisplay").textContent = formatHMS(timer.remaining);
    const frac = timer.total > 0 ? Math.max(0, Math.min(1, timer.remaining / timer.total)) : 0;
    $("timerRing").style.strokeDashoffset = String(RING_LENGTH * (1 - frac));
    $("timerStatus").textContent = t("timer." + timer.state);
    const startBtn = $("startTimer");
    setText(startBtn.querySelector("span"), timer.state === "paused" ? "b.resume" : "b.start");
    startBtn.disabled = timer.state === "running";
    $("pauseTimer").disabled = timer.state !== "running";
}

function persistTimer() {
    if (timer.state === "ready" || timer.state === "done") store.del(LS.timer);
    else store.set(LS.timer, { state: timer.state, total: timer.total, remaining: timer.remaining, end: timer.end });
}

function timerTick() {
    timer.remaining = Math.max(0, (timer.end - Date.now()) / 1000);
    renderTimer();
    if (timer.remaining <= 0) finishTimer();
}

function finishTimer() {
    clearInterval(timer.interval);
    timer.state = "done";
    timer.remaining = 0;
    renderTimer();
    persistTimer();
    ring({ title: t("timer.doneTitle"), text: formatHMS(timer.total), tone: "chime", snooze: false });
}

function resetTimer() {
    clearInterval(timer.interval);
    timer.state = "ready";
    timer.total = timer.remaining = timerInputSeconds();
    persistTimer();
    renderTimer();
}

function startTimer() {
    if (timer.state === "running") return;
    if (timer.state !== "paused") {
        timer.total = timer.remaining = timerInputSeconds();
    }
    if (timer.remaining <= 0) { showToast(t("toast.setDuration")); return; }
    ensureNotifyPermission();
    timer.state = "running";
    timer.end = Date.now() + timer.remaining * 1000;
    clearInterval(timer.interval);
    timer.interval = setInterval(timerTick, 200);
    persistTimer();
    renderTimer();
}

function pauseTimer() {
    if (timer.state !== "running") return;
    timer.remaining = Math.max(0, (timer.end - Date.now()) / 1000);
    clearInterval(timer.interval);
    timer.state = "paused";
    persistTimer();
    renderTimer();
}

function restoreTimer() {
    const saved = store.get(LS.timer);
    if (!saved || !saved.total) { renderTimer(); return; }
    timer.total = saved.total;
    setTimerInputs(saved.total);
    if (saved.state === "running") {
        timer.end = saved.end;
        timer.remaining = Math.max(0, (saved.end - Date.now()) / 1000);
        if (timer.remaining <= 0) { finishTimer(); return; }
        timer.state = "running";
        timer.interval = setInterval(timerTick, 200);
    } else if (saved.state === "paused") {
        timer.state = "paused";
        timer.remaining = saved.remaining;
    }
    renderTimer();
}

function bindTimerControls() {
    $("startTimer").addEventListener("click", startTimer);
    $("pauseTimer").addEventListener("click", pauseTimer);
    $("resetTimer").addEventListener("click", resetTimer);

    ["timerHours", "timerMinutes", "timerSeconds"].forEach(id => {
        $(id).addEventListener("input", () => { if (timer.state !== "running") resetTimer(); });
    });
    $$(".chip[data-preset]").forEach(chip => chip.addEventListener("click", () => {
        if (timer.state === "running") return;
        setTimerInputs(Number(chip.dataset.preset));
        resetTimer();
    }));
}

/* =========================================================
   STOPWATCH
   ========================================================= */

const sw = { running: false, elapsed: 0, startTs: 0, raf: 0, laps: [] };

const swTime = () => sw.elapsed + (sw.running ? performance.now() - sw.startTs : 0);

function formatStopwatch(ms) {
    const cs = Math.floor(ms / 10) % 100;
    const s = Math.floor(ms / 1000) % 60;
    const m = Math.floor(ms / 60000) % 60;
    const hrs = Math.floor(ms / 3600000);
    return `${pad2(hrs)}:${pad2(m)}:${pad2(s)}.${pad2(cs)}`;
}

function renderStopwatch() { $("stopwatchDisplay").textContent = formatStopwatch(swTime()); }
function swLoop() { renderStopwatch(); if (sw.running) sw.raf = requestAnimationFrame(swLoop); }

function updateSwButton() {
    const btn = $("startStopwatch");
    btn.querySelector("use").setAttribute("href", sw.running ? "#i-pause" : "#i-play");
    setText(btn.querySelector("span"), sw.running ? "b.pause" : (sw.elapsed > 0 ? "b.resume" : "b.start"));
    btn.classList.toggle("green-btn", !sw.running);
    btn.classList.toggle("outline-btn", sw.running);
}

function renderStopwatchLaps() {
    const body = $("lapsList");
    body.textContent = "";
    $("lapsWrap").classList.toggle("hidden", sw.laps.length === 0);
    if (!sw.laps.length) return;

    let best = -1, worst = -1;
    if (sw.laps.length >= 2) {
        const times = sw.laps.map(l => l.lap);
        best = times.indexOf(Math.min(...times));
        worst = times.indexOf(Math.max(...times));
    }
    sw.laps.forEach((lap, i) => {
        const cls = i === best ? "best" : i === worst ? "worst" : "";
        body.append(h("tr", { class: cls },
            h("td", { text: String(lap.n) }),
            h("td", { text: formatStopwatch(lap.lap), dir: "ltr" }),
            h("td", { text: formatStopwatch(lap.total), dir: "ltr" })
        ));
    });
}

function bindStopwatchControls() {
    $("startStopwatch").addEventListener("click", () => {
        if (sw.running) {
            sw.elapsed = swTime();
            sw.running = false;
            cancelAnimationFrame(sw.raf);
        } else {
            sw.startTs = performance.now();
            sw.running = true;
            swLoop();
        }
        updateSwButton();
        renderStopwatch();
    });

    $("lapStopwatch").addEventListener("click", () => {
        if (!sw.running && sw.elapsed === 0) { showToast(t("toast.startFirst")); return; }
        const total = swTime();
        const prev = sw.laps.length ? sw.laps[0].total : 0;
        sw.laps.unshift({ n: sw.laps.length + 1, lap: total - prev, total });
        renderStopwatchLaps();
    });

    $("resetStopwatch").addEventListener("click", () => {
        sw.running = false;
        sw.elapsed = 0;
        sw.laps = [];
        cancelAnimationFrame(sw.raf);
        updateSwButton();
        renderStopwatch();
        renderStopwatchLaps();
    });
}

/* =========================================================
   ALARMS (multiple, editable, with snooze)
   ========================================================= */

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
let alarms = [];
let editingId = null;
const snoozes = [];
let lastCheckedMinute = Math.floor(Date.now() / 60000);

function loadAlarms() {
    const saved = store.get(LS.alarms);
    if (Array.isArray(saved)) { alarms = saved; return; }
    // migrate the single alarm from the first version
    const legacy = store.get("fikraAlarm");
    if (legacy && legacy.time) {
        alarms = [{ id: "legacy", time: legacy.time, label: "", days: legacy.days || [], tone: "classic", enabled: !!legacy.enabled }];
        store.set(LS.alarms, alarms);
    }
}
const saveAlarms = () => store.set(LS.alarms, alarms);

function formatClockTime(hhmm) {
    const [hrs, mins] = hhmm.split(":").map(Number);
    if (!design.hour12) return `${pad2(hrs)}:${pad2(mins)}`;
    return `${(hrs % 12) || 12}:${pad2(mins)} ${hrs < 12 ? t("am") : t("pm")}`;
}

function formatDuration(ms) {
    const totalMin = Math.max(1, Math.round(ms / 60000));
    const d = Math.floor(totalMin / 1440);
    const hrs = Math.floor((totalMin % 1440) / 60);
    const m = totalMin % 60;
    const parts = [];
    if (d) parts.push(`${d}${t("u.d")}`);
    if (hrs) parts.push(`${hrs}${t("u.h")}`);
    if (m || !parts.length) parts.push(`${m}${t("u.m")}`);
    return parts.join(" ");
}

function nextOccurrence(alarm, from = new Date()) {
    const [hrs, mins] = alarm.time.split(":").map(Number);
    for (let offset = 0; offset <= 7; offset++) {
        const c = new Date(from.getFullYear(), from.getMonth(), from.getDate() + offset, hrs, mins, 0, 0);
        if (c > from && (!alarm.days.length || alarm.days.includes(c.getDay()))) return c;
    }
    return null;
}

function updateAlarmStatus() {
    const now = new Date();
    const upcoming = alarms.filter(a => a.enabled).map(a => nextOccurrence(a, now)).filter(Boolean);
    $("alarmStatus").textContent = upcoming.length
        ? `${t("al.next")} ${formatDuration(Math.min(...upcoming) - now)}`
        : t("al.none");
}

function renderDays(checkedValues) {
    const wrap = $("alarmDays");
    const checked = checkedValues || $$("input", wrap).filter(i => i.checked).map(i => Number(i.value));
    wrap.textContent = "";
    DAY_ORDER.forEach(d => {
        const input = h("input", { type: "checkbox", value: String(d) });
        input.checked = checked.includes(d);
        wrap.append(h("label", { class: "day" }, input, h("span", { text: t("d." + d) })));
    });
}

function describeDays(days) {
    if (!days.length) return t("al.once");
    if (days.length === 7) return t("al.every");
    return DAY_ORDER.filter(d => days.includes(d)).map(d => t("d." + d)).join(lang === "ar" ? "، " : ", ");
}

function renderAlarms() {
    const list = $("alarmList");
    list.textContent = "";
    $("alarmEmpty").classList.toggle("hidden", alarms.length > 0);

    alarms.forEach(alarm => {
        const toggle = h("input", { type: "checkbox", class: "switch", "aria-label": `${t("al.toggle")} ${formatClockTime(alarm.time)}` });
        toggle.checked = alarm.enabled;
        toggle.addEventListener("change", () => {
            alarm.enabled = toggle.checked;
            if (alarm.enabled) ensureNotifyPermission();
            saveAlarms(); renderAlarms();
        });

        const editBtn = h("button", { type: "button", class: "icon-btn", "aria-label": t("al.editBtn"), title: t("al.editBtn"), onclick: () => startEditAlarm(alarm.id) }, icon("i-edit"));
        const delBtn = h("button", { type: "button", class: "icon-btn", "aria-label": t("al.deleteBtn"), title: t("al.deleteBtn"), onclick: () => deleteAlarm(alarm.id) }, icon("i-trash"));

        const meta = [alarm.label, describeDays(alarm.days), t("tone." + alarm.tone)].filter(Boolean).join(" · ");
        list.append(h("li", { class: "alarm-item" + (alarm.enabled ? "" : " off") },
            h("div", { class: "alarm-time", dir: "ltr", text: formatClockTime(alarm.time) }),
            h("div", { class: "alarm-meta", text: meta }),
            h("div", { class: "alarm-actions" }, toggle, editBtn, delBtn)
        ));
    });
    updateAlarmStatus();
}

function resetAlarmForm() {
    editingId = null;
    $("alarmTime").value = "07:00";
    $("alarmLabel").value = "";
    $("alarmTone").value = "classic";
    renderDays([]);
    setText($("alarmFormTitle"), "al.new");
    setText($("saveAlarmText"), "al.add");
    $("cancelEdit").classList.add("hidden");
}

function startEditAlarm(id) {
    const alarm = alarms.find(a => a.id === id);
    if (!alarm) return;
    editingId = id;
    $("alarmTime").value = alarm.time;
    $("alarmLabel").value = alarm.label || "";
    $("alarmTone").value = alarm.tone;
    renderDays(alarm.days);
    setText($("alarmFormTitle"), "al.edit");
    setText($("saveAlarmText"), "al.save");
    $("cancelEdit").classList.remove("hidden");
    $("alarmTime").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    $("alarmTime").focus();
}

function deleteAlarm(id) {
    alarms = alarms.filter(a => a.id !== id);
    if (editingId === id) resetAlarmForm();
    saveAlarms(); renderAlarms();
    showToast(t("al.deleted"));
}

function saveAlarmFromForm() {
    const time = $("alarmTime").value;
    if (!/^\d{2}:\d{2}$/.test(time)) { showToast(t("toast.pickAlarm")); return; }
    const days = $$("input", $("alarmDays")).filter(i => i.checked).map(i => Number(i.value));
    const data = { time, label: $("alarmLabel").value.trim(), days, tone: $("alarmTone").value };

    if (editingId) {
        const alarm = alarms.find(a => a.id === editingId);
        if (alarm) Object.assign(alarm, data, { enabled: true });
        showToast(t("al.updated"));
    } else {
        alarms.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), enabled: true, ...data });
        showToast(t("al.added"));
    }
    alarms.sort((a, b) => a.time.localeCompare(b.time));
    ensureNotifyPermission();
    saveAlarms();
    resetAlarmForm();
    renderAlarms();
}

function fireAlarm(alarm) {
    ring({
        title: alarm.label || t("al.ringing"),
        text: formatClockTime(alarm.time),
        tone: alarm.tone,
        snooze: true,
        onSnooze: () => {
            snoozes.push({ ts: Date.now() + 5 * 60000, alarm });
            showToast(t("al.snoozed"));
        }
    });
}

/** Checks every minute since the last check, so an alarm isn't missed if the tab was throttled in the background. */
function checkAlarms() {
    const nowMs = Date.now();
    const nowMinute = Math.floor(nowMs / 60000);
    const from = Math.max(lastCheckedMinute + 1, nowMinute - 15);

    for (let minute = from; minute <= nowMinute; minute++) {
        const when = new Date(minute * 60000);
        const hhmm = `${pad2(when.getHours())}:${pad2(when.getMinutes())}`;
        alarms.forEach(alarm => {
            if (!alarm.enabled || alarm.time !== hhmm) return;
            if (alarm.days.length && !alarm.days.includes(when.getDay())) return;
            fireAlarm(alarm);
            if (!alarm.days.length) { alarm.enabled = false; saveAlarms(); renderAlarms(); }
        });
    }
    lastCheckedMinute = nowMinute;

    for (let i = snoozes.length - 1; i >= 0; i--) {
        if (nowMs >= snoozes[i].ts) fireAlarm(snoozes.splice(i, 1)[0].alarm);
    }
}

function bindAlarmControls() {
    $("saveAlarm").addEventListener("click", saveAlarmFromForm);
    $("cancelEdit").addEventListener("click", resetAlarmForm);
    $("previewTone").addEventListener("click", () => playTone($("alarmTone").value));
}

/* =========================================================
   WORLD CLOCK
   ========================================================= */

const CITIES = [
    { tz: "Africa/Cairo", en: "Cairo", ar: "القاهرة" },
    { tz: "Asia/Riyadh", en: "Riyadh", ar: "الرياض" },
    { tz: "Asia/Dubai", en: "Dubai", ar: "دبي" },
    { tz: "Asia/Qatar", en: "Doha", ar: "الدوحة" },
    { tz: "Europe/Istanbul", en: "Istanbul", ar: "إسطنبول" },
    { tz: "Europe/London", en: "London", ar: "لندن" },
    { tz: "Europe/Paris", en: "Paris", ar: "باريس" },
    { tz: "Europe/Berlin", en: "Berlin", ar: "برلين" },
    { tz: "Europe/Moscow", en: "Moscow", ar: "موسكو" },
    { tz: "America/New_York", en: "New York", ar: "نيويورك" },
    { tz: "America/Chicago", en: "Chicago", ar: "شيكاغو" },
    { tz: "America/Los_Angeles", en: "Los Angeles", ar: "لوس أنجلوس" },
    { tz: "America/Toronto", en: "Toronto", ar: "تورونتو" },
    { tz: "America/Sao_Paulo", en: "São Paulo", ar: "ساو باولو" },
    { tz: "Africa/Lagos", en: "Lagos", ar: "لاغوس" },
    { tz: "Africa/Johannesburg", en: "Johannesburg", ar: "جوهانسبرغ" },
    { tz: "Asia/Kolkata", en: "Mumbai", ar: "مومباي" },
    { tz: "Asia/Bangkok", en: "Bangkok", ar: "بانكوك" },
    { tz: "Asia/Singapore", en: "Singapore", ar: "سنغافورة" },
    { tz: "Asia/Shanghai", en: "Shanghai", ar: "شنغهاي" },
    { tz: "Asia/Tokyo", en: "Tokyo", ar: "طوكيو" },
    { tz: "Asia/Seoul", en: "Seoul", ar: "سيول" },
    { tz: "Australia/Sydney", en: "Sydney", ar: "سيدني" },
    { tz: "Pacific/Auckland", en: "Auckland", ar: "أوكلاند" }
];
const DEFAULT_CITIES = ["Africa/Cairo", "Europe/London", "America/New_York", "Asia/Dubai", "Asia/Tokyo"];
let worldZones = [];
const worldRefs = new Map();
const tzFormatters = new Map();

const cityName = (c) => c[lang] || c.en;

function loadWorld() {
    const saved = store.get(LS.world);
    worldZones = Array.isArray(saved)
        ? saved.filter(tz => CITIES.some(c => c.tz === tz))
        : [...DEFAULT_CITIES];
}

function tzFormatter(tz) {
    const key = `${tz}|${lang}|${design.hour12}`;
    if (!tzFormatters.has(key)) {
        const locale = lang === "ar" ? "ar-EG-u-nu-latn" : "en-US";
        tzFormatters.set(key, {
            time: new Intl.DateTimeFormat(locale, { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: design.hour12 ? "h12" : "h23" }),
            date: new Intl.DateTimeFormat(locale, { timeZone: tz, weekday: "short", day: "numeric", month: "short" }),
            parts: new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })
        });
    }
    return tzFormatters.get(key);
}

function tzOffsetMinutes(tz, date) {
    const p = Object.fromEntries(tzFormatter(tz).parts.formatToParts(date).map(x => [x.type, x.value]));
    const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
    return (asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000;
}

function describeOffset(diffMin) {
    if (diffMin === 0) return t("wc.same");
    const abs = Math.abs(diffMin);
    const hrs = Math.floor(abs / 60);
    const mins = abs % 60;
    const amount = `${hrs}${t("u.h")}${mins ? ` ${mins}${t("u.m")}` : ""}`;
    return `${amount} ${diffMin > 0 ? t("wc.ahead") : t("wc.behind")}`;
}

function fillCitySelect() {
    const select = $("citySelect");
    const current = select.value;
    select.textContent = "";
    CITIES.filter(c => !worldZones.includes(c.tz))
        .sort((a, b) => cityName(a).localeCompare(cityName(b), lang))
        .forEach(c => select.append(h("option", { value: c.tz, text: cityName(c) })));
    if (current && $$("option", select).some(o => o.value === current)) select.value = current;
    $("addCity").disabled = select.options.length === 0;
}

function renderWorld() {
    const list = $("worldList");
    list.textContent = "";
    worldRefs.clear();

    if (!worldZones.length) {
        list.append(h("li", { class: "empty", text: t("wc.empty") }));
        return;
    }
    worldZones.forEach(tz => {
        const city = CITIES.find(c => c.tz === tz);
        const sunMoon = h("span", { class: "sunmoon" }, icon("i-sun"));
        const timeEl = h("div", { class: "world-time", dir: "ltr" });
        const metaEl = h("div", { class: "world-meta" });
        const remove = h("button", {
            type: "button", class: "world-remove",
            "aria-label": `${t("wc.remove")}: ${cityName(city)}`, title: t("wc.remove"),
            onclick: () => {
                worldZones = worldZones.filter(z => z !== tz);
                store.set(LS.world, worldZones);
                fillCitySelect(); renderWorld();
            }
        }, icon("i-close"));

        list.append(h("li", { class: "world-item" },
            h("div", { class: "world-city" }, sunMoon, h("span", { text: cityName(city) })),
            timeEl, metaEl, remove));
        worldRefs.set(tz, { timeEl, metaEl, sunMoon });
    });
    tickWorld(true);
}

function tickWorld(force) {
    if (!force && $("worldView").hidden) return;
    const now = new Date();
    const localOffset = -now.getTimezoneOffset();
    worldRefs.forEach((refs, tz) => {
        const f = tzFormatter(tz);
        refs.timeEl.textContent = f.time.format(now);
        const offset = tzOffsetMinutes(tz, now);
        refs.metaEl.textContent = `${f.date.format(now)} · ${describeOffset(offset - localOffset)}`;
        const hour = new Date(now.getTime() + offset * 60000).getUTCHours();
        const day = hour >= 6 && hour < 18;
        const href = day ? "#i-sun" : "#i-moon";
        const use = refs.sunMoon.querySelector("use");
        if (use.getAttribute("href") !== href) use.setAttribute("href", href);
    });
}

function bindWorldControls() {
    $("addCity").addEventListener("click", () => {
        const tz = $("citySelect").value;
        if (!tz) return;
        if (worldZones.includes(tz)) { showToast(t("toast.cityExists")); return; }
        worldZones.push(tz);
        store.set(LS.world, worldZones);
        fillCitySelect(); renderWorld();
    });
}

/* =========================================================
   NAVIGATION
   ========================================================= */

const VIEWS = ["clock", "timer", "stopwatch", "alarm", "world"];

function openView(name, { updateHash = true } = {}) {
    if (!VIEWS.includes(name)) name = "clock";
    VIEWS.forEach(v => { $(v + "View").hidden = v !== name; });
    $$(".nav-btn").forEach(btn => {
        const on = btn.dataset.view === name;
        btn.classList.toggle("active", on);
        if (on) btn.setAttribute("aria-current", "page"); else btn.removeAttribute("aria-current");
    });
    if (name === "clock") { lastSecKey = -1; startClockLoop(); } else stopClockLoop();
    if (name === "world") tickWorld(true);
    if (name === "alarm") updateAlarmStatus();
    if (updateHash) { try { history.replaceState(null, "", "#" + name); } catch { /* file:// in some browsers */ } }
    window.scrollTo({ top: 0 });
}

function bindNavigation() {
    $$(".nav-btn").forEach(btn => btn.addEventListener("click", () => openView(btn.dataset.view)));
    window.addEventListener("hashchange", () => openView(location.hash.slice(1), { updateHash: false }));
}

/* =========================================================
   SETTINGS DRAWER (accessible: focus trap, Esc, inert)
   ========================================================= */

const drawer = $("customization");
const backdrop = $("settingsBackdrop");
let drawerReturnFocus = null;

function focusableIn(root) {
    return $$('button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])', root)
        .filter(el => !el.hidden && el.offsetParent !== null);
}

function openSettings() {
    drawerReturnFocus = document.activeElement;
    drawer.inert = false;
    drawer.removeAttribute("inert");
    drawer.classList.add("open");
    backdrop.classList.add("open");
    document.body.classList.add("settings-open");
    $("settingsBtn").setAttribute("aria-expanded", "true");
    setTimeout(() => $("closeSettings").focus(), 60);
}

function closeSettings() {
    if (!drawer.classList.contains("open")) return;
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    document.body.classList.remove("settings-open");
    $("settingsBtn").setAttribute("aria-expanded", "false");
    drawer.inert = true;
    if (drawerReturnFocus && drawerReturnFocus.focus) drawerReturnFocus.focus();
}

function bindSettingsDrawer() {
    $("settingsBtn").addEventListener("click", () => drawer.classList.contains("open") ? closeSettings() : openSettings());
    $("closeSettings").addEventListener("click", closeSettings);
    backdrop.addEventListener("click", closeSettings);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (ringing) stopRing(false);
            else closeSettings();
            return;
        }
        if (e.key !== "Tab") return;
        const trapRoot = ringing ? document.querySelector(".modal-card") : (drawer.classList.contains("open") ? drawer : null);
        if (!trapRoot) return;
        const items = focusableIn(trapRoot);
        if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        else if (!trapRoot.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    });
}

/* =========================================================
   STARTUP
   ========================================================= */

function init() {
    $("year").textContent = new Date().getFullYear();

    bindModal();
    bindDesignControls();
    bindBackgroundControls();
    bindClockControls();
    bindTimerControls();
    bindStopwatchControls();
    bindAlarmControls();
    bindWorldControls();
    bindNavigation();
    bindSettingsDrawer();

    applyI18n();
    $("langBtn").textContent = lang === "ar" ? "English" : "العربية";
    buildFormatters();
    buildMarkers();
    applyDesign();
    updateModeUi();

    renderDays([]);
    loadAlarms();
    renderAlarms();

    loadWorld();
    fillCitySelect();
    renderWorld();

    setTimerInputs(600);
    restoreTimer();
    renderStopwatch();
    updateSwButton();

    setInterval(checkAlarms, 1000);
    setInterval(() => tickWorld(false), 1000);
    setInterval(() => { if (!$("alarmView").hidden) updateAlarmStatus(); }, 20000);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) checkAlarms(); });

    openView(location.hash.slice(1) || "clock", { updateHash: false });

    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
        window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => { }));
    }
}

init();
