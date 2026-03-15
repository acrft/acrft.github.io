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
    rule1: "1️⃣ ممنوع السب أو الإهانة",
    rule2: "2️⃣ ممنوع محتوى +18",
    rule3: "3️⃣ ممنوع التنمر",
    rule4: "4️⃣ ممنوع إثارة المشاكل",
    rule5: "5️⃣ ممنوع السبام",
    rule6: "6️⃣ ممنوع نشر معلومات مضللة",
    rule7: "7️⃣ ممنوع استغلال الصلاحيات",
    rule8: "8️⃣ ممنوع طلب أدمن",
    rule9: "9️⃣ ممنوع الترويج لسيرفرات أخرى",
    rule10: "🔟 ممنوع السياسة",
    adminsTitle: "👑 المشرفين",
    adminsNames: "علم جيمر ☘️، سراج 🦊، سنو 👑❄️",
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
    rule1: "1️⃣ No swearing or insults",
    rule2: "2️⃣ No +18 content",
    rule3: "3️⃣ No bullying",
    rule4: "4️⃣ No causing trouble",
    rule5: "5️⃣ No spamming",
    rule6: "6️⃣ No spreading misinformation",
    rule7: "7️⃣ No abuse of power",
    rule8: "8️⃣ Don't ask for Admin",
    rule9: "9️⃣ No promoting other servers",
    rule10: "🔟 No politics",
    adminsTitle: "👑 Staff",
    adminsNames: "Alam Gamer ☘️, Seraj 🦊, Snow 👑❄️",
    linksTitle: "🔗 Server Links",
    whatsapp: "WhatsApp Group",
    telegram: "Telegram Group",
    messenger: "Messenger Group",
    discord: "Discord Server",
    copyright: "© 2026 AlamCraft Server - All Rights Reserved",
    toastMsg: "✔ Server IP Copied!"
  }
};

let currentLang = localStorage.getItem('lang') || 'ar';

function updateContent() {
  // 1. ترجمة كل العناصر التي تحتوي على data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[currentLang][key]) {
      // إذا كان العنصر زر أو رابط أو نص عادي
      if (element.tagName === 'A' || element.tagName === 'BUTTON' || element.tagName === 'P' || element.tagName === 'LI' || element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'SPAN') {
        element.innerText = translations[currentLang][key];
      }
    }
  });

  // 2. تحديث اتجاه الصفحة (RTL/LTR)
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

  // 3. تحديث رسالة الـ Toast (تغيير نص العنصر المخفي)
  document.getElementById('toast').innerText = translations[currentLang].toastMsg;
}

// تبديل اللغة عند الضغط على الزر
document.querySelector('.langBtn').addEventListener('click', () => {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('lang', currentLang);
  updateContent();
});

// تشغيل الترجمة عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', updateContent);




