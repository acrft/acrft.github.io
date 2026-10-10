firebase.initializeApp({apiKey:"AIzaSyCMkymWe_AEfY9X09UC-jnCN85zfCLU2h0",authDomain:"alamchat1.firebaseapp.com",databaseURL:"https://alamchat1-default-rtdb.firebaseio.com"});
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
let currentUser;
let loadingMessages=false;
const chatRef=db.ref("chat");
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(console.error);
loginBtn.onclick=async()=>{
loginBtn.classList.add("loading");
const provider=new firebase.auth.GoogleAuthProvider();
try{
await auth.signInWithPopup(provider);
}catch(err){
console.log(err);
if(err.code==="auth/popup-blocked"||err.code==="auth/popup-closed-by-user"||err.code==="auth/cancelled-popup-request"){
auth.signInWithRedirect(provider);
}else{
alert(err.message);
}
}
loginBtn.classList.remove("loading");
};
auth.onAuthStateChanged(user=>{
if(user){
currentUser=user;
loginEl.style.display="none";
chatEl.style.display="block";
userInfo.innerHTML=`
<img src="https://image2url.com/r2/default/images/1775529228138-e4aa7777-4540-4bd6-9d5e-d9bdd7095990.png">

<div>
<div class="user-name">💬☘️AlamChat</div>
<div id="mobList" class="mob-list"></div>
</div>
`;
loadMessages();
loadMobs();
}else{
currentUser=null;
loginEl.style.display="flex";
chatEl.style.display="none";
}
});
sendBtn.onclick=send;
imageBtn.onclick=()=>{imageInput.click()};
siteBtn.onclick=()=>{window.open("https://acrft.github.io")};
msgInput.addEventListener("keydown",e=>{
if(e.key==="Enter"){
e.preventDefault();
send();
}
});
function escapeHTML(text){
return String(text).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}
function send(){
const text=msgInput.value.trim();
if(!text||!currentUser)return;
sendBtn.disabled=true;
chatRef.push({
uid:currentUser.uid,
name:currentUser.displayName||"بدون اسم",
photo:currentUser.photoURL||"https://i.imgur.com/HeIi0wU.png",
text:text,
time:Date.now()
}).then(()=>{
msgInput.value="";
}).catch(console.error).finally(()=>{
sendBtn.disabled=false;
});
}
imageInput.addEventListener("change",()=>{
const file=imageInput.files[0];
if(!file||!currentUser)return;
if(file.size>2*1024*1024){
alert("الصورة كبيرة جدًا");
imageInput.value="";
return;
}
const reader=new FileReader();
reader.onload=e=>{
chatRef.push({
uid:currentUser.uid,
name:currentUser.displayName||"بدون اسم",
photo:currentUser.photoURL||"https://i.imgur.com/HeIi0wU.png",
image:e.target.result,
imageName:file.name,
imageType:file.type,
time:Date.now()
}).catch(console.error);
};
reader.readAsDataURL(file);
imageInput.value="";
});
function scrollChat(){
requestAnimationFrame(()=>{
messagesEl.scrollTop=messagesEl.scrollHeight-messagesEl.clientHeight;
});
}
function loadMessages(){
if(loadingMessages)return;
loadingMessages=true;
chatRef.off();
messagesEl.innerHTML="";
chatRef.limitToLast(100).on("child_added",snap=>{
if(!currentUser)return;
const m=snap.val();
const div=document.createElement("div");
div.className="msg "+(m.uid===currentUser.uid?"me":"other");
const safeName=escapeHTML(m.name||"بدون اسم");
const safeText=escapeHTML((m.text||"").trim());
const safePhoto=escapeHTML(m.photo||"https://i.imgur.com/HeIi0wU.png");
const safeImageName=escapeHTML(m.imageName||"image");
div.innerHTML=`
<img class="avatar" loading="lazy" src="${safePhoto}" onerror="this.onerror=null;this.src='https://i.imgur.com/HeIi0wU.png'">
<div class="bubble">
<div class="name">${safeName}</div>
${safeText}
${m.image?`
<div class="image-wrap">
<img class="message-image" src="${m.image}" alt="${safeImageName}" onload="scrollChat()">
<div class="image-name">${safeImageName}</div>
</div>
`:""}
</div>
`;
messagesEl.appendChild(div);
scrollChat();
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
container.innerHTML="";
let saved=sessionStorage.getItem("savedMobs");
let selected;
try{
selected=saved?JSON.parse(saved):null;
}catch{
selected=null;
}
if(!selected||!Array.isArray(selected)){
const shuffled=[...mobs].sort(()=>Math.random()-.5);
selected=shuffled.slice(0,3);
sessionStorage.setItem("savedMobs",JSON.stringify(selected));
}
selected.forEach(mob=>{
const div=document.createElement("div");
div.className="mob";
div.textContent=mob.emoji+" "+mob.name;
container.appendChild(div);
});
}
logoutBtn.onclick=async()=>{
logoutBtn.disabled=true;
try{
await auth.signOut();
messagesEl.innerHTML="";
}catch(err){
console.log(err);
}
logoutBtn.disabled=false;
};
