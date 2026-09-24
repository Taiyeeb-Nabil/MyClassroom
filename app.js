const classes = [
  { id:'bio', name:'Biology · Grade 10', description:'Cell structure, genetics & life sciences', students:24, subjects:['Cell Biology','Genetics','Human Physiology'] },
  { id:'math', name:'Mathematics · Grade 10', description:'Algebra, geometry & problem solving', students:21, subjects:['Algebra','Geometry','Trigonometry'] },
  { id:'eng', name:'English Language', description:'Reading, writing & communication', students:18, subjects:['Reading','Writing','Grammar'] },
];

const lectures = [
  { title:'A closer look at the cell', type:'Reading note', meta:'8 min read', icon:'▤' },
  { title:'Cell organelles and their functions', type:'Lecture video', meta:'14 min', icon:'▶' },
  { title:'Plant and animal cells', type:'Reference material', meta:'PDF · 4 pages', icon:'▧' },
  { title:'Cell structure — revision notes', type:'Reading note', meta:'6 min read', icon:'▤' },
];

let state = {
  page:'login',
  role:'student',
  classId:null,
  section:'Lectures',
  examStarted:false,
  seconds:12*60,
  timer:null
};

const app = document.querySelector('#app');
const adminMode = () => state.role === 'admin';

function brand() 
{
  return `<div class="brand"><span class="brand-mark">MCR</span> My Classroom</div>`;
}

function topbar() {
  return `<header class="topbar">
    ${brand()}
    <div class="top-actions">
      <span class="avatar">${adminMode()?'A':'S'}</span>
      <span style="font-size:13px;font-weight:600">${adminMode()?'Admin':'Student'}</span>
      <button class="text-button" onclick="logout()">Sign out</button>
    </div>
  </header>`;
}

function login() {
  app.innerHTML = `<main class="login-wrap">
    <section class="login-art">
      ${brand()}
      <div class="art-note">
        <h1>A place to learn</h1>
        <p>All notes in one place.</p>
      </div>
    </section>

    <section class="login-side">
      <form class="login-box" onsubmit="signIn(event)">
        ${brand()}
        <div class="eyebrow">LEARNING SPACE</div>
        <h2>Welcome</h2>
        <p>Sign In</p>
        <input class="field" id="login-id" placeholder="Enter your Student ID" autocomplete="username" required>
        
        <input class="field" id="login-pass" type="password" placeholder="Enter your password" autocomplete="current-password" required>

        <button class="primary">Sign in <span style="float:right">→</span></button>
        <div style="text-align:center;margin-top:18px">
          <button type="button" class="text-button" onclick="demoAdmin()">Admin preview</button>
        </div>
      </form>
    </section>
  </main>`;
}

function signIn(event) {
  event.preventDefault();
  state.role='student';
  state.page='classes';
  render();
}

function demoAdmin() {
  state.role='admin';
  state.page='classes';
  render();
}

function logout() {
  clearInterval(state.timer);
  state = {
    ...state,
    page:'login',
    classId:null,
    section:'Lectures',
    examStarted:false
  };
  login();
}

function render() {
  if (state.page==='login') return login();
  if (state.page==='exam') return exam();
  if (state.page==='class') return classPage();
  classesPage();
}

function classesPage() {
  app.innerHTML = `<div class="shell">
    ${topbar()}
    <main class="main">
      <div class="eyebrow">${adminMode()?'ADMIN SPACE':'YOUR LEARNING SPACE'}</div>
      <div class="section-head">
        <div>
          <h1 class="heading">${adminMode()?'Your classrooms':'Your classes'}</h1>
          <p class="subheading">${adminMode()?'Manage classes, lessons and exams from one place.':'Choose a class to pick up where you left off.'}</p>
        </div>
        ${adminMode()?'<button class="primary" onclick="addClass()">＋ New class</button>':''}
      </div>
      ${adminMode()?`<div class="panel" style="display:flex;align-items:center;justify-content:space-between;margin-top:25px">
        <div>
          <strong style="font-size:14px">Admin overview</strong>
          <div class="lecture-sub" style="margin-top:5px">${classes.length} classes · ${classes.reduce((n,c)=>n+c.students,0)} students</div>
        </div>
        <span class="badge">Only you can publish</span>
      </div>`:''}
      <div class="class-grid">
        ${classes.map(c=>`<article class="class-card" onclick="openClass('${c.id}')">
          <div class="class-color"></div>
          <h2 class="class-title">${c.name}</h2>
          <p class="class-description">${c.description}</p>
          <div class="class-meta">
            <span>${adminMode()?`${c.students} students · ${c.subjects.length} subjects`:`${c.subjects.length} subjects`}</span>
            <span class="arrow">→</span>
          </div>
        </article>`).join('')}
        ${adminMode()?`<button class="class-card" onclick="addClass()" style="border-style:dashed;background:transparent;display:grid;place-items:center;color:#7c867a">
          <span><span style="font-size:27px;display:block;margin-bottom:9px">＋</span><span style="font-size:13px">Create another class</span></span>
        </button>`:''}
      </div>
      <div class="footer-note">${adminMode()?'Student IDs and passwords are assigned by you.':'Your admin will add new classes here.'}</div>
    </main>
  </div>`;
}

function openClass(id) {
  state.classId=id;
  state.page='class';
  state.section='Lectures';
  render();
}

function classPage() {
  const currentClass=classes.find(item=>item.id===state.classId)||classes[0];
  const items=state.section==='Lectures'?lectures:[];
  app.innerHTML = `<div class="shell">
    ${topbar()}
    <main class="main">
      <div class="breadcrumb">
        <button onclick="state.page='classes';render()">Classes</button>　/　${currentClass.name}
      </div>
      <div class="eyebrow">CLASSROOM</div>
      <h1 class="heading" style="margin-bottom:4px">${currentClass.name}</h1>
      <p class="subheading">${currentClass.description}</p>
      <div class="workspace">
        <aside class="sidebar">
          <a class="back-link" href="#" onclick="state.page='classes';render();return false">← All classes</a>
          <p class="side-label">CLASSROOM</p>
          ${['Lectures','Exams','Subjects'].map(section=>`<button class="nav-item ${section===state.section?'active':''}" onclick="state.section='${section}';render()">
            ${section==='Lectures'?'▤':section==='Exams'?'◷':'◫'}　${section}
          </button>`).join('')}
          ${adminMode()?`<p class="side-label" style="margin-top:23px">ADMIN</p>
            <button class="nav-item" onclick="manageStudents()">♙　Students</button>
            <button class="nav-item" onclick="manageMarks()">✓　Review marks</button>`:''}
        </aside>
        <section>
          ${state.section==='Lectures'?lecturesContent(items):state.section==='Exams'?examsContent():subjectsContent(currentClass)}
        </section>
      </div>
    </main>
  </div>`;
}

function lecturesContent(items) {
  return `<div class="section-head">
      <div>
        <h2 class="section-title">Lectures</h2>
        <p class="subheading" style="font-size:13px">Notes and resources for this class.</p>
      </div>
      ${adminMode() ? "<button class=\"secondary\" onclick=\"toast('Lecture editor coming next')\">＋ Add lecture</button>" : ""}
    </div>
    <div class="lecture-list">
      ${items.map(item => `<div class="lecture-row" onclick="toast('${item.title} — preview')">
        <div class="doc-icon">${item.icon}</div>
        <div>
          <div class="lecture-name">${item.title}</div>
          <div class="lecture-sub">${item.type}</div>
        </div>
        <span class="row-end">${item.meta}　↗</span>
      </div>`).join('')}
    </div>
    <div class="footer-note">Lecture materials are read-only for students.</div>`;
}

function examsContent() {
  return `<div class="section-head">
      <div>
        <h2 class="section-title">Exams</h2>
        <p class="subheading" style="font-size:13px">Timed assessments for this class.</p>
      </div>
      ${adminMode() ? "<button class=\"secondary\" onclick=\"toast('Exam creator coming next')\">＋ Create exam</button>" : ""}
    </div>
    <div class="panel">
      <div class="exam-row">
        <div class="doc-icon">◷</div>
        <div>
          <div class="lecture-name">Cell Biology · Check-in</div>
          <div class="lecture-sub">12 minutes · 1 attempt</div>
        </div>
        <span class="row-end"><span class="exam-pill">AVAILABLE</span></span>
        ${!adminMode() ? '<button class="primary" onclick="startExam()">Start exam</button>' : ''}
      </div>
      <div class="exam-row">
        <div class="doc-icon" style="background:#f0eef5;color:#766a93">◷</div>
        <div>
          <div class="lecture-name">Introduction to Genetics</div>
          <div class="lecture-sub">18 minutes · 2 attempts</div>
        </div>
        <span class="row-end"><span class="exam-pill" style="background:#eef0ed;color:#758071">OPENS FRIDAY</span></span>
      </div>
    </div>
    <div class="footer-note">Your marks stay private until your admin has reviewed and published them.</div>`;
}

function subjectsContent(currentClass) {
  return `<div class="section-head">
      <div>
        <h2 class="section-title">Subjects</h2>
        <p class="subheading" style="font-size:13px">Explore the topics in this class.</p>
      </div>
    </div>
    <div class="lecture-list">
      ${currentClass.subjects.map((subject,index)=>`<div class="lecture-row">
        <div class="doc-icon">${String(index+1).padStart(2,'0')}</div>
        <div>
          <div class="lecture-name">${subject}</div>
          <div class="lecture-sub">${index===0?'4 lecture pages':'Coming up'}</div>
        </div>
        <span class="row-end">→</span>
      </div>`).join('')}
    </div>`;
}

function startExam() {
  state.page='exam';
  state.examStarted=true;
  state.seconds=12*60;
  render();
  state.timer=setInterval(()=>{
    state.seconds--;
    const timerElement=document.querySelector('#timer');
    if (timerElement) timerElement.textContent=formatTime(state.seconds);
    if (state.seconds<=0) {
      clearInterval(state.timer);
      submitExam(true);
    }
  },1000);
}

function formatTime(seconds) {
  const minutes=Math.floor(seconds/60).toString().padStart(2,'0');
  const remainingSeconds=(seconds%60).toString().padStart(2,'0');
  return `${minutes}:${remainingSeconds}`;
}

function exam() {
  app.innerHTML = `<div class="exam-screen">
    <div class="exam-bar">
      <div>
        ${brand()}
        <div class="lecture-sub" style="margin-top:9px">Biology · Grade 10　/　Cell Biology check-in</div>
      </div>
      <div class="timer" id="timer">${formatTime(state.seconds)}</div>
    </div>
    <div style="padding-top:26px">
      <span class="eyebrow">12 MINUTES · 1 ATTEMPT</span>
      <h1 class="heading" style="font-size:29px">Cell Biology check-in</h1>
      <p class="subheading">Answer each question. Your attempt will be submitted when time runs out.</p>
    </div>
    <div class="question">
      <h3>1. Which part of the cell contains most of its genetic material?</h3>
      ${['Cell membrane','Nucleus','Cytoplasm','Ribosome'].map((option,index)=>`<label class="option">
        <input type="radio" name="q1" value="${index}">${option}
      </label>`).join('')}
    </div>
    <div class="question">
      <h3>2. What is the main role of mitochondria?</h3>
      ${['Store water','Make proteins','Release energy for the cell','Control what enters the cell'].map((option,index)=>`<label class="option">
        <input type="radio" name="q2" value="${index}">${option}
      </label>`).join('')}
    </div>
    <div class="question">
      <h3>3. In your own words, describe one difference between a plant and animal cell.</h3>
      <textarea class="field" rows="4" style="height:auto;padding:12px;resize:vertical" placeholder="Type your answer here…"></textarea>
      <div style="margin-top:12px">
        <label class="field-label">Or attach an answer file</label>
        <input type="file" class="field" style="padding:10px;height:auto">
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding-top:20px">
      <span class="lecture-sub">Your progress is saved as you answer.</span>
      <button class="primary" onclick="submitExam(false)">Submit exam →</button>
    </div>
  </div>`;
}

function submitExam(autoSubmitted) {
  clearInterval(state.timer);
  state.examStarted=false;
  state.page='class';
  state.section='Exams';
  render();
  toast(autoSubmitted
    ?'Time is up. Your saved answers were submitted. Marks will stay hidden until review.'
    :'Exam submitted. Your marks will stay hidden until review.');
}

function toast(message) {
  const previousToast=document.querySelector('.toast');
  if (previousToast) previousToast.remove();
  const messageElement=document.createElement('div');
  messageElement.className='toast';
  messageElement.textContent=message;
  document.body.append(messageElement);
  setTimeout(()=>messageElement.remove(),2600);
}

function addClass() {
  const name=prompt('Name this class');
  if (!name) return;
  classes.push({
    id:'c'+Date.now(),
    name,
    description:'A new learning space',
    students:0,
    subjects:[]
  });
  render();
}

function manageStudents() {
  toast('Student and class access management coming next');
}

function manageMarks() {
  toast('Marks are held for your review before publishing');
}

document.addEventListener('visibilitychange',()=>{
  if (document.hidden && state.page==='exam') cancelExam();
});

window.addEventListener('pagehide',()=>{
  if (state.page==='exam') cancelExam();
});

function cancelExam() {
  if (state.page!=='exam') return;
  clearInterval(state.timer);
  state.examStarted=false;
  state.page='class';
  state.section='Exams';
  render();
  toast('Exam cancelled because you left. Contact your admin.');
}

login();