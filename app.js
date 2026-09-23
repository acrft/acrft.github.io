const translations = {
    ar: {
        title: "سيرفر علم كرافت",
        copyBtn: "نسخ الـ IP",
        javaVersion: "☕️ جافا:",
        bedrockVersion: "🛏️ بيدروك:",
        startServer: "تشغيل السيرفر 🚀",
        addBedrock: "إضافة السيرفر إلى ماينكرافت البيدروك",
        rulesTitle: "📜 القوانين",
        rule1: "1️⃣ ممنوع الهاك و الـ X-Ray 🌐",
        rule2: "2️⃣ ممنوع بناء اشكال +18 🔞",
        rule3: "3️⃣ ممنوع السب والشتم 🤬",
        rule4: "4️⃣ ممنوع طلب أدمن 👑",
        rule5: "5️⃣ ممنوع الترويج بأي شكل 📢",
        rule6: "6️⃣ ممنوع السبام في الشات 🤐",
        rule7: "7️⃣ ممنوع استغلال الجلتشات 🔄",
        rule8: "8️⃣ للإدارة الحق في اتخاذ القرار ⚖️",
        punishSystem: "🟥 إنذار 🟩 ⬅️ إنذار 🟨 ⬅️ طرد",
        linksTitle: "🔗 روابط السيرفر",
        whatsapp: "قناة الواتساب",
        telegram: "مجموعة التليجرام",
        messenger: "مجموعة الماسينجر",
        discord: "سيرفر الديسكورد",
        adminsTitle: "👑 المشرفين",
        adminsNames: "❄️👑 علَم جيمر ☘️، ثعلوب 🦊، ملك الجليد",
        copyright: "© 2026 AlamCraft Server",
        toastMsg: "✔ تم نسخ  الـ IP السيرفر بنجاح",
        feature1: "✅ يدعم الجافا و البيدروك",
        feature2: "✅ قوانين واضحة و عادلة",
        feature3: "✅ تحديثات مستمرة",
        feature4: "✅ إدارة نشطة",
        downloadCenterBtn: "مركز التحميل",
    },
    en: {
        title: "AlamCraft Server",
        copyBtn: "Copy IP",
        javaVersion: "☕️ Java:",
        bedrockVersion: "🛏️ Bedrock:",
        startServer: "Start Server 🚀",
        addBedrock: "Add Server to Minecraft Bedrock",
        rulesTitle: "📜 Server Rules",
        rule1: "1️⃣ No Hacking or X-Ray 🌐",
        rule2: "2️⃣ No +18 builds 🔞",
        rule3: "3️⃣ No swearing or insults 🤬",
        rule4: "4️⃣ Do not ask for Admin status 👑",
        rule5: "5️⃣ No self-promotion of any kind 📢",
        rule6: "6️⃣ No chat spamming 🤐",
        rule7: "7️⃣ No exploiting glitches 🔄",
        rule8: "8️⃣ Staff reserve the right to decide ⚖️",
        punishSystem: "Warning 🟩 ➡️ Warning 🟨 ➡️ Kick 🟥",
        linksTitle: "🔗 Server Links",
        whatsapp: "WhatsApp",
        telegram: "Telegram",
        messenger: "Messenger",
        discord: "Discord",
        adminsTitle: "👑 Staff",
        adminsNames: "AlamGamer ☘️, LostFox 🦊, KingSnow 👑❄️",
        copyright: "© 2026 AlamCraft Server",
        toastMsg: "✔ Server IP Copied!",
        feature1: "✅ Java & Bedrock",
        feature2: "✅ Fair Rules",
        feature3: "✅ Constant Updates",
        feature4: "✅ Active Staff",
        downloadCenterBtn: "Download Center",
    }
};

let currentLang = localStorage.getItem("lang") || "ar";

const $ = s => document.querySelector(s);
const toast = $("#toast");
const sideMenu = $("#sideMenu");
const menuOverlay = $("#menuOverlay");
const socialLinks = $(".social-links");

const mcStatus = $("#mc-status");
const mcPlayers = $("#mc-players");
const mcPing = $("#mc-ping");
const mcOnlinePlayers = $("#mc-online-players");
function toggleMenu() {
    sideMenu?.classList.toggle("active");
    menuOverlay?.classList.toggle("active");
}
function renderAlamChatBtn() {
    if (!socialLinks) return;
    document.querySelector(".alamchat-btn")?.remove();
    const a = document.createElement("a");
    a.href = "https://acrft.github.io/achat";
    a.target = "_blank";
    a.className = "social-item alamchat-btn";
    a.innerHTML = `<img src="images/achat.png" class="link-icon"><span>${currentLang === "ar" ? "منصة علم شات" : "Alam Chat Platform"}</span>`;
    socialLinks.prepend(a);
}
async function updateServerStatus() {
    try {
        const start = performance.now();
        const res = await fetch("https://api.mcstatus.io/v2/status/java/amc.falix.gg");
        const data = await res.json();
        const mcIcon = document.getElementById("mc-icon");

        mcIcon.src = data.icon || "images/logo.webp";
        const motd = Array.isArray(data.motd?.html) ? data.motd.html.join("<br>") : data.motd?.html || "";
        const ping = Math.round(performance.now() - start);
        const online = data.players?.online ?? 0;
        const max = data.players?.max ?? 0;

        if (!data.online) {
            setOfflineUI();
            return;
        }
        if (mcPlayers) mcPlayers.textContent = `${data.players.online}/${data.players.max}`;
        if (mcPing) mcPing.textContent = `${ping} ms`;
        const bars = document.querySelectorAll(".mc-ping span");
        mcStatus.innerHTML = motd;
        let level = 5;

        if (data.online === false) {
            level = 0;
        } else if (ping >= 1000) {
            level = 1;
        } else if (ping >= 600) {
            level = 2;
        } else if (ping >= 300) {
            level = 3;
        } else if (ping >= 150) {
            level = 4;
        }

        bars.forEach((bar, i) => {
            bar.style.opacity = i < level ? 1 : .18;
            bar.style.background = data.online ? "#55ff55" : "#ff5555";
        });
        if (mcOnlinePlayers) {
            const players = data.players?.list || [];
            mcOnlinePlayers.innerHTML = players.map(player => `<div class="mc-player"><img src="${getHead(player.name_clean)}"><span>${player.name_clean}</span></div>`).join("");
        }

    } catch (e) {
        setOfflineUI();
    }
}
let skins = {};

async function loadSkins() {
    try {
        const res = await fetch(`https://amc1.falix.org/skins.json?t=${Date.now()}`);
        skins = await res.json();


    } catch (e) {
        console.error("loadSkins error:", e);
        skins = {};
    }
}

function getHead(player) {
    const data = skins[player] || skins[player.toLowerCase()];
    if (!data) {
        return `https://mc-heads.net/avatar/${encodeURIComponent(player)}/16`;
    }

    try {
        const decoded = JSON.parse(atob(data.value));
        const texture = decoded.textures.SKIN.url.split("/").pop();

        return `https://mc-heads.net/head/${texture}/16`;
    } catch {
        return `https://mc-heads.net/avatar/${encodeURIComponent(player)}/16`;
    }
}
function updateContent() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    renderAlamChatBtn();
    updateServerStatus();
}
function toggleLanguage() {
    currentLang = currentLang === "ar" ? "en" : "ar";
    localStorage.setItem("lang", currentLang);
    updateContent();
}
function copyIP() {
    navigator.clipboard.writeText("amc.falix.gg");
    if (toast) {
        toast.textContent = translations[currentLang].toastMsg;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }
}

window.addEventListener("scroll", () => {
    const progress = document.getElementById("scroll-progress");
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? window.scrollY / max * 100 : 0;
    progress.style.width = percent + "%";
});

window.addEventListener("load", async () => {
    await loadSkins();
    updateContent();
    setInterval(updateServerStatus, 5000);
});

document.getElementById("startServer").onclick = async () => {
    const status = document.getElementById("status");

    try {
        const r = await fetch("https://hidden-wind-cca1.eldinalam91.workers.dev/", { method: "POST" });
        const data = await r.json();

        if (r.ok) {
            status.textContent = "✅ تم إرسال طلب تشغيل السيرفر";
            return;
        }

        if (data.error?.code === "ad_required") {
            status.textContent = "😁 لا نستفيد من أي إعلان ظهر لك";
            window.open(data.error.action_url, "_blank");
            return;
        }

        status.textContent = data.error?.message || "حدث خطأ";

    } catch {
        status.textContent = "❌ تعذر الاتصال بالخادم";
    }
};
