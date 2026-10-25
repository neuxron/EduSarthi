import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
  child
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBpNYDoUDPfXOv3bDP2GaMCrXIJkcPJNkg",
  authDomain: "edusarthi-learning.firebaseapp.com",
  databaseURL: "https://edusarthi-learning-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "edusarthi-learning",
  storageBucket: "edusarthi-learning.appspot.com",
  messagingSenderId: "704725435719",
  appId: "1:704725435719:web:af72c8acff2f7913e57862"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const provider = new GoogleAuthProvider();

// ========== GLOBAL VARIABLES ==========
let learnerRecaptchaVerifier = null;
let learnerConfirmationResult = null;

// ========== CHECK IF LEARNER EXISTS IN DB ==========
async function checkLearnerExists(uid) {
  const dbRef = ref(database);
  const snapshot = await get(child(dbRef, `learners/${uid}`));
  return snapshot.exists();
}

// ========== SHOW BIODATA FORM ==========
function showLearnerBiodataForm() {
  const modal = document.getElementById("learnerAuthModal");
  const loginPanel = document.getElementById("learnerLoginPanel");
  const biodataPanel = document.getElementById("learnerBiodataPanel");
  if (loginPanel) loginPanel.style.display = "none";
  if (biodataPanel) biodataPanel.style.display = "block";
  if (modal) modal.style.display = "flex";

  // Pre-fill from temp storage
  const tempName = localStorage.getItem("tempLearnerName") || "";
  const tempEmail = localStorage.getItem("tempLearnerEmail") || "";
  const tempPhone = localStorage.getItem("tempLearnerPhone") || "";
  if (document.getElementById("biodataName")) document.getElementById("biodataName").value = tempName;
  if (document.getElementById("biodataEmail")) document.getElementById("biodataEmail").value = tempEmail;
  if (document.getElementById("biodataPhone")) document.getElementById("biodataPhone").value = tempPhone.replace("+91", "");
}

// ========== SAVE LEARNER BIODATA TO FIREBASE ==========
window.saveLearnerBiodata = async function() {
  const name = document.getElementById("biodataName").value.trim();
  const school = document.getElementById("biodataSchool").value.trim();
  const classVal = document.getElementById("biodataClass").value;
  const village = document.getElementById("biodataVillage").value.trim();
  const phone = document.getElementById("biodataPhone").value.trim();
  const email = document.getElementById("biodataEmail").value.trim();
  const parentPhone = document.getElementById("biodataParentPhone").value.trim();

  if (!name || !school || !classVal || !village || !phone) {
    alert("Please fill all required fields (*)");
    return;
  }

  const uid = localStorage.getItem("tempLearnerUID");
  if (!uid) {
    alert("Session expired. Please login again.");
    return;
  }

  try {
    await set(ref(database, `learners/${uid}`), {
      name: name,
      school: school,
      class: classVal,
      village: village,
      phone: phone,
      email: email,
      parentPhone: parentPhone,
      createdAt: Date.now()
    });
    localStorage.setItem("learnerName", name);
    localStorage.setItem("learnerUID", uid);
    localStorage.removeItem("tempLearnerUID");
    localStorage.removeItem("tempLearnerEmail");
    localStorage.removeItem("tempLearnerName");
    localStorage.removeItem("tempLearnerPhone");
    alert("Profile created successfully!");
    window.location.href = "learner.html";
  } catch (error) {
    alert("Error saving data: " + error.message);
  }
};

// ========== LEARNER GOOGLE LOGIN (UPDATED) ==========
window.learnerGoogleLogin = async function() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const exists = await checkLearnerExists(user.uid);
    if (exists) {
      localStorage.setItem("learnerName", user.displayName || "Student");
      localStorage.setItem("learnerUID", user.uid);
      window.location.href = "learner.html";
    } else {
      localStorage.setItem("tempLearnerUID", user.uid);
      localStorage.setItem("tempLearnerEmail", user.email || "");
      localStorage.setItem("tempLearnerName", user.displayName || "");
      showLearnerBiodataForm();
    }
  } catch (error) {
    alert("Google Sign-In Error: " + error.message);
  }
};

// ========== LEARNER RECAPTCHA INIT ==========
window.initLearnerRecaptcha = function() {
  const container = document.getElementById("learner-recaptcha");
  if (container && !learnerRecaptchaVerifier) {
    learnerRecaptchaVerifier = new RecaptchaVerifier(auth, 'learner-recaptcha', { size: 'normal' });
  }
};

// ========== SEND OTP (UPDATED) ==========
window.sendLearnerOTP = async function() {
  const phone = document.getElementById("learnerPhone").value.trim();
  if (phone.length < 10) {
    alert("Enter valid 10-digit mobile number");
    return;
  }
  if (!learnerRecaptchaVerifier) {
    window.initLearnerRecaptcha();
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  const fullPhone = "+91" + phone;
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, fullPhone, learnerRecaptchaVerifier);
    learnerConfirmationResult = confirmationResult;
    alert("OTP sent successfully!");
  } catch (error) {
    alert("Failed to send OTP: " + error.message);
    learnerRecaptchaVerifier = null;
  }
};

// ========== VERIFY OTP (UPDATED) ==========
window.verifyLearnerOTP = async function() {
  const otp = document.getElementById("learnerOTP").value.trim();
  if (otp.length !== 6) {
    alert("Enter 6-digit OTP");
    return;
  }
  try {
    const result = await learnerConfirmationResult.confirm(otp);
    const user = result.user;
    const exists = await checkLearnerExists(user.uid);
    if (exists) {
      localStorage.setItem("learnerName", "Student");
      localStorage.setItem("learnerUID", user.uid);
      window.location.href = "learner.html";
    } else {
      localStorage.setItem("tempLearnerUID", user.uid);
      localStorage.setItem("tempLearnerPhone", user.phoneNumber || "");
      showLearnerBiodataForm();
    }
  } catch (error) {
    alert("Invalid OTP. Try again.");
  }
};

// ========== MODAL PANEL SWITCH FUNCTIONS ==========
window.showLearnerLogin = function() {
  const loginPanel = document.getElementById("learnerLoginPanel");
  const biodataPanel = document.getElementById("learnerBiodataPanel");
  if (loginPanel) loginPanel.style.display = "block";
  if (biodataPanel) biodataPanel.style.display = "none";
};

window.openLearnerSignup = function() {
  showLearnerBiodataForm();
};

// ========== EXISTING CODE (UNCHANGED FROM HERE) ==========
window.googleLogin = async function() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    localStorage.setItem("teacherName", user.displayName);
    alert("Welcome " + user.displayName);
    document.getElementById("authModal").style.display = "none";
    window.location.href = "teacher.html";
  } catch (error) {
    alert(error.message);
  }
};

window.sendOTP = function() {
  const phone = document.getElementById("phone").value;
  if (phone.length < 10) {
    alert("Enter Valid Phone Number");
    return;
  }
  alert("Testing OTP is: 123456");
};

window.verifyOTP = function() {
  const otp = document.getElementById("otp").value;
  if (otp === "123456") {
    localStorage.setItem("teacherName", "Teacher User");
    alert("Login Successful");
    document.getElementById("authModal").style.display = "none";
    window.location.href = "teacher.html";
  } else {
    alert("Wrong OTP");
  }
};

const authModal = document.getElementById("authModal");
const loginBtn = document.querySelector(".login-btn");
const signupBtn = document.querySelector(".signup-btn");
const closeAuth = document.getElementById("closeAuth");

loginBtn.addEventListener("click", () => { authModal.style.display = "flex"; });
signupBtn.addEventListener("click", () => { authModal.style.display = "flex"; });
closeAuth.addEventListener("click", () => { authModal.style.display = "none"; });
window.addEventListener("click", (e) => { if (e.target === authModal) authModal.style.display = "none"; });

const teacherModal = document.getElementById("teacherAuthModal");
document.querySelectorAll(".role-main-btn")[1].addEventListener("click", () => { teacherModal.style.display = "flex"; });
document.getElementById("closeTeacherAuth").addEventListener("click", () => { teacherModal.style.display = "none"; });

window.openSignup = function() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("signupSection").style.display = "block";
};
window.openLogin = function() {
  document.getElementById("signupSection").style.display = "none";
  document.getElementById("loginSection").style.display = "block";
};

window.teacherGoogleLogin = async function() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    localStorage.setItem("teacherName", user.displayName);
    alert("Welcome " + user.displayName);
    window.location.href = "teacher.html";
  } catch (error) {
    alert(error.message);
  }
};

window.createTeacherAccount = function() {
  const name = document.getElementById("teacherName").value;
  const school = document.getElementById("teacherSchool").value;
  const subject = document.getElementById("teacherSubject").value;
  const experience = document.getElementById("teacherExperience").value;
  const email = document.getElementById("teacherEmail").value;
  if (!name || !school || !subject || !experience || !email) {
    alert("Please Fill All Fields");
    return;
  }
  const teacherId = Date.now();
  set(ref(database, 'teachers/' + teacherId), { name, school, subject, experience, email })
    .then(() => {
      localStorage.setItem("teacherName", name);
      alert("Teacher Account Created Successfully");
      window.location.href = "teacher.html";
    })
    .catch((error) => { alert(error.message); });
};

// Learner Modal Open/Close (existing)
const learnerModal = document.getElementById("learnerAuthModal");
document.querySelectorAll(".role-main-btn")[0].addEventListener("click", () => { learnerModal.style.display = "flex"; });
document.getElementById("closeLearnerAuth").addEventListener("click", () => {
  learnerModal.style.display = "none";
  // Reset panels
  document.getElementById("learnerLoginPanel").style.display = "block";
  document.getElementById("learnerBiodataPanel").style.display = "none";
  if (learnerRecaptchaVerifier) {
    learnerRecaptchaVerifier.clear();
    learnerRecaptchaVerifier = null;
  }
});

// Teacher OTP Mock
window.sendTeacherOTP = function() {
  const phone = document.getElementById("teacherPhone").value.trim();
  if (phone.length < 10) {
    alert("Enter valid 10-digit mobile number");
    return;
  }
  alert("Testing OTP is: 123456");
};
window.verifyTeacherOTP = function() {
  const otp = document.getElementById("teacherOTP").value.trim();
  if (otp === "123456") {
    localStorage.setItem("teacherName", "Teacher");
    alert("Login successful!");
    document.getElementById("teacherAuthModal").style.display = "none";
    window.location.href = "teacher.html";
  } else {
    alert("Wrong OTP");
  }
};
// ===== ADD THIS AT THE END OF app.js =====

// Update subjects based on selected class
window.updateSubjectsByClass = function() {
  const classVal = document.getElementById('biodataClass').value;
  const container = document.getElementById('subjectsCheckboxes');
  if (!container) return;
  const subjectMap = {
    '6': ['Mathematics', 'Science', 'Social Studies', 'English', 'Hindi', 'Sanskrit'],
    '7': ['Mathematics', 'Science', 'Social Studies', 'English', 'Hindi', 'Sanskrit'],
    '8': ['Mathematics', 'Science', 'Social Studies', 'English', 'Hindi', 'Sanskrit'],
    '9': ['Mathematics', 'Science (Phy, Chem, Bio)', 'Social Science', 'English', 'Hindi', 'IT'],
    '10': ['Mathematics', 'Science (Phy, Chem, Bio)', 'Social Science', 'English', 'Hindi', 'IT'],
    '11': ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'CS'],
    '12': ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'CS']
  };
  const subjects = subjectMap[classVal] || [];
  container.innerHTML = subjects.map(s => `<label><input type="checkbox" value="${s}"> ${s}</label>`).join('');
};

// Updated saveLearnerBiodata (includes DOB and subjects)
window.saveLearnerBiodata = async function() {
  const name = document.getElementById('biodataName').value.trim();
  const school = document.getElementById('biodataSchool').value.trim();
  const classVal = document.getElementById('biodataClass').value;
  const dob = document.getElementById('biodataDOB').value;
  const village = document.getElementById('biodataVillage').value.trim();
  const phone = document.getElementById('biodataPhone').value.trim();
  const email = document.getElementById('biodataEmail').value.trim();
  const parentPhone = document.getElementById('biodataParentPhone').value.trim();
  const selected = [];
  document.querySelectorAll('#subjectsCheckboxes input:checked').forEach(cb => selected.push(cb.value));

  if (!name || !school || !classVal || !village || !phone || !dob || selected.length === 0) {
    alert('Please fill all required fields and select at least one subject');
    return;
  }
  const uid = localStorage.getItem('tempLearnerUID');
  if (!uid) { alert('Session expired. Login again.'); return; }
  try {
    await set(ref(database, `learners/${uid}`), {
      name, school, class: classVal, dob, subjects: selected,
      village, phone, email, parentPhone, createdAt: Date.now()
    });
    localStorage.setItem('learnerName', name);
    localStorage.setItem('learnerUID', uid);
    localStorage.setItem('learnerClass', classVal);
    localStorage.setItem('learnerSubjects', JSON.stringify(selected));
    localStorage.removeItem('tempLearnerUID');
    localStorage.removeItem('tempLearnerEmail');
    localStorage.removeItem('tempLearnerName');
    localStorage.removeItem('tempLearnerPhone');
    alert('Profile created!');
    window.location.href = 'learner.html';
  } catch(e) { alert('Error: ' + e.message); }
};

// Ensure showLearnerBiodataForm resets subjects
window.showLearnerBiodataForm = function() {
  document.getElementById('learnerLoginPanel').style.display = 'none';
  document.getElementById('learnerBiodataPanel').style.display = 'block';
  document.getElementById('learnerAuthModal').style.display = 'flex';
  const subjectsDiv = document.getElementById('subjectsCheckboxes');
  if (subjectsDiv) subjectsDiv.innerHTML = '';
  const name = localStorage.getItem('tempLearnerName') || '';
  const email = localStorage.getItem('tempLearnerEmail') || '';
  const phone = localStorage.getItem('tempLearnerPhone') || '';
  if (document.getElementById('biodataName')) document.getElementById('biodataName').value = name;
  if (document.getElementById('biodataEmail')) document.getElementById('biodataEmail').value = email;
  if (document.getElementById('biodataPhone')) document.getElementById('biodataPhone').value = phone.replace('+91','');
};
