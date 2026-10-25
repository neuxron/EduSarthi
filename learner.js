import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = { apiKey: "AIzaSyBpNYDoUDPfXOv3bDP2GaMCrXIJkcPJNkg", authDomain: "edusarthi-learning.firebaseapp.com", databaseURL: "https://edusarthi-learning-default-rtdb.asia-southeast1.firebasedatabase.app", projectId: "edusarthi-learning", storageBucket: "edusarthi-learning.appspot.com", messagingSenderId: "704725435719", appId: "1:704725435719:web:af72c8acff2f7913e57862" };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const uid = localStorage.getItem("learnerUID");
if (!uid) location.href = "index.html";

async function load() {
  const snap = await get(child(ref(db), `learners/${uid}`));
  if (snap.exists()) {
    const data = snap.val();
    document.getElementById("learnerName").innerText = data.name;
    document.getElementById("learnerClass").innerText = `Class ${data.class} • ${data.school}`;
    const subjects = data.subjects || [];
    const grid = document.getElementById("subjectsGrid");
    grid.innerHTML = subjects.map(s => `<div class="subject-card">📘 ${s}</div>`).join('');
    document.getElementById("recent").innerHTML = '<li>✅ Completed Maths assignment</li><li>📘 Downloaded Science notes</li>';
  }
}
load();
window.logoutLearner = () => { localStorage.clear(); location.href = "index.html"; };s