"use strict";
/* AlamChat v2 — Firebase Compat 8.10.1 */
firebase.initializeApp({
  apiKey: "AIzaSyCMkymWe_AEfY9X09UC-jnCN85zfCLU2h0",
  authDomain: "alamchat1.firebaseapp.com",
  databaseURL: "https://alamchat1-default-rtdb.firebaseio.com"
});
const auth = firebase.auth(), db = firebase.database(), $ = id => document.getElementById(id);
const WORKER = "https://still-frost-fc39.eldinalam91.workers.dev";
const NOAV = "https://i.imgur.com/HeIi0wU.png";
const LOGO = "https://acrft.github.io/images/achat.png";
const TS = firebase.database.ServerValue.TIMESTAMP;

let me = null, prof = null, peer = null, cur = null, msgRef = null, listRef = null, phone = "";
const cache = {};

function toast(t) {
  const e = $("toast"); e.textContent = t; e.classList.add("show");
  clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove("show"), 3500);
}
function show(id) { ["login", "plink", "setup", "app"].forEach(s => $(s).hidden = s !== id); }
async function api(path, body) {
  const r = await fetch(WORKER + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || "حدث خطأ");
  return d;
}
function shrink(file, max, q) {
  return new Promise((res, rej) => {
    if (!file || !file.type.startsWith("image/")) return rej(new Error("اختر صورة صالحة"));
    const img = new Image(), url = URL.createObjectURL(file);
    img.onerror = () => rej(new Error("صورة غير مدعومة"));
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement("canvas");
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg", q));
    };
    img.src = url;
  });
}
const cid = (a, b) => [a, b].sort().join("_");
async function getUser(uid) {
  if (!cache[uid]) { const s = await db.ref("users/" + uid).once("value"); cache[uid] = { uid, ...(s.val() || { name: "مستخدم" }) }; }
  return cache[uid];
}
const fmt = t => t ? new Date(t).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }) : "";

/* ---------- تسجيل الدخول ---------- */
async function social(provider) {
  try { await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); await auth.signInWithPopup(provider); }
  catch (e) { if (!/popup-closed|cancelled/.test(e.code || "")) toast(e.message || "فشل الدخول"); }
}
$("googleBtn").onclick = () => social(new firebase.auth.GoogleAuthProvider());
$("githubBtn").onclick = () => social(new firebase.auth.GithubAuthProvider());
$("phoneBtn").onclick = async () => {
  phone = $("phoneIn").value.replace(/\D/g, "");
  if (phone.length < 8) return toast("اكتب رقمك مع كود الدولة");
  try { const d = await api("/otp/start", { phone }); window.open(d.link, "_blank"); $("codeBox").hidden = false; }
  catch (e) { toast(e.message); }
};
$("codeBtn").onclick = async () => {
  try {
    const d = await api("/otp/verify", { phone, code: $("codeIn").value.trim() });
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    await auth.signInWithCustomToken(d.token);
  } catch (e) { toast(e.message); }
};
$("suOut").onclick = $("pOut").onclick = () => auth.signOut();

/* ---------- إنشاء الحساب ---------- */
$("suBtn").onclick = async () => {
  const u = $("suUser").value.trim().toLowerCase().replace(/^@/, "");
  if (!/^[a-z0-9_]{3,20}$/.test(u)) return toast("اليوزر 3-20 حرف: إنجليزي وأرقام و _");
  const name = $("suName").value.trim() || me.displayName || u;
  try {
    const r = await db.ref("usernames/" + u).transaction(v => v === null ? me.uid : undefined);
    if (!r.committed) return toast("اليوزر مستخدم، جرّب غيره");
    await db.ref("users/" + me.uid).set({ name, username: u, photo: me.photoURL || "", bio: "" });
    boot();
  } catch (e) { toast(e.message); }
};

auth.onAuthStateChanged(user => {
  me = user; stopAll();
  if (!user) return show("login");
  boot();
});
async function boot() {
  const pn = await db.ref("userPhone/" + me.uid).once("value");
  if (!pn.exists()) return show("plink");
  const s = await db.ref("users/" + me.uid).once("value");
  if (!s.exists()) { $("suName").value = me.displayName || ""; return show("setup"); }
  prof = s.val(); cache[me.uid] = { uid: me.uid, ...prof };
  $("meAv").src = prof.photo || NOAV;
  show("app"); watchList();
}
function stopAll() {
  if (msgRef) msgRef.off(); if (listRef) listRef.off();
  msgRef = listRef = null; cur = peer = null;
  $("room").hidden = true; $("empty").hidden = false; $("chatList").replaceChildren();
}

/* ---------- قائمة المحادثات ---------- */
function watchList() {
  listRef = db.ref("userChats/" + me.uid);
  listRef.on("value", async s => {
    const items = []; s.forEach(c => { items.push({ id: c.key, ...c.val() }); });
    items.sort((a, b) => b.time - a.time);
    const users = await Promise.all(items.map(i => getUser(i.with)));
    const box = $("chatList"); box.replaceChildren();
    const g = document.createElement("div"); g.className = "row" + (cur === "__global" ? " on" : "");
    const ga = document.createElement("img"); ga.className = "av"; ga.src = LOGO;
    const gt = document.createElement("div"); gt.className = "t";
    const gn = document.createElement("b"); gn.textContent = "🌍 الشات العام";
    const gl = document.createElement("div"); gl.className = "l"; gl.textContent = "📌 مجموعة مثبتة للجميع";
    gt.append(gn, gl); g.append(ga, gt); g.onclick = () => openChat("__global"); box.append(g);
    items.forEach((i, n) => {
      const u = users[n], row = document.createElement("div");
      row.className = "row" + (i.id === cur ? " on" : "");
      const av = document.createElement("img"); av.className = "av"; av.src = u.photo || NOAV;
      const t = document.createElement("div"); t.className = "t";
      const nm = document.createElement("b"); nm.textContent = u.name;
      const l = document.createElement("div"); l.className = "l"; l.textContent = i.last || "";
      const tm = document.createElement("small"); tm.className = "muted"; tm.textContent = fmt(i.time);
      t.append(nm, l); row.append(av, t, tm);
      row.onclick = () => openChat(u.uid);
      box.append(row);
    });
  });
}
$("findIn").addEventListener("keydown", async e => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  const q = e.target.value.trim().toLowerCase().replace(/^@/, "");
  if (!q) return;
  const isP = /^\+?\d{8,15}$/.test(q);
  const s = await db.ref(isP ? "phones/" + q.replace(/\D/g, "") : "usernames/" + q).once("value");
  if (!s.exists()) return toast("مفيش مستخدم بالاسم ده");
  if (s.val() === me.uid) return toast("ده حسابك 😄");
  e.target.value = ""; openChat(s.val());
});

/* ---------- المحادثة ---------- */
async function openChat(uid) {
  const G = uid === "__global";
  peer = G ? { uid: "__global", name: "🌍 الشات العام", photo: LOGO, global: true } : await getUser(uid);
  cur = G ? "__global" : cid(me.uid, uid);
  $("empty").hidden = true; $("room").hidden = false; $("app").classList.add("open");
  $("peerName").textContent = peer.name; $("peerUser").textContent = G ? "مجموعة عامة" : (peer.username ? "@" + peer.username : "");
  $("peerAv").src = peer.photo || NOAV;
  if (msgRef) msgRef.off();
  const box = $("msgs"); box.replaceChildren();
  msgRef = (G ? db.ref("chat") : db.ref("chats/" + cur + "/messages")).limitToLast(100);
  msgRef.on("child_added", s => {
    const m = s.val(); if (!m || !m.uid) return;
    const d = document.createElement("div"); d.className = "m " + (m.uid === me.uid ? "me" : "");
    if (G && m.uid !== me.uid) { const n = document.createElement("b"); n.textContent = m.name || "بدون اسم"; n.style.cssText = "display:block;color:var(--p);font-size:.8rem"; d.append(n); }
    if (typeof m.image === "string" && m.image.startsWith("data:image/")) {
      const im = document.createElement("img"); im.src = m.image; im.loading = "lazy";
      im.onload = () => box.scrollTop = box.scrollHeight; d.append(im);
    }
    if (m.text) d.append(document.createTextNode(String(m.text).slice(0, 500)));
    const tm = document.createElement("i"); tm.textContent = fmt(m.time); d.append(tm);
    box.append(d); box.scrollTop = box.scrollHeight;
  });
}
$("backBtn").onclick = () => $("app").classList.remove("open");
async function push(m) {
  if (!cur || !peer) return;
  if (peer.global) return db.ref("chat").push({ uid: me.uid, name: prof.name, photo: prof.photo || "", ...m, time: TS });
  const up = {}, last = m.text || "📷 صورة", id = db.ref().push().key;
  up["chats/" + cur + "/messages/" + id] = { uid: me.uid, ...m, time: TS };
  up["userChats/" + me.uid + "/" + cur] = { with: peer.uid, last, time: TS };
  up["userChats/" + peer.uid + "/" + cur] = { with: me.uid, last, time: TS };
  await db.ref().update(up);
}
$("form").onsubmit = async e => {
  e.preventDefault();
  const text = $("msgIn").value.trim(); if (!text) return;
  $("msgIn").value = "";
  try { await push({ text: text.slice(0, 500) }); } catch (er) { toast("تعذر الإرسال"); }
};
$("imgBtn").onclick = () => $("imgIn").click();
$("imgIn").onchange = async e => {
  const f = e.target.files[0]; e.target.value = ""; if (!f) return;
  try { await push({ image: await shrink(f, 1000, .7) }); } catch (er) { toast(er.message || "تعذر إرسال الصورة"); }
};

/* ---------- البروفايل ---------- */
let newPhoto = null;
$("profBtn").onclick = () => {
  newPhoto = null; $("pAv").src = prof.photo || NOAV; $("pName").value = prof.name;
  $("pBio").value = prof.bio || ""; $("pUser").textContent = "@" + prof.username; $("modal").hidden = false;
};
$("pClose").onclick = () => $("modal").hidden = true;
$("pPhoto").onclick = () => $("pPhotoIn").click();
$("pPhotoIn").onchange = async e => {
  try { newPhoto = await shrink(e.target.files[0], 192, .8); $("pAv").src = newPhoto; } catch (er) { toast(er.message); }
};
$("pSave").onclick = async () => {
  const up = { name: $("pName").value.trim() || prof.name, bio: $("pBio").value.trim() };
  if (newPhoto) up.photo = newPhoto;
  try {
    await db.ref("users/" + me.uid).update(up);
    prof = { ...prof, ...up }; cache[me.uid] = { uid: me.uid, ...prof };
    $("meAv").src = prof.photo || NOAV; $("modal").hidden = true; toast("تم الحفظ ✅");
  } catch (e) { toast("تعذر الحفظ"); }
};

/* ---------- ربط رقم الهاتف ---------- */
let lp = "";
$("plBtn").onclick = async () => {
  lp = $("plPhone").value.replace(/\D/g, "");
  if (lp.length < 8) return toast("اكتب رقمك مع كود الدولة");
  try { const d = await api("/otp/start", { phone: lp }); window.open(d.link, "_blank"); $("plBox").hidden = false; }
  catch (e) { toast(e.message); }
};
$("plCodeBtn").onclick = async () => {
  try { await api("/otp/link", { phone: lp, code: $("plCode").value.trim(), idToken: await me.getIdToken() }); boot(); }
  catch (e) { toast(e.message); }
};
$("plOut").onclick = () => auth.signOut();
