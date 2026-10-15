"use strict";

/* AlamChat PRO — Firebase Compat 8.10.1 */
const firebaseConfig={
apiKey:"AIzaSyCMkymWe_AEfY9X09UC-jnCN85zfCLU2h0",
authDomain:"alamchat1.firebaseapp.com",
databaseURL:"https://alamchat1-default-rtdb.firebaseio.com"
};

if(!firebase.apps.length)firebase.initializeApp(firebaseConfig);

const auth=firebase.auth();
const db=firebase.database();
const $=id=>document.getElementById(id);

const el={
login:$("login"),
chat:$("chat"),
loginBtn:$("loginBtn"),
logoutBtn:$("logoutBtn"),
sendBtn:$("sendBtn"),
imageBtn:$("imageBtn"),
siteBtn:$("siteBtn"),
imageInput:$("imageInput"),
msgInput:$("msgInput"),
messages:$("messages"),
userInfo:$("userInfo"),
form:$("messageForm")
};

const chatRef=db.ref("chat");
const chatQuery=chatRef.limitToLast(100);
const DEFAULT_PHOTO="https://i.imgur.com/HeIi0wU.png";
const LOGO_URL="https://image2url.com/r2/default/images/1775529228138-e4aa7777-4540-4bd6-9d5e-d9bdd7095990.png";

let currentUser=null;
let loginBusy=false;
let sending=false;
let uploading=false;
let authReady=false;
let messageListener=null;
let authUnsubscribe=null;
let messageGeneration=0;
const renderedMessages=new Set();

function notify(message){
alert(message);
}

function logError(action,error){
console.error("[AlamChat] "+action,error);
}

function errorMessage(error){
const messages={
"auth/unauthorized-domain":"الدومين غير مسموح به. أضف acrft.github.io إلى Authorized domains في Firebase.",
"auth/operation-not-allowed":"فعّل تسجيل الدخول باستخدام Google من Firebase Console.",
"auth/network-request-failed":"مشكلة في الإنترنت. حاول مرة أخرى.",
"auth/too-many-requests":"محاولات كثيرة. انتظر قليلًا ثم حاول مرة أخرى.",
"auth/popup-blocked":"المتصفح منع نافذة تسجيل الدخول.",
"auth/web-storage-unsupported":"التخزين المحلي غير متاح في المتصفح.",
"auth/invalid-credential":"بيانات تسجيل الدخول غير صالحة. حاول مجددًا.",
"PERMISSION_DENIED":"ليس لديك إذن لتنفيذ العملية. راجع Firebase Database Rules."
};
return messages[error?.code]||messages[error?.message]||"حدث خطأ غير متوقع. حاول مرة أخرى.";
}

function setBusy(button,busy,text){
if(!button)return;
button.disabled=busy;
button.classList.toggle("loading",busy);
button.setAttribute("aria-busy",String(busy));
if(text)button.textContent=busy?text:button.dataset.originalText||"";
}

if(el.loginBtn)el.loginBtn.dataset.originalText=el.loginBtn.textContent;

function setLoginBusy(busy){
loginBusy=busy;
if(!el.loginBtn)return;
el.loginBtn.disabled=busy;
el.loginBtn.classList.toggle("loading",busy);
el.loginBtn.setAttribute("aria-busy",String(busy));
el.loginBtn.textContent=busy?"جارٍ تسجيل الدخول...":"🔵 تسجيل الدخول باستخدام Google";
}

function setScreen(user){
currentUser=user||null;
if(currentUser){
el.login.style.display="none";
el.chat.style.display="block";
renderUserInfo();
loadMobs();
startMessages();
}else{
el.login.style.display="flex";
el.chat.style.display="none";
stopMessages();
el.messages.replaceChildren();
}
}

async function login(){
if(loginBusy||currentUser)return;
setLoginBusy(true);
try{
await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
const provider=new firebase.auth.GoogleAuthProvider();
provider.addScope("email");
provider.setCustomParameters({prompt:"select_account"});
const result=await auth.signInWithPopup(provider);
if(result.user)setScreen(result.user);
}catch(error){
logError("تسجيل الدخول",error);
if(error.code==="auth/popup-closed-by-user"||error.code==="auth/cancelled-popup-request")return;
notify(errorMessage(error));
}finally{
setLoginBusy(false);
}
}

function initAuth(){
if(authReady)return;
authReady=true;
authUnsubscribe=auth.onAuthStateChanged(user=>{
setLoginBusy(false);
setScreen(user);
},error=>{
setLoginBusy(false);
logError("حالة تسجيل الدخول",error);
notify(errorMessage(error));
});
auth.getRedirectResult().catch(error=>{
if(error.code!=="auth/no-auth-event"){
logError("نتيجة تسجيل الدخول",error);
notify(errorMessage(error));
}
});
}

function renderUserInfo(){
if(!el.userInfo)return;
el.userInfo.replaceChildren();

const logo=document.createElement("img");
logo.src=LOGO_URL;
logo.alt="AlamChat";
logo.loading="eager";

const details=document.createElement("div");
const title=document.createElement("div");
title.className="user-name";
title.textContent="💬☘️AlamChat";

const mobs=document.createElement("div");
mobs.className="mob-list";
mobs.id="mobList";

details.append(title,mobs);
el.userInfo.append(logo,details);
}

function escapeText(value){
return String(value??"");
}

function scrollChat(){
requestAnimationFrame(()=>{
if(el.messages)el.messages.scrollTop=el.messages.scrollHeight;
});
}

function createMessage(snapshot){
const message=snapshot.val();
if(!message||!message.uid)return null;

const div=document.createElement("div");
div.className="msg "+(message.uid===currentUser.uid?"me":"other");
div.dataset.messageId=snapshot.key;

const avatar=document.createElement("img");
avatar.className="avatar";
avatar.loading="lazy";
avatar.alt="";
avatar.src=message.photo||DEFAULT_PHOTO;
avatar.onerror=()=>{avatar.onerror=null;avatar.src=DEFAULT_PHOTO};

const bubble=document.createElement("div");
bubble.className="bubble";

const name=document.createElement("div");
name.className="name";
name.textContent=escapeText(message.name||"بدون اسم");
bubble.appendChild(name);

if(typeof message.text==="string"&&message.text.length){
const text=document.createElement("div");
text.className="message-text";
text.dir="auto";
text.style.whiteSpace="pre-wrap";
text.textContent=message.text.slice(0,500);
bubble.appendChild(text);
}

if(typeof message.image==="string"&&message.image.startsWith("data:image/")){
const wrap=document.createElement("div");
wrap.className="image-wrap";

const image=document.createElement("img");
image.className="message-image";
image.loading="lazy";
image.decoding="async";
image.alt=escapeText(message.imageName||"صورة");
image.src=message.image;
image.addEventListener("load",scrollChat,{once:true});

const imageName=document.createElement("div");
imageName.className="image-name";
imageName.textContent=escapeText(message.imageName||"صورة");

wrap.append(image,imageName);
bubble.appendChild(wrap);
}

div.append(avatar,bubble);
return div;
}

function startMessages(){
if(!currentUser||messageListener)return;
const generation=++messageGeneration;
renderedMessages.clear();
el.messages.replaceChildren();

messageListener=snapshot=>{
if(generation!==messageGeneration||!currentUser)return;
const id=snapshot.key;
if(!id||renderedMessages.has(id))return;
const node=createMessage(snapshot);
if(!node)return;
renderedMessages.add(id);
el.messages.appendChild(node);

while(el.messages.children.length>100){
const first=el.messages.firstElementChild;
if(first){
renderedMessages.delete(first.dataset.messageId);
first.remove();
}
}
scrollChat();
};

chatQuery.on("child_added",messageListener,error=>{
logError("تحميل الرسائل",error);
notify(errorMessage(error));
});
}

function stopMessages(){
messageGeneration++;
if(messageListener){
chatQuery.off("child_added",messageListener);
messageListener=null;
}
renderedMessages.clear();
}

async function send(){
const text=el.msgInput.value.trim();
if(!text||!currentUser||sending)return;

sending=true;
el.sendBtn.disabled=true;

try{
await chatRef.push({
uid:currentUser.uid,
name:currentUser.displayName||"بدون اسم",
photo:currentUser.photoURL||DEFAULT_PHOTO,
text:text.slice(0,500),
time:firebase.database.ServerValue.TIMESTAMP
});
el.msgInput.value="";
}catch(error){
logError("إرسال الرسالة",error);
notify(errorMessage(error));
}finally{
sending=false;
el.sendBtn.disabled=false;
}
}

/* ضغط الصورة قبل إرسالها */
function compressImage(file){
return new Promise((resolve,reject)=>{
if(!file.type.startsWith("image/")){
reject(new Error("اختر صورة صالحة."));
return;
}
const reader=new FileReader();
reader.onerror=()=>reject(new Error("تعذرت قراءة الصورة."));
reader.onload=()=>{
const img=new Image();
img.onerror=()=>reject(new Error("الصورة غير صالحة أو غير مدعومة."));
img.onload=()=>{
const maxSide=1280;
const scale=Math.min(1,maxSide/Math.max(img.width,img.height));
const canvas=document.createElement("canvas");
canvas.width=Math.max(1,Math.round(img.width*scale));
canvas.height=Math.max(1,Math.round(img.height*scale));
const ctx=canvas.getContext("2d");
if(!ctx){
reject(new Error("تعذر تجهيز الصورة."));
return;
}
ctx.drawImage(img,0,0,canvas.width,canvas.height);
try{
resolve({
data:canvas.toDataURL("image/jpeg",.78),
name:file.name.replace(/\.[^.]+$/,"")+".jpg",
type:"image/jpeg"
});
}catch(error){
reject(error);
}
};
img.src=reader.result;
};
reader.readAsDataURL(file);
});
}

async function uploadImage(file){
if(!currentUser||uploading)return;
if(file.size>8*1024*1024){
notify("حجم الصورة الأصلية كبير جدًا. اختر صورة أقل من 8 ميجابايت.");
return;
}
uploading=true;
el.imageBtn.disabled=true;
try{
const image=await compressImage(file);
if(!currentUser)return;
await chatRef.push({
uid:currentUser.uid,
name:currentUser.displayName||"بدون اسم",
photo:currentUser.photoURL||DEFAULT_PHOTO,
image:image.data,
imageName:image.name,
imageType:image.type,
time:firebase.database.ServerValue.TIMESTAMP
});
}catch(error){
logError("إرسال الصورة",error);
notify(error.message||errorMessage(error));
}finally{
uploading=false;
el.imageBtn.disabled=false;
el.imageInput.value="";
}
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
const container=$("mobList");
if(!container)return;
let selected;
try{
selected=JSON.parse(sessionStorage.getItem("savedMobs")||"null");
}catch{
selected=null;
}
if(!Array.isArray(selected)||selected.length!==3||!selected.every(m=>mobs.some(x=>x.name===m.name))){
selected=[...mobs].sort(()=>Math.random()-.5).slice(0,3);
try{sessionStorage.setItem("savedMobs",JSON.stringify(selected));}catch{}
}
container.replaceChildren();
selected.forEach(mob=>{
const chip=document.createElement("div");
chip.className="mob";
chip.textContent=mob.emoji+" "+mob.name;
container.appendChild(chip);
});
}

async function logout(){
if(!currentUser||el.logoutBtn.disabled)return;
el.logoutBtn.disabled=true;
try{
await auth.signOut();
}catch(error){
logError("تسجيل الخروج",error);
notify(errorMessage(error));
}finally{
el.logoutBtn.disabled=false;
}
}

/* ربط الأحداث مرة واحدة */
el.loginBtn.addEventListener("click",login);
el.logoutBtn.addEventListener("click",logout);
el.form.addEventListener("submit",event=>{
event.preventDefault();
send();
});
el.imageBtn.addEventListener("click",()=>{
if(currentUser&&!uploading)el.imageInput.click();
});
el.imageInput.addEventListener("change",()=>{
const file=el.imageInput.files?.[0];
if(file)uploadImage(file);
});
el.siteBtn.addEventListener("click",()=>{
window.location.href="https://acrft.github.io/";
});

initAuth();
