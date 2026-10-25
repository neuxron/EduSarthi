function uploadNotes(){

  alert("Notes Uploaded Successfully");

}

function uploadAssignment(){

  alert("Assignment Uploaded Successfully");

}

function uploadVideo(){

  alert("Video Uploaded Successfully");

}

function createTest(){

  alert("Test Published Successfully");

}

function postAnnouncement(){

  alert("Announcement Posted");

}

function viewStudents(){

  alert("Opening Students List");

}

function checkProgress(){

  alert("Opening Progress Report");

}
/* SHOW NAME */

const teacherName =
localStorage.getItem("teacherName");

if(teacherName){

  document.getElementById(
    "teacherNameDisplay"
  ).innerText = teacherName;

}


/* LOGOUT */

function logoutTeacher(){

  localStorage.removeItem("teacherName");

  window.location.href = "index.html";

}
/* =========================
   DASHBOARD LIVE CLOCK
========================= */

function updateClock(){

  const now = new Date();

  const time =
  now.toLocaleTimeString();

  let clock =
  document.getElementById("liveClock");

  if(clock){

    clock.innerText = time;

  }

}

setInterval(updateClock,1000);


/* =========================
   TOTAL VISITS COUNTER
========================= */

let totalVisits =
localStorage.getItem("totalVisits");

if(totalVisits == null){

  totalVisits = 0;

}

totalVisits++;

localStorage.setItem(
  "totalVisits",
  totalVisits
);

console.log(
  "Dashboard Visits:",
  totalVisits
);


/* =========================
   SAVE LAST LOGIN
========================= */

const lastLogin =
new Date().toLocaleString();

localStorage.setItem(
  "lastLogin",
  lastLogin
);

console.log(
  "Last Login:",
  lastLogin
);


/* =========================
   AUTO WELCOME MESSAGE
========================= */

window.addEventListener(
  "load",
  ()=>{

    if(teacherName){

      console.log(
        "Welcome Back " +
        teacherName
      );

    }

  }
);


/* =========================
   FUTURE FIREBASE READY
========================= */

const dashboardData = {

  notes:[],
  assignments:[],
  videos:[],
  tests:[],
  announcements:[]

};

console.log(
  "Dashboard Ready",
  dashboardData
);