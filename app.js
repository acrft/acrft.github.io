function copyIP() {
  navigator.clipboard.writeText('Alameldin.aternos.me:28303');
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}
const modeBtn = document.getElementById('modeBtn');
const body = document.body;
const savedMode = localStorage.getItem('mode');
if (savedMode === 'dark') {
  body.classList.add('dark-mode');
}
if (!savedMode) {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.classList.add('dark-mode');
  }
}
modeBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('mode', 'dark');
  } else {
    localStorage.setItem('mode', 'light');
  }
});

document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});

document.addEventListener('keydown', function (e) {
  if (e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's')) {
    e.preventDefault();
  }
  if (e.key === 'F12') {
    e.preventDefault();
  }
});

const translations = {
  ar: {
    title: "سيرفر علم كرافت ☘️",
    copyBtn: "📋 نسخ IP:PORT السيرفر",
    javaVersion: "☕️ إصدار الجافا: ",
    bedrockVersion: "🛏️ إصدار البيدروك: ",
    addBedrock: "إضافة السيرفر في Minecraft Bedrock",
    featuresTitle: "⭐ مميزات السيرفر",
    feature1: "✅ يدعم Java و Bedrock",
    feature2: "✅ قوانين واضحة وعادلة",
    feature3: "✅ تحديثات مستمرة",
    feature4: "✅ إدارة نشطة",
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
    punishSystem: "إنذار🟩 ⬅️ إنذار🟨 ⬅️ طرد🟥",
    adminsTitle: "👑 المشرفين",
    adminsNames: " علم جيمر ☘️، سراج 🦊، سنو 👑❄️, محمد ميستيكلاد 💻, زيروكس ❎, محمد جيمر اكس 🎮",
    linksTitle: "🔗 روابط السيرفر",
    whatsapp: "مجموعة الواتساب",
    telegram: "مجموعة التليجرام",
    messenger: "مجموعة الماسينجر",
    discord: "سيرفر الديسكورد",
    copyright: "© 2026 AlamCraft Server - جميع الحقوق محفوظة",
    toastMsg: "✔ تم نسخ IP السيرفر"
  },
  en: {
    title: "AlamCraft Server ☘️",
    copyBtn: "📋 Copy Server IP:PORT",
    javaVersion: "☕️ Java Edition: ",
    bedrockVersion: "🛏️ Bedrock Edition: ",
    addBedrock: "Add Server to Minecraft Bedrock",
    featuresTitle: "⭐ Server Features",
    feature1: "✅ Supports Java & Bedrock",
    feature2: "✅ Clear and fair rules",
    feature3: "✅ Constant updates",
    feature4: "✅ Active staff",
    rulesTitle: "📜 Rules",
    rule1: "1️⃣ No swearing or insults in any form 🤬",
    rule2: "2️⃣ No +18 content of any kind 🔞",
    rule3: "3️⃣ No bullying or belittling others 🐅",
    rule4: "4️⃣ No fighting or causing trouble 🤼‍♂️",
    rule5: "5️⃣ No spamming or repeated annoyance 📢",
    rule6: "6️⃣ No lying or spreading misinformation 😵",
    rule7: "7️⃣ No bossiness or abuse of power 👀",
    rule8: "8️⃣ Don't ask for Admin or permissions 🦸‍♂️",
    rule9: "9️⃣ No promoting other servers or external links without staff permission 📢",
    rule10: "🔟 No talking about politics or sensitive topics 👨‍⚖️",
    rule11: "1️⃣1️⃣ No constant annoying calls 📵",
    rule12: "1️⃣2️⃣ Respect staff and members 🤝",
    rule13: "1️⃣3️⃣ Admin rules are the same as member rules 👑",
    rule14: "1️⃣4️⃣ Staff reserved the right to decide in unlisted cases ⚖️",
    rule15: "1️⃣5️⃣ Punishment System:",
    punishSystem: "🟥Warning🟩 ➡️ Warning🟨 ➡️ Kick",
    adminsTitle: "👑 Staff",
    // Keeping names and emojis in the specific order you prefer
    adminsNames: "🎮 Alam Gamer ☘️, Lost_fox 🦊, Snow 👑❄️, Mysticlad 💻, Zerox ❎, Mohammed Gamer X",
    linksTitle: "🔗 Server Links",
    whatsapp: "WhatsApp Group",
    telegram: "Telegram Group",
    messenger: "Messenger Group",
    discord: "Discord Server",
    copyright: "© 2026 AlamCraft Server - All Rights Reserved",
    toastMsg: "✔ Server IP Copied!"
  }
};

// Initialize language from storage or default to Arabic
let currentLang = localStorage.getItem('lang') || 'ar';

function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang][key]) {
      el.innerText = translations[currentLang][key];
    }
  });

  // This is the magic line that flips the text direction
  document.documentElement.dir = (currentLang === 'ar') ? 'rtl' : 'ltr';
  document.documentElement.lang = currentLang;

  // Optional: specifically force the rules container if it's acting stubborn
  const rulesList = document.querySelector('.rules-list');
  if (rulesList) {
    rulesList.style.textAlign = (currentLang === 'ar') ? 'right' : 'left';
  }
}

// Specifically handle the toast since it might be hidden
const toast = document.getElementById('toast');
if (toast) toast.innerText = translations[currentLang].toastMsg;

// Function to toggle language
function toggleLanguage() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('lang', currentLang);
  updateContent();
}

// Make sure the DOM is fully loaded before attaching events
document.addEventListener('DOMContentLoaded', () => {
  updateContent();

  const langBtn = document.querySelector('.langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', toggleLanguage);
    console.log("Language button listener attached successfully.");
  } else {
    console.error("Language button (.langBtn) not found in HTML!");
  }
});





