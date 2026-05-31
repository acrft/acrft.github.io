const translations={ar:{title:"سيرفر علَم كرافت ☘️",copyBtn:"نسخ الـ IP:PORT ",javaVersion:"☕️ جافا:",bedrockVersion:"🛏️ بيدروك:",addBedrock:"إضافة السيرفر إلى ماينكرافت البيدروك",rulesTitle:"📜 القوانين",linksTitle:"🔗 روابط السيرفر",adminsTitle:"👑 المشرفين",adminsNames:"علَم جيمر ☘️، الثعلب المفقود 🦊، ملك الجليد 👑❄️",copyright:"© 2026 AlamCraft Server - جميع الحقوق محفوظة",toastMsg:"✔ تم نسخ IP:PORT السيرفر بنجاح",serverOnline:"السيرفر متصل",serverOffline:"السيرفر مغلق",playersOnline:"اللاعبين المتصلين:",loading:"جاري التحقق...",modsTitle:"المودات/الإضافات",downloadCenterBtn:"مركز التحميل"},en:{title:"AlamCraft Server ☘️",copyBtn:"Copy IP:PORT",javaVersion:"☕️ Java:",bedrockVersion:"🛏️ Bedrock:",addBedrock:"Add Server to Minecraft Bedrock",rulesTitle:"📜 Server Rules",linksTitle:"🔗 Server Links",adminsTitle:"👑 Staff",adminsNames:"AlamGamer ☘️,LostFox 🦊,KingSnow 👑❄️",copyright:"© 2026 AlamCraft Server-All Rights Reserved",toastMsg:"✔ Server IP:PORT Copied!",serverOnline:"Server Online",serverOffline:"Server Offline",playersOnline:"Players Online:",loading:"Checking status...",modsTitle:"Mods/Plugins",downloadCenterBtn:"Download Center"}};

let currentLang=localStorage.getItem("lang")||"ar";

const $=s=>document.querySelector(s);

const statusIndicator=$("#status-indicator");
const statusText=$("#status-text");
const playerNum=$("#player-num");
const maxPlayers=$("#max-players");
const pingValue=$("#ping-value");
const modsListContainer=$("#mods-list-container");
const toast=$("#toast");
const sideMenu=$("#sideMenu");
const menuOverlay=$("#menuOverlay");
const modeBtn=$("#modeBtn");
const socialLinks=$(".social-links");

function renderAlamChatBtn(){
if(!socialLinks)return;

const old=document.querySelector(".alamchat-btn");

if(old)old.remove();

const a=document.createElement("a");
a.href="https://acrft.github.io/achat";
a.className="social-item alamchat-btn";
a.target="_blank";
a.rel="noopener noreferrer";

const img=document.createElement("img");
img.src="images/achat.png";
img.className="link-icon";

const span=document.createElement("span");
span.textContent=currentLang==="ar"?"منصة علم شات":"Alam Chat Platform";

a.append(img,span);

socialLinks.prepend(a);
}

function toggleMenu(){
sideMenu?.classList.toggle("active");
menuOverlay?.classList.toggle("active");
}

function setOfflineUI(){

if(statusIndicator){
statusIndicator.className="status-dot dot-offline";
}

if(statusText){
statusText.innerText=translations[currentLang].serverOffline+" ❌";
}

if(playerNum)playerNum.innerText="0";
if(maxPlayers)maxPlayers.innerText="0";

if(pingValue){
pingValue.innerText="--";
pingValue.style.color="inherit";
}

}

async function updateServerStatus(){

try{

const start=performance.now();

const res=await fetch(`https://api.mcsrvstat.us/2/alameldin.aternos.me:28303?t=${Date.now()}`);

if(!res.ok)throw new Error();

const data=await res.json();

const ping=Math.round(
performance.now()-start
);

if(!data.online){

setOfflineUI();

return;

}

if(statusIndicator){
statusIndicator.className="status-dot dot-online";
}

statusText.innerText=
translations[currentLang].serverOnline+" ✅";

playerNum.innerText=
data.players?.online||0;

maxPlayers.innerText=
data.players?.max||0;

if(pingValue){

pingValue.innerText=ping;

pingValue.style.color=
ping<150?"#22c55e":
ping<300?"#f59e0b":
"#ef4444";

}

}catch{

setOfflineUI();

}

}

function updateContent(){

document
.querySelectorAll("[data-i18n]")
.forEach(el=>{

const k=el.dataset.i18n;

if(
translations[currentLang][k]
){

el.innerText=
translations[currentLang][k];

}

});

document.documentElement.lang=
currentLang;

document.documentElement.dir=
currentLang==="ar"?
"rtl":
"ltr";

renderAlamChatBtn();

updateServerStatus();

}

function toggleLanguage(){

currentLang=
currentLang==="ar"?
"en":
"ar";

localStorage.setItem(
"lang",
currentLang
);

updateContent();

}

function copyIP(){

navigator.clipboard.writeText(
"Alameldin.aternos.me:28303"
);

if(toast){

toast.innerText=
translations[currentLang].toastMsg;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove(
"show"
);

},3000);

}

}

if(modeBtn){

modeBtn.onclick=()=>{

document.body.classList.toggle(
"light-theme"
);

const light=
document.body.classList.contains(
"light-theme"
);

modeBtn.innerText=
light?"☀️":"🌙";

localStorage.setItem(
"theme",
light?"light":"dark"
);

};

}

window.addEventListener(
"load",
()=>{

if(
localStorage.getItem("theme")
==="light"
){

document.body.classList.add(
"light-theme"
);

if(modeBtn){
modeBtn.innerText="☀️";
}

}

updateContent();

setInterval(
updateServerStatus,
30000
);

}
);
