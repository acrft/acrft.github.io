firebase.initializeApp({
apiKey:"AIzaSyCMkymWe_AEfY9X09UC-jnCN85zfCLU2h0",
authDomain:"alamchat1.firebaseapp.com",
databaseURL:"https://alamchat1-default-rtdb.firebaseio.com"
});
const auth=firebase.auth();
const db=firebase.database();
const loginEl=document.getElementById("login");
const chatEl=document.getElementById("chat");
const loginBtn=document.getElementById("loginBtn");
const logoutBtn=document.getElementById("logoutBtn");
const sendBtn=document.getElementById("sendBtn");
const imageBtn=document.getElementById("imageBtn");
const siteBtn=document.getElementById("siteBtn");
const imageInput=document.getElementById("imageInput");
const msgInput=document.getElementById("msgInput");
const messagesEl=document.getElementById("messages");
const userInfo=document.getElementById("userInfo");
const chatRef=db.ref("chat");
const chatQuery=chatRef.limitToLast(100);
const DEFAULT_PHOTO="https://i.imgur.com/HeIi0wU.png";
let currentUser=null;
let loadingMessages=false;
let messagesListener=null;
let loginBusy=false;
let redirectChecked=false;
function showLoginError(err){
console.error("AlamChat Auth:",err);
const errors={
"auth/unauthorized-domain":"الدومين غير مسموح به في Firebase. أضف acrft.github.io إلى Authorized domains.",
"auth/operation-not-allowed":"سجّل الدخول باستخدام Google من Firebase Console أولًا.",
"auth/network-request-failed":"تحقق من اتصال الإنترنت وحاول مرة أخرى.",
"auth/too-many-requests":"محاولات كثيرة. انتظر قليلًا ثم حاول مجددًا.",
"auth/popup-blocked":"المتصفح منع تسجيل الدخول. اسمح بالنوافذ المنبثقة أو استخدم إعادة المحاولة.",
"auth/account-exists-with-different-credential":"هذا البريد مرتبط بطريقة تسجيل دخول أخرى.",
"auth/web-storage-unsupported":"المتصفح يمنع التخزين المطلوب لتسجيل الدخول. فعّل ملفات تعريف الارتباط وجرب مجددًا."
};
alert(errors[err.code]||"تعذر تسجيل الدخول. تحقق من الإنترنت وإعدادات Firebase ثم حاول مرة أخرى.");
}
function setLoginLoading(loading){
loginBusy=loading;
if(loginBtn){
loginBtn.disabled=loading;
loginBtn.classList.toggle("loading",loading);
loginBtn.setAttribute("aria-busy",String(loading));
loginBtn.textContent=loading?"جارٍ تسجيل الدخول...":"تسجيل الدخول باستخدام Google";
}
}
loginBtn?.addEventListener("click",async()=>{
if(loginBusy||currentUser)return;
setLoginLoading(true);
try{
await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
const provider=new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({prompt:"select_account"});
provider.addScope("email");
await auth.signInWithRedirect(provider);
}catch(err){
setLoginLoading(false);
showLoginError(err);
}
});
async function initAuth(){
try{
await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
if(!redirectChecked){
redirectChecked=true;
try{
await auth.getRedirectResult();
}catch(err){
showLoginError(err);
}
}
auth.onAuthStateChanged(user=>{
currentUser=user||null;
setLoginLoading(false);
if(user){
loginEl.style.display="none";
chatEl.style.display="block";
renderUserInfo();
loadMessages();
loadMobs();
}else{
loginEl.style.display="flex";
chatEl.style.display="none";
stopMessages();
messagesEl.innerHTML="";
loadingMessages=false;
}
},err=>{
setLoginLoading(false);
showLoginError(err);
});
}catch(err){
setLoginLoading(false);
showLoginError(err);
}
}
function renderUserInfo(){
if(!userInfo)return;
userInfo.innerHTML=`
<img src="https://image2url.com/r2/default/images/1775529228138-e4aa7777-4540-4bd6-9d5e-d9bdd7095990.png" alt="AlamChat">
<div>
<div class="user-name">💬☘️AlamChat</div>
<div id="mobList" class="mob-list"></div>
</div>`;
}
function escapeHTML(text){
return String(text).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}
async function send(){
const text=msgInput.value.trim();
if(!text||!currentUser||sendBtn.disabled)return;
sendBtn.disabled=true;
try{
await chatRef.push({
uid:currentUser.uid,
name:currentUser.displayName||"بدون اسم",
photo:currentUser.photoURL||DEFAULT_PHOTO,
text,
time:Date.now()
});
msgInput.value="";
}catch(err){
console.error(err);
alert("تعذر إرسال الرسالة. تحقق من اتصال الإنترنت.");
}finally{
sendBtn.disabled=false;
msgInput.focus();
}
}
sendBtn?.addEventListener("click",send);
msgInput?.addEventListener("keydown",e=>{
if(e.key==="Enter"&&!e.shiftKey){
e.preventDefault();
send();
}
});
imageBtn?.addEventListener("click",()=>{
if(currentUser)imageInput.click();
});
imageInput?.addEventListener("change",async()=>{
const file=imageInput.files?.[0];
if(!file)return;
try{
if(!currentUser)throw new Error("سجّل الدخول أولًا.");
if(!file.type.startsWith("image/"))throw new Error("اختر ملف صورة صالحًا.");
if(file.size>2*1024*1024)throw new Error("حجم الصورة يجب ألا يتجاوز 2 ميجابايت.");
const reader=new FileReader();
reader.onerror=()=>alert("تعذر قراءة الصورة.");
reader.onload=async()=>{
try{
if(!currentUser)return;
await chatRef.push({
uid:currentUser.uid,
name:currentUser.displayName||"بدون اسم",
photo:currentUser.photoURL||DEFAULT_PHOTO,
image:reader.result,
imageName:file.name,
imageType:file.type,
time:Date.now()
});
}catch(err){
console.error(err);
alert("تعذر إرسال الصورة.");
}
};
reader.readAsDataURL(file);
}catch(err){
alert(err.message||"تعذر إرسال الصورة.");
}finally{
imageInput.value="";
}
});
function scrollChat(){
requestAnimationFrame(()=>{
messagesEl.scrollTop=messagesEl.scrollHeight;
});
}
function stopMessages(){
if(messagesListener){
chatQuery.off("child_added",messagesListener);
messagesListener=null;
}
loadingMessages=false;
}
function loadMessages(){
if(loadingMessages||!currentUser)return;
loadingMessages=true;
messagesEl.innerHTML="";
messagesListener=snap=>{
if(!currentUser)return;
const m=snap.val();
if(!m||!m.uid)return;
const div=document.createElement("div");
div.className="msg "+(m.uid===currentUser.uid?"me":"other");
const safeName=escapeHTML(m.name||"بدون اسم");
const safeText=escapeHTML((m.text||"").trim()).replace(/\n/g,"<br>");
const safePhoto=escapeHTML(m.photo||DEFAULT_PHOTO);
const safeImageName=escapeHTML(m.imageName||"image");
div.innerHTML=`
<img class="avatar" loading="lazy" src="${safePhoto}" alt="" onerror="this.onerror=null;this.src='${DEFAULT_PHOTO}'">
<div class="bubble">
<div class="name">${safeName}</div>
${safeText}
${m.image&&typeof m.image==="string"&&m.image.startsWith("data:image/")?`
<div class="image-wrap">
<img class="message-image" loading="lazy" src="${m.image}" alt="${safeImageName}">
<div class="image-name">${safeImageName}</div>
</div>`:""}
</div>`;
const image=div.querySelector(".message-image");
if(image)image.addEventListener("load",scrollChat);
messagesEl.appendChild(div);
scrollChat();
};
chatQuery.on("child_added",messagesListener,err=>{
console.error(err);
alert("تعذر تحميل الرسائل. تحقق من صلاحيات قاعدة البيانات.");
});
}
function loadMobs(){
const mobs=[
{emoji:"🧟",name:"Zombie"},
{emoji:"💣",name:"Creeper"},
{emoji:"🕷️",name:"Spider"},
{emoji:"💀",name:"Skeleton"},
{emoji:"🔥",name:"Blaze"},
{emoji:"🐷",name:"Piglin"},
{emoji:"👁️",name:"Enderman"},
{emoji:"🐉",name:"Dragon"},
{emoji:"🐺",name:"Wolf"},
{emoji:"🐱",name:"Cat"},
{emoji:"🐝",name:"Bee"},
{emoji:"🐼",name:"Panda"}
];
const container=document.getElementById("mobList");
if(!container)return;
container.replaceChildren();
let selected;
try{
const saved=sessionStorage.getItem("savedMobs");
selected=saved?JSON.parse(saved):null;
}catch{
selected=null;
}
if(!Array.isArray(selected)||selected.length!==3||!selected.every(m=>mobs.some(x=>x.name===m.name))){
selected=[...mobs].sort(()=>Math.random()-.5).slice(0,3);
try{sessionStorage.setItem("savedMobs",JSON.stringify(selected));}catch{}
}
selected.forEach(mob=>{
const div=document.createElement("div");
div.className="mob";
div.textContent=mob.emoji+" "+mob.name;
container.appendChild(div);
});
}
logoutBtn?.addEventListener("click",async()=>{
if(logoutBtn.disabled)return;
logoutBtn.disabled=true;
try{
await auth.signOut();
}catch(err){
console.error(err);
alert("تعذر تسجيل الخروج. حاول مرة أخرى.");
}finally{
logoutBtn.disabled=false;
}
});
siteBtn?.addEventListener("click",()=>{
window.location.href="https://acrft.github.io/";
});
initAuth();
