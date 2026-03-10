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

/* ============================
   SETTINGS
============================ */

const API_URL = 'https://libretranslate.de/translate';

let currentLang = localStorage.getItem('lang') || 'ar';
async function translateText(text, target) {
  if (!text.trim()) return text;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: target === 'ar' ? 'en' : 'ar',
        target: target,
        format: 'text',
      }),
    });

    const data = await res.json();

    return data.translatedText;
  } catch (e) {
    console.error('Translation error:', e);
    return text;
  }
}

function getTextNodes() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;

        if (node.parentNode.tagName === 'SCRIPT')
          return NodeFilter.FILTER_REJECT;
        if (node.parentNode.tagName === 'STYLE')
          return NodeFilter.FILTER_REJECT;

        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );

  const nodes = [];

  let node;

  while ((node = walker.nextNode())) {
    nodes.push(node);
  }

  return nodes;
}

async function translatePage(target) {
  const nodes = getTextNodes();

  for (const node of nodes) {
    const original = node.nodeValue;

    const translated = await translateText(original, target);

    node.nodeValue = translated;
  }

  document.documentElement.lang = target;
  document.documentElement.dir = target === 'ar' ? 'rtl' : 'ltr';

  localStorage.setItem('lang', target);
}

document.addEventListener('DOMContentLoaded', () => {
  const langBtn = document.querySelector(".langBtn");

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      currentLang = currentLang === 'ar' ? 'en' : 'ar';

      translatePage(currentLang);
    });
  }

  if (currentLang === 'ar') {
    translatePage('en');
  }
});
