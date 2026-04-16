const translations = {
    ar: {
        title: "سيرفر علم كرافت ☘️",
        copyBtn: "📋 نسخ IP",
        javaVersion: "☕️ جافا:",
        bedrockVersion: "🛏️ بيدروك:",
        addBedrock: "إضافة السيرفر في Minecraft Bedrock",
        rulesTitle: "📜 القوانين",
        rule1: "1️⃣ ممنوع السب أو الإهانة بجميع أشكالها 🤬",
        rule2: "2️⃣ ممنوع أي محتوى +18 بجميع أنواعه 🔞",
        rule3: "3️⃣ ممنوع التنمّر أو التقليل من الآخرين 🐅",
        rule4: "4️⃣ ممنوع الخناقات أو إثارة المشاكل 🤼‍♂️",
        rule5: "5️⃣ ممنوع السبام أو الإزعاج المتكرر 📢",
        rule6: "6️⃣ ممنوع الكذب أو نشر معلومات مضللة 😵",
        rule7: "7️⃣ ممنوع التسلّط أو استغلال الصلاحيات 👀",
        rule8: "8️⃣ ممنوع طلب أدمن أو صلاحيات 🦸‍♂️",
        rule9: "9️⃣ ممنوع الترويج لسيرفرات أو روابط خارجية بدون إذن الإدارة 📢",
        rule10: "🔟 ممنوع الكلام في السياسة أو المواضيع الحساسة 👨‍⚖️",
        rule11: "1️⃣1️⃣ ممنوع الإزعاج بالمكالمات المتكررة 📵",
        rule12: "1️⃣2️⃣ الالتزام باحترام الإدارة والأعضاء 🤝",
        rule13: "1️⃣3️⃣ قوانين الأدمن هي نفس قوانين الأعضاء 👑",
        rule14: "1️⃣4️⃣ للإدارة الحق في اتخاذ القرار المناسب في الحالات غير المذكورة ⚖️",
        rule15: "1️⃣5️⃣ نظام العقوبات:",
        punishSystem: "إنذار 🟩 ⬅️ إنذار 🟨 ⬅️ طرد🟥 ",
        linksTitle: "🔗 روابط السيرفر",
        whatsapp: "مجموعة الواتساب",
        telegram: "مجموعة التليجرام",
        messenger: "مجموعة الماسينجر",
        discord: "سيرفر الديسكورد",
        adminsTitle: "👑 المشرفين",
        adminsNames: "علم جيمر ☘️، سراج 🦊، سنو 👑❄️",
        copyright: "© 2026 AlamCraft Server - جميع الحقوق محفوظة",
        toastMsg: "✔ تم نسخ IP السيرفر",
        feature4: "✅ إدارة نشطة",
        feature1: "✅ يدعم Java و Bedrock",
        feature2: "✅ قوانين واضحة وعادلة",
        feature3: "✅ تحديثات مستمرة",
        serverOnline: "السيرفر متصل",
        serverOffline: "السيرفر مغلق",
        playersOnline: "اللاعبين المتصلين:",
        loading: "جاري التحقق..."
    },
    en: {
        title: "AlamCraft Server ☘️",
        copyBtn: "📋 Copy IP",
        javaVersion: "☕️ Java:",
        bedrockVersion: "🛏️ Bedrock:",
        addBedrock: "Add Server to Minecraft Bedrock",
        rulesTitle: "📜 Server Rules",
        rule1: "1️⃣ No swearing or insults in any form 🤬",
        rule2: "2️⃣ No +18 content of any kind 🔞",
        rule3: "3️⃣ No bullying or belittling others 🐅",
        rule4: "4️⃣ No fighting or causing trouble 🤼‍♂️",
        rule5: "5️⃣ No spamming or repeated annoyance 📢",
        rule6: "6️⃣ No lying or spreading misinformation 😵",
        rule7: "7️⃣ No bossiness or abuse of power 👀",
        rule8: "8️⃣ Don't ask for Admin or permissions 🦸‍♂️",
        rule9: "9️⃣ No promoting other servers or links without permission 📢",
        rule10: "🔟 No talking about politics or sensitive topics 👨‍⚖️",
        rule11: "1️⃣1️⃣ No constant annoying calls 📵",
        rule12: "1️⃣2️⃣ Respect staff and members 🤝",
        rule13: "1️⃣3️⃣ Admin rules are the same as member rules 👑",
        rule14: "1️⃣4️⃣ Staff reserved the right to decide in unlisted cases ⚖️",
        rule15: "1️⃣5️⃣ Punishment System:",
        punishSystem: "Warning 🟩 ➡️ Warning 🟨 ➡️ Kick 🟥",
        linksTitle: "🔗 Server Links",
        whatsapp: "WhatsApp Group",
        telegram: "Telegram Group",
        messenger: "Messenger Group",
        discord: "Discord Server",
        adminsTitle: "👑 Staff",
        adminsNames: "Alam Gamer ☘️, Seraj 🦊, Snow 👑❄️",
        copyright: "© 2026 AlamCraft Server - All Rights Reserved",
        toastMsg: "✔ Server IP Copied!",
        feature1: "✅ Supports Java & Bedrock",
        feature2: "✅ Clear and fair rules",
        feature3: "✅ Constant updates",
        feature4: "✅ Active Staff",
        serverOnline: "Server Online",
        serverOffline: "Server Offline",
        playersOnline: "Players Online:",
        loading: "Checking status..."
    }
};

async function updateServerStatus() {
    const statusDot = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    const playerNum = document.getElementById('player-num');
    const maxPlayers = document.getElementById('max-players');
    const pingDisplay = document.getElementById('ping-value'); // Bring ping back

    const serverIP = "alameldin.aternos.me";

    // 1. Start the ping timer
    const startTime = performance.now();

    try {
        async function updateServerStatus() {
            const statusDot = document.getElementById('status-indicator');
            const statusText = document.getElementById('status-text');
            const playerNum = document.getElementById('player-num');
            const maxPlayers = document.getElementById('max-players');
            const pingDisplay = document.getElementById('ping-value'); // Bring ping back

            const serverIP = "Alameldin.aternos.me";

            // 1. Start the ping timer
            const startTime = performance.now();

            try {
                const response = await fetch(`https://api.mcsrvstat.us/2/${serverIP}:28303?t=${Date.now()}`);
                const data = await response.json();

                // 2. Stop the timer and calculate ms
                const endTime = performance.now();
                const pingMs = Math.round(endTime - startTime);

                // 3. The Strict Aternos Check
                const versionText = data.version ? data.version : "";
                const isActuallyOnline = data.online === true &&
                    !versionText.includes("Offline") &&
                    !versionText.includes("●");

                if (isActuallyOnline) {
                    // Server is definitely UP
                    statusDot.className = "status-dot dot-online";
                    statusText.innerText = translations[currentLang].serverOnline + " ✅";

                    if (playerNum) playerNum.innerText = data.players ? data.players.online : "0";
                    if (maxPlayers) maxPlayers.innerText = data.players ? data.players.max : "0";

                    // Show the ping and color code it
                    if (pingDisplay) {
                        pingDisplay.innerText = pingMs;
                        // Green if fast, orange if okay, red if lagging
                        pingDisplay.style.color = pingMs < 150 ? "#22c55e" : (pingMs < 300 ? "#f59e0b" : "#ef4444");
                    }

                } else {
                    // Server is DOWN
                    statusDot.className = "status-dot dot-offline";
                    statusText.innerText = translations[currentLang].serverOffline + " ❌";

                    if (playerNum) playerNum.innerText = "0";
                    if (maxPlayers) maxPlayers.innerText = "0";

                    // Hide/reset the ping since they can't connect anyway
                    if (pingDisplay) {
                        pingDisplay.innerText = "--";
                        pingDisplay.style.color = "inherit";
                    }
                }
            } catch (error) {
                console.error("Status Update Error:", error);
                if (pingDisplay) pingDisplay.innerText = "??";
            }
        }
        const data = await response.json();

        // 2. Stop the timer and calculate ms
        const endTime = performance.now();
        const pingMs = Math.round(endTime - startTime);

        // 3. The Strict Aternos Check
        const versionText = data.version ? data.version : "";
        const isActuallyOnline = data.online === true &&
            !versionText.includes("Offline") &&
            !versionText.includes("●");

        if (isActuallyOnline) {
            // Server is definitely UP
            statusDot.className = "status-dot dot-online";
            statusText.innerText = translations[currentLang].serverOnline + " ✅";

            if (playerNum) playerNum.innerText = data.players ? data.players.online : "0";
            if (maxPlayers) maxPlayers.innerText = data.players ? data.players.max : "0";

            // Show the ping and color code it
            if (pingDisplay) {
                pingDisplay.innerText = pingMs;
                // Green if fast, orange if okay, red if lagging
                pingDisplay.style.color = pingMs < 150 ? "#22c55e" : (pingMs < 300 ? "#f59e0b" : "#ef4444");
            }

        } else {
            // Server is DOWN
            statusDot.className = "status-dot dot-offline";
            statusText.innerText = translations[currentLang].serverOffline + " ❌";

            if (playerNum) playerNum.innerText = "0";
            if (maxPlayers) maxPlayers.innerText = "0";

            // Hide/reset the ping since they can't connect anyway
            if (pingDisplay) {
                pingDisplay.innerText = "--";
                pingDisplay.style.color = "inherit";
            }
        }
    } catch (error) {
        console.error("Status Update Error:", error);
        if (pingDisplay) pingDisplay.innerText = "??";
    }
}
let currentLang = localStorage.getItem('lang') || 'ar';

function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    updateServerStatus();
}

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', currentLang);
    updateContent();
}

function copyIP() {
    const ip = "Alameldin.aternos.me:28303";
    navigator.clipboard.writeText(ip).then(() => {
        const t = document.getElementById("toast");
        t.classList.add("show");
        setTimeout(() => t.classList.remove("show"), 3000);
    });
}

window.onload = updateContent;
const modeBtn = document.getElementById('modeBtn');
modeBtn.onclick = () => {
    // This adds/removes 'light-theme' to the <body> tag
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    modeBtn.innerText = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
};

// Apply saved theme immediately on load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    if (modeBtn) modeBtn.innerText = '☀️';
}

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("scroll-progress").style.width = scrolled + "%";
});





