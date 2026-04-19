// ======================== DATA ========================
const subjectsByClass = {
    6: ["Mathematics", "Science", "English"],
    7: ["Mathematics", "Science", "English", "Social Studies"],
    8: ["Mathematics", "Science", "English", "Social Studies"],
    9: ["Mathematics", "Science", "English", "Hindi"],
    10: ["Mathematics", "Science", "English", "Social Science"],
    11: ["Physics", "Chemistry", "Mathematics", "Biology"],
    12: ["Physics", "Chemistry", "Mathematics", "Biology"]
};

const chaptersData = {
    "Mathematics": [
        { name: "Algebra Basics", video: "videos/algebra.mp4", notes: "notes/algebra.pdf" },
        { name: "Geometry", video: "videos/geometry.mp4", notes: "notes/geometry.pdf" }
    ],
    "Science": [
        { name: "Cell Structure", video: "videos/cell.mp4", notes: "notes/cell.pdf" },
        { name: "Laws of Motion", video: "videos/motion.mp4", notes: "notes/motion.pdf" }
    ],
    "English": [
        { name: "Grammar", video: "videos/grammar.mp4", notes: "notes/grammar.pdf" }
    ]
};
const defaultChapters = [{ name: "Introduction", video: "videos/intro.mp4", notes: "notes/intro.pdf" }];
const languages = ["English", "Hindi", "Russian", "Chinese", "Spanish", "French"];
const langCodes = { English: "en", Hindi: "hi", Russian: "ru", Chinese: "zh", Spanish: "es", French: "fr" };
const quizData = {
    questions: [
        { text: "What is 7 × 8 ?", options: ["48", "56", "64", "72"], correct: 1 },
        { text: "Which planet is known as the Red Planet?", options: ["Mars", "Jupiter", "Venus", "Saturn"], correct: 0 },
        { text: "What is the square root of 144?", options: ["10", "11", "12", "13"], correct: 2 }
    ]
};

// ======================== TRANSLATIONS ========================
const translations = {
    en: {
        splashText: "Your Learning Companion",
        loginTitle: "Welcome to EduSarthi",
        loginSub: "Sign in to continue",
        namePlaceholder: "Full Name",
        phonePlaceholder: "Mobile Number",
        continueBtn: "Continue →",
        langTitle: "Choose Language",
        langSub: "Select your preferred language",
        nextBtn: "Next →",
        setupTitle: "Complete Your Profile",
        schoolPlaceholder: "School Name",
        subjectsLabel: "Select Subjects:",
        saveBtn: "Save & Start →",
        welcomePrefix: "Hello,",
        subjectsTab: "Subjects",
        progressTab: "Progress",
        progressTitle: "Learning Progress",
        quizHeader: "Quiz",
        settingsTitle: "Settings",
        resetBtn: "Reset All Data",
        cancelBtn: "Cancel",
        videoBtn: "Video",
        notesBtn: "Notes",
        markComplete: "Mark Completed",
        completed: "Completed",
        quizBtn: "Quiz",
        submit: "Submit",
        close: "Close",
        score: "Your score",
        open: "Open",
        chaptersCompleted: "chapters completed"
    },
    hi: {
        splashText: "आपका लर्निंग साथी",
        loginTitle: "एडुसारथी में आपका स्वागत है",
        loginSub: "जारी रखने के लिए साइन इन करें",
        namePlaceholder: "पूरा नाम",
        phonePlaceholder: "मोबाइल नंबर",
        continueBtn: "जारी रखें →",
        langTitle: "भाषा चुनें",
        langSub: "अपनी पसंदीदा भाषा चुनें",
        nextBtn: "अगला →",
        setupTitle: "अपनी प्रोफ़ाइल पूरी करें",
        schoolPlaceholder: "स्कूल का नाम",
        subjectsLabel: "विषय चुनें:",
        saveBtn: "सेव करें और शुरू करें →",
        welcomePrefix: "नमस्ते,",
        subjectsTab: "विषय",
        progressTab: "प्रगति",
        progressTitle: "सीखने की प्रगति",
        quizHeader: "प्रश्नोत्तरी",
        settingsTitle: "सेटिंग्स",
        resetBtn: "सभी डेटा रीसेट करें",
        cancelBtn: "रद्द करें",
        videoBtn: "वीडियो",
        notesBtn: "नोट्स",
        markComplete: "पूर्ण करें",
        completed: "पूर्ण",
        quizBtn: "क्विज़",
        submit: "जमा करें",
        close: "बंद करें",
        score: "आपका स्कोर",
        open: "खोलें",
        chaptersCompleted: "अध्याय पूरे हुए"
    }
};

let currentLang = "en";
let currentUser = null;
let currentSubject = null;
let quizState = { questions: null, index: 0, score: 0 };

// ======================== HELPER FUNCTIONS ========================
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function saveUser(data) { localStorage.setItem('edusarthi_user', JSON.stringify(data)); }
function getUser() { return JSON.parse(localStorage.getItem('edusarthi_user')); }
function saveProgress(prog) { localStorage.setItem('edusarthi_progress', JSON.stringify(prog)); }
function getProgress() { return JSON.parse(localStorage.getItem('edusarthi_progress')) || {}; }

function applyTranslations() {
    const t = translations[currentLang];
    document.getElementById('splashText') && (document.getElementById('splashText').innerText = t.splashText);
    document.getElementById('loginTitle') && (document.getElementById('loginTitle').innerText = t.loginTitle);
    document.getElementById('loginSub') && (document.getElementById('loginSub').innerText = t.loginSub);
    document.getElementById('studentName') && (document.getElementById('studentName').placeholder = t.namePlaceholder);
    document.getElementById('studentNumber') && (document.getElementById('studentNumber').placeholder = t.phonePlaceholder);
    document.getElementById('loginBtn') && (document.getElementById('loginBtn').innerHTML = t.continueBtn);
    document.getElementById('langTitle') && (document.getElementById('langTitle').innerText = t.langTitle);
    document.getElementById('langSub') && (document.getElementById('langSub').innerText = t.langSub);
    document.getElementById('langNext') && (document.getElementById('langNext').innerHTML = t.nextBtn);
    document.getElementById('setupTitle') && (document.getElementById('setupTitle').innerText = t.setupTitle);
    document.getElementById('schoolName') && (document.getElementById('schoolName').placeholder = t.schoolPlaceholder);
    document.getElementById('subjectsLabel') && (document.getElementById('subjectsLabel').innerText = t.subjectsLabel);
    document.getElementById('saveSetup') && (document.getElementById('saveSetup').innerHTML = t.saveBtn);
    document.getElementById('welcomePrefix') && (document.getElementById('welcomePrefix').innerText = t.welcomePrefix);
    document.getElementById('subjectsTabText') && (document.getElementById('subjectsTabText').innerText = t.subjectsTab);
    document.getElementById('progressTabText') && (document.getElementById('progressTabText').innerText = t.progressTab);
    document.getElementById('progressTitle') && (document.getElementById('progressTitle').innerText = t.progressTitle);
    document.getElementById('quizHeader') && (document.getElementById('quizHeader').innerText = t.quizHeader);
    document.getElementById('settingsTitle') && (document.getElementById('settingsTitle').innerText = t.settingsTitle);
    document.getElementById('resetApp') && (document.getElementById('resetApp').innerHTML = t.resetBtn);
    document.getElementById('closeSettings') && (document.getElementById('closeSettings').innerHTML = t.cancelBtn);
}

// ======================== SPLASH -> AUTO REDIRECT ========================
setTimeout(() => {
    const savedUser = getUser();
    if (savedUser) {
        currentLang = savedUser.lang || "en";
        currentUser = savedUser;
        applyTranslations();
        showScreen('dashboard');
        loadDashboard();
    } else {
        showScreen('login');
    }
}, 2000);

// ======================== LOGIN ========================
document.getElementById('loginBtn').onclick = () => {
    const name = document.getElementById('studentName').value.trim();
    const number = document.getElementById('studentNumber').value.trim();
    if (!name) {
        alert(currentLang === "hi" ? "कृपया अपना नाम दर्ज करें" : "Please enter your name");
        return;
    }
    localStorage.setItem('tempName', name);
    localStorage.setItem('tempNumber', number);
    showScreen('language');
};

// ======================== LANGUAGE SELECTION ========================
const langContainer = document.getElementById('langList');
languages.forEach(lang => {
    const div = document.createElement('div');
    div.className = 'lang-option';
    div.innerText = lang;
    div.onclick = () => {
        document.querySelectorAll('.lang-option').forEach(l => l.classList.remove('selected'));
        div.classList.add('selected');
        localStorage.setItem('selectedLang', lang);
    };
    langContainer.appendChild(div);
});

document.getElementById('langNext').onclick = () => {
    const selected = localStorage.getItem('selectedLang') || 'English';
    currentLang = langCodes[selected] || "en";
    localStorage.setItem('appLang', currentLang);
    applyTranslations();
    
    // Populate class dropdown
    const classSelect = document.getElementById('classSelect');
    classSelect.innerHTML = '';
    for (let i = 6; i <= 12; i++) {
        classSelect.innerHTML += `<option value="${i}">Class ${i}</option>`;
    }
    classSelect.onchange = () => renderSubjectList(parseInt(classSelect.value));
    renderSubjectList(6);
    showScreen('setup');
};

function renderSubjectList(className) {
    const subs = subjectsByClass[className] || subjectsByClass[6];
    const container = document.getElementById('subjectsList');
    container.innerHTML = '';
    subs.forEach(sub => {
        const label = document.createElement('label');
        label.className = 'subject-check';
        label.innerHTML = `<input type="checkbox" value="${sub}"> ${sub}`;
        container.appendChild(label);
    });
}

// ======================== SAVE SETUP ========================
document.getElementById('saveSetup').onclick = () => {
    const selected = [];
    document.querySelectorAll('#subjectsList input:checked').forEach(cb => selected.push(cb.value));
    if (selected.length === 0) {
        alert(currentLang === "hi" ? "कम से कम एक विषय चुनें" : "Select at least one subject");
        return;
    }
    const profile = {
        name: localStorage.getItem('tempName'),
        number: localStorage.getItem('tempNumber'),
        class: document.getElementById('classSelect').value,
        board: document.getElementById('boardSelect').value,
        school: document.getElementById('schoolName').value,
        subjects: selected,
        lang: currentLang
    };
    saveUser(profile);
    currentUser = profile;
    showScreen('dashboard');
    loadDashboard();
};

// ======================== DASHBOARD ========================
function loadDashboard() {
    document.getElementById('welcomeName').innerText = currentUser.name;
    const container = document.getElementById('subjectsContainer');
    container.innerHTML = '';
    currentUser.subjects.forEach(sub => {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.innerHTML = `
            <div class="subject-left">
                <i class="fas fa-book-open"></i>
                <span>${sub}</span>
            </div>
            <button class="open-subject" data-sub="${sub}">${translations[currentLang].open}</button>
        `;
        container.appendChild(card);
    });
    document.querySelectorAll('.open-subject').forEach(btn => {
        btn.onclick = () => openSubject(btn.getAttribute('data-sub'));
    });
    updateProgressUI();
}

function updateProgressUI() {
    const progress = getProgress();
    let totalChapters = 0;
    for (let s in chaptersData) totalChapters += chaptersData[s].length;
    const completed = Object.keys(progress).length;
    const percent = totalChapters ? (completed / totalChapters) * 100 : 0;
    const degree = (percent / 100) * 360;
    const radial = document.getElementById('radialProgress');
    if (radial) {
        radial.style.background = `conic-gradient(#2e7d5e ${degree}deg, #e2f0e5 ${degree}deg)`;
        radial.innerHTML = `<span>${Math.round(percent)}%</span>`;
    }
    const stats = document.getElementById('progressStats');
    if (stats) {
        const t = translations[currentLang];
        stats.innerHTML = `<p>${completed} ${t.chaptersCompleted} ${totalChapters}</p>
        <div style="background:#e2f0e5; border-radius:10px; height:6px; margin-top:10px;">
            <div style="width:${percent}%; background:#2e7d5e; height:6px; border-radius:10px;"></div>
        </div>`;
    }
}

// ======================== SUBJECT VIEW (CHAPTERS) ========================
function openSubject(subject) {
    currentSubject = subject;
    document.getElementById('subjectTitle').innerText = subject;
    const chapters = chaptersData[subject] || defaultChapters;
    const progress = getProgress();
    const container = document.getElementById('chaptersList');
    container.innerHTML = '';
    const t = translations[currentLang];
    chapters.forEach(ch => {
        const isCompleted = progress[`${subject}_${ch.name}`] || false;
        const card = document.createElement('div');
        card.className = 'chapter-card';
        card.innerHTML = `
            <div class="chapter-title">📘 ${ch.name}</div>
            <div class="chapter-actions">
                <button class="video-action" data-video="${ch.video}"><i class="fas fa-play-circle"></i> ${t.videoBtn}</button>
                <button class="notes-action" data-notes="${ch.notes}"><i class="fas fa-file-alt"></i> ${t.notesBtn}</button>
                <button class="complete-action ${isCompleted ? 'completed' : ''}" data-sub="${subject}" data-chap="${ch.name}">${isCompleted ? `✓ ${t.completed}` : t.markComplete}</button>
                <button class="quiz-action" data-sub="${subject}" data-chap="${ch.name}"><i class="fas fa-brain"></i> ${t.quizBtn}</button>
            </div>
        `;
        container.appendChild(card);
    });
    // Attach events
    document.querySelectorAll('.video-action').forEach(btn => {
        btn.onclick = () => alert(`📹 ${t.videoBtn}: ${btn.dataset.video}\n(Place .mp4 in /videos folder)`);
    });
    document.querySelectorAll('.notes-action').forEach(btn => {
        btn.onclick = () => alert(`📄 ${t.notesBtn}: ${btn.dataset.notes}\n(Place .pdf in /notes folder)`);
    });
    document.querySelectorAll('.complete-action').forEach(btn => {
        btn.onclick = () => {
            const sub = btn.dataset.sub, chap = btn.dataset.chap;
            const prog = getProgress();
            prog[`${sub}_${chap}`] = true;
            saveProgress(prog);
            btn.innerHTML = `✓ ${t.completed}`;
            btn.classList.add('completed');
            updateProgressUI();
        };
    });
    document.querySelectorAll('.quiz-action').forEach(btn => {
        btn.onclick = () => startQuiz(btn.dataset.sub, btn.dataset.chap);
    });
    showScreen('subjectDetail');
}

// ======================== QUIZ SYSTEM ========================
function startQuiz(subject, chapter) {
    quizState.questions = quizData.questions;
    quizState.index = 0;
    quizState.score = 0;
    renderQuizQuestion();
    showScreen('quizScreen');
}

function renderQuizQuestion() {
    const container = document.getElementById('quizContent');
    const t = translations[currentLang];
    if (quizState.index >= quizState.questions.length) {
        container.innerHTML = `
            <div class="quiz-container" style="text-align:center">
                <i class="fas fa-trophy" style="font-size:3rem; color:#2e7d5e;"></i>
                <h3>${t.quizHeader} ${t.completed}!</h3>
                <p>${t.score}: ${quizState.score} / ${quizState.questions.length}</p>
                <button id="closeQuizFinish" class="btn-primary">${t.close}</button>
            </div>`;
        document.getElementById('closeQuizFinish')?.addEventListener('click', () => document.getElementById('closeQuiz').click());
        return;
    }
    const q = quizState.questions[quizState.index];
    let html = `<div class="quiz-container"><div class="quiz-question">${q.text}</div><div class="quiz-options">`;
    q.options.forEach((opt, idx) => {
        html += `<div class="quiz-option" data-opt="${idx}">${opt}</div>`;
    });
    html += `</div><button id="submitAnswer" class="btn-primary">${t.submit}</button></div>`;
    container.innerHTML = html;
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.onclick = () => {
            document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
        };
    });
    document.getElementById('submitAnswer').onclick = () => {
        const selected = document.querySelector('.quiz-option.selected');
        if (!selected) {
            alert(currentLang === "hi" ? "कोई उत्तर चुनें" : "Select an answer");
            return;
        }
        const ans = parseInt(selected.dataset.opt);
        if (ans === q.correct) quizState.score++;
        quizState.index++;
        renderQuizQuestion();
    };
}

// ======================== NAVIGATION & SETTINGS ========================
document.getElementById('backToDash').onclick = () => showScreen('dashboard');
document.getElementById('closeQuiz').onclick = () => showScreen('subjectDetail');
document.getElementById('settingsBtn').onclick = () => document.getElementById('settingsModal').classList.add('active');
document.getElementById('closeSettings').onclick = () => document.getElementById('settingsModal').classList.remove('active');
document.getElementById('resetApp').onclick = () => {
    localStorage.clear();
    alert(currentLang === "hi" ? "सभी डेटा रीसेट हो गया। ऐप पुनः प्रारंभ होगा।" : "All data reset. App restarts.");
    location.reload();
};

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.getAttribute('data-tab');
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        document.getElementById(`${tab}Tab`).classList.add('active');
        if (tab === 'progress') updateProgressUI();
    };
});