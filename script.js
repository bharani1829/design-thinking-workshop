/* ══════════════════════════════════════════════════════════════ */
  /* MULTI-ACCOUNT USER SYSTEM */
  /* ══════════════════════════════════════════════════════════════ */
  
  class UserAccountSystem {
    constructor() {
      this.loadUsers();
    }
    
    loadUsers() {
      this.users = JSON.parse(localStorage.getItem('skillCycleUsers') || '{}');
    }
    
    saveUsers() {
      localStorage.setItem('skillCycleUsers', JSON.stringify(this.users));
    }
    
    createAccount(email, name, password) {
      if (this.users[email]) return { success: false, error: 'Email already exists' };
      if (password.length < 3) return { success: false, error: 'Password too short' };
      
      this.users[email] = {
        email: email,
        name: name,
        password: password,
        coins: 6,
        courses: [],
        teachings: [],
        notifications: [],
        transactions: [],
        createdAt: new Date().toISOString()
      };
      this.saveUsers();
      return { success: true };
    }
    
    login(email, password) {
      const user = this.users[email];
      if (!user) return { success: false, error: 'Email not found' };
      if (user.password !== password) return { success: false, error: 'Incorrect password' };
      return { success: true, user: { ...user } };
    }
    
    getUser(email) {
      return this.users[email];
    }
    
    updateUser(email, data) {
      if (this.users[email]) {
        this.users[email] = { ...this.users[email], ...data };
        this.saveUsers();
        return true;
      }
      return false;
    }
    
    getAllUsers() {
      return Object.values(this.users);
    }
  }
  
  const accountSystem = new UserAccountSystem();
  let currentUser = null;
  
  function saveTeachingToCourses(courseObj, teacherEmail) {
    let allTeachings = JSON.parse(localStorage.getItem('skillCycleTeachings') || '{}');
    const courseId = 'teach_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    courseObj.id = courseId;
    courseObj.teacherEmail = teacherEmail;
    courseObj.createdAt = new Date().toISOString();
    courseObj.buyers = [];
    allTeachings[courseId] = courseObj;
    localStorage.setItem('skillCycleTeachings', JSON.stringify(allTeachings));
  }
  
  function getAllTeachings() {
    return JSON.parse(localStorage.getItem('skillCycleTeachings') || '{}');
  }
  
  function getTeachingById(courseId) {
    const allTeachings = getAllTeachings();
    return allTeachings[courseId] || null;
  }
  
  function recordCoursePurchase(courseId, buyerEmail, buyerName) {
    let allTeachings = JSON.parse(localStorage.getItem('skillCycleTeachings') || '{}');
    if (allTeachings[courseId]) {
      if (!allTeachings[courseId].buyers) allTeachings[courseId].buyers = [];
      allTeachings[courseId].buyers.push({
        email: buyerEmail,
        name: buyerName,
        purchasedAt: new Date().toISOString()
      });
      localStorage.setItem('skillCycleTeachings', JSON.stringify(allTeachings));
    }
  }
  
  const courseData = [
    { name: 'Python Basics', teacher: 'Akira', rating: 4.8, cat: 'Programming', level: 'Beginner', price: 4, desc: 'Master Python fundamentals including syntax, variables, data types, and control flow.', demoVideo: 'https://videos.pexels.com/video-files/3573877/3573877-sd_640_360_24fps.mp4', sessions: [
      { num: 1, title: 'Introduction to Python', date: 'Mar 30, 2:00 PM', status: 'pending' },
      { num: 2, title: 'Variables and Data Types', date: 'Apr 2, 2:00 PM', status: 'pending' },
      { num: 3, title: 'Control Flow', date: 'Apr 5, 2:00 PM', status: 'pending' },
      { num: 4, title: 'Functions and Modules', date: 'Apr 8, 2:00 PM', status: 'pending' }
    ] },
    { name: 'UX Fundamentals', teacher: 'Maya', rating: 4.6, cat: 'Design', level: 'Intermediate', price: 3, desc: 'Master design thinking, wireframing, and UI patterns with real-world examples.', demoVideo: 'https://videos.pexels.com/video-files/3532171/3532171-sd_640_360_24fps.mp4', sessions: [
      { num: 1, title: 'Design Thinking Basics', date: 'Mar 31, 3:00 PM', status: 'pending' },
      { num: 2, title: 'Wireframing Techniques', date: 'Apr 3, 3:00 PM', status: 'pending' },
      { num: 3, title: 'UI Patterns & Best Practices', date: 'Apr 6, 3:00 PM', status: 'pending' }
    ] },
    { name: 'Public Speaking', teacher: 'Riley', rating: 4.9, cat: 'Soft Skills', level: 'Beginner', price: 2, desc: 'Overcome stage fright and deliver powerful presentations. Master communication and audience engagement.', demoVideo: 'https://videos.pexels.com/video-files/5910274/5910274-sd_640_360_24fps.mp4', sessions: [
      { num: 1, title: 'Overcoming Stage Fright', date: 'Apr 1, 4:00 PM', status: 'pending' },
      { num: 2, title: 'Structuring Your Message', date: 'Apr 4, 4:00 PM', status: 'pending' },
      { num: 3, title: 'Q&A and Engagement', date: 'Apr 7, 4:00 PM', status: 'pending' }
    ] },
    { name: 'JavaScript & the DOM', teacher: 'Leo', rating: 4.7, cat: 'Programming', level: 'Intermediate', price: 5, desc: 'Master interactive web development by learning DOM manipulation and event handling.', demoVideo: 'https://videos.pexels.com/video-files/3191286/3191286-sd_640_360_25fps.mp4', sessions: [
      { num: 1, title: 'DOM Basics', date: 'Mar 29, 5:00 PM', status: 'completed' },
      { num: 2, title: 'Event Handling', date: 'Apr 1, 5:00 PM', status: 'pending' },
      { num: 3, title: 'DOM Manipulation', date: 'Apr 4, 5:00 PM', status: 'pending' },
      { num: 4, title: 'Advanced Selectors', date: 'Apr 7, 5:00 PM', status: 'pending' }
    ] },
    { name: 'Java Fundamentals', teacher: 'Priya', rating: 4.5, cat: 'Programming', level: 'Beginner', price: 4, desc: 'Start with Java syntax, OOP, and basic algorithms. Duration: 1 hour online.', sessions: [
      { num: 1, title: 'Java Setup & Basics', date: 'Apr 1, 1:00 PM', status: 'pending' },
      { num: 2, title: 'OOP Fundamentals', date: 'Apr 4, 1:00 PM', status: 'pending' },
      { num: 3, title: 'Collections Framework', date: 'Apr 7, 1:00 PM', status: 'pending' }
    ] },
    { name: 'Advanced CSS', teacher: 'Sam', rating: 4.4, cat: 'Design', level: 'Advanced', price: 3, desc: 'Flexbox, Grid, and responsive design. Duration: 1 hour online.', sessions: [
      { num: 1, title: 'Flexbox Mastery', date: 'Apr 2, 6:00 PM', status: 'pending' },
      { num: 2, title: 'CSS Grid Layout', date: 'Apr 5, 6:00 PM', status: 'pending' },
      { num: 3, title: 'Responsive Design', date: 'Apr 8, 6:00 PM', status: 'pending' }
    ] },
    { name: 'Effective Communication', teacher: 'Ava', rating: 4.8, cat: 'Soft Skills', level: 'Intermediate', price: 2, desc: 'Sharpen your communication skills for work and life.', sessions: [
      { num: 1, title: 'Active Listening', date: 'Apr 2, 2:00 PM', status: 'pending' },
      { num: 2, title: 'Clear Writing', date: 'Apr 5, 2:00 PM', status: 'pending' },
      { num: 3, title: 'Conflict Resolution', date: 'Apr 8, 2:00 PM', status: 'pending' }
    ] },
    { name: 'React Essentials', teacher: 'Nikhil', rating: 4.7, cat: 'Programming', level: 'Intermediate', price: 5, desc: 'Build modern, scalable UIs with React. Learn components, state, hooks, and best practices.', demoVideo: 'https://videos.pexels.com/video-files/5438863/5438863-sd_640_360_24fps.mp4', sessions: [
      { num: 1, title: 'Components & JSX', date: 'Mar 31, 7:00 PM', status: 'pending' },
      { num: 2, title: 'State & Props', date: 'Apr 3, 7:00 PM', status: 'pending' },
      { num: 3, title: 'Hooks Deep Dive', date: 'Apr 6, 7:00 PM', status: 'pending' },
      { num: 4, title: 'Context API', date: 'Apr 9, 7:00 PM', status: 'pending' }
    ] },
    { name: 'Figma for Beginners', teacher: 'Sara', rating: 4.6, cat: 'Design', level: 'Beginner', price: 3, desc: 'Learn Figma basics and UI prototyping.', sessions: [
      { num: 1, title: 'Figma Workspace Tour', date: 'Apr 1, 3:30 PM', status: 'pending' },
      { num: 2, title: 'Creating Frames & Shapes', date: 'Apr 4, 3:30 PM', status: 'pending' },
      { num: 3, title: 'Components & Variants', date: 'Apr 7, 3:30 PM', status: 'pending' }
    ] },
    { name: 'Critical Thinking', teacher: 'Ben', rating: 4.9, cat: 'Soft Skills', level: 'Advanced', price: 2, desc: 'Boost your reasoning and problem-solving.', sessions: [
      { num: 1, title: 'Logical Reasoning', date: 'Apr 2, 5:30 PM', status: 'pending' },
      { num: 2, title: 'Analyzing Arguments', date: 'Apr 5, 5:30 PM', status: 'pending' },
      { num: 3, title: 'Problem-Solving Techniques', date: 'Apr 8, 5:30 PM', status: 'pending' }
    ] },
    { name: 'SQL Crash Course', teacher: 'Arjun', rating: 4.5, cat: 'Programming', level: 'Beginner', price: 3, desc: 'Query databases with SQL. Duration: 1 hour online.', sessions: [
      { num: 1, title: 'SQL Basics', date: 'Apr 1, 6:30 PM', status: 'pending' },
      { num: 2, title: 'Joins & Relationships', date: 'Apr 4, 6:30 PM', status: 'pending' },
      { num: 3, title: 'Advanced Queries', date: 'Apr 7, 6:30 PM', status: 'pending' }
    ] },
    { name: 'Brand Design', teacher: 'Lina', rating: 4.7, cat: 'Design', level: 'Intermediate', price: 4, desc: 'Create memorable brands and logos.', sessions: [
      { num: 1, title: 'Brand Strategy', date: 'Apr 2, 4:00 PM', status: 'pending' },
      { num: 2, title: 'Logo Design Process', date: 'Apr 5, 4:00 PM', status: 'pending' },
      { num: 3, title: 'Brand Guidelines', date: 'Apr 8, 4:00 PM', status: 'pending' },
      { num: 4, title: 'Presentation & Pitching', date: 'Apr 11, 4:00 PM', status: 'pending' }
    ] },
    { name: 'Team Leadership', teacher: 'Chris', rating: 4.8, cat: 'Soft Skills', level: 'Advanced', price: 3, desc: 'Lead teams with confidence and empathy.', sessions: [
      { num: 1, title: 'Leadership Styles', date: 'Apr 1, 7:00 PM', status: 'pending' },
      { num: 2, title: 'Motivation & Engagement', date: 'Apr 4, 7:00 PM', status: 'pending' },
      { num: 3, title: 'Handling Difficult Situations', date: 'Apr 7, 7:00 PM', status: 'pending' }
    ] },
    { name: 'Node.js Basics', teacher: 'Vikram', rating: 4.6, cat: 'Programming', level: 'Intermediate', price: 4, desc: 'Server-side JavaScript for beginners.', sessions: [
      { num: 1, title: 'Node.js Setup', date: 'Mar 30, 8:00 PM', status: 'pending' },
      { num: 2, title: 'Creating a Server', date: 'Apr 2, 8:00 PM', status: 'pending' },
      { num: 3, title: 'Working with APIs', date: 'Apr 5, 8:00 PM', status: 'pending' },
      { num: 4, title: 'Database Integration', date: 'Apr 8, 8:00 PM', status: 'pending' }
    ] },
    { name: 'UI Animation', teacher: 'Mona', rating: 4.5, cat: 'Design', level: 'Advanced', price: 3, desc: 'Bring interfaces to life with animation.', sessions: [
      { num: 1, title: 'Animation Principles', date: 'Apr 1, 2:30 PM', status: 'pending' },
      { num: 2, title: 'CSS Animations', date: 'Apr 4, 2:30 PM', status: 'pending' },
      { num: 3, title: 'Interactive Animations', date: 'Apr 7, 2:30 PM', status: 'pending' }
    ] },
    { name: 'Negotiation Skills', teacher: 'Raj', rating: 4.7, cat: 'Soft Skills', level: 'Intermediate', price: 2, desc: 'Negotiate better deals and outcomes.', sessions: [
      { num: 1, title: 'Negotiation Basics', date: 'Apr 2, 3:00 PM', status: 'pending' },
      { num: 2, title: 'Win-Win Strategies', date: 'Apr 5, 3:00 PM', status: 'pending' },
      { num: 3, title: 'Handling Objections', date: 'Apr 8, 3:00 PM', status: 'pending' }
    ] },
    { name: 'C++ for Beginners', teacher: 'Elena', rating: 4.4, cat: 'Programming', level: 'Beginner', price: 4, desc: 'Intro to C++ syntax and problem solving.', sessions: [
      { num: 1, title: 'C++ Basics', date: 'Mar 31, 9:00 PM', status: 'pending' },
      { num: 2, title: 'OOP in C++', date: 'Apr 3, 9:00 PM', status: 'pending' },
      { num: 3, title: 'Templates & STL', date: 'Apr 6, 9:00 PM', status: 'pending' },
      { num: 4, title: 'Project Work', date: 'Apr 9, 9:00 PM', status: 'pending' }
    ] },
    { name: 'Mobile App Design', teacher: 'Tina', rating: 4.8, cat: 'Design', level: 'Intermediate', price: 4, desc: 'Design beautiful mobile apps.', sessions: [
      { num: 1, title: 'Mobile Design Principles', date: 'Apr 1, 1:30 PM', status: 'pending' },
      { num: 2, title: 'Prototyping for Mobile', date: 'Apr 4, 1:30 PM', status: 'pending' },
      { num: 3, title: 'Usability Testing', date: 'Apr 7, 1:30 PM', status: 'pending' },
      { num: 4, title: 'Handoff to Developers', date: 'Apr 10, 1:30 PM', status: 'pending' }
    ] },
    { name: 'Time Management', teacher: 'Omar', rating: 4.9, cat: 'Soft Skills', level: 'Beginner', price: 2, desc: 'Master your schedule and productivity.', sessions: [
      { num: 1, title: 'Setting Goals', date: 'Apr 2, 1:00 PM', status: 'pending' },
      { num: 2, title: 'Planning & Prioritization', date: 'Apr 5, 1:00 PM', status: 'pending' },
      { num: 3, title: 'Avoiding Procrastination', date: 'Apr 8, 1:00 PM', status: 'pending' }
    ] },
    { name: 'Data Structures', teacher: 'Sofia', rating: 4.7, cat: 'Programming', level: 'Advanced', price: 5, desc: 'Learn core data structures for coding interviews.', sessions: [
      { num: 1, title: 'Arrays & Linked Lists', date: 'Mar 29, 10:00 PM', status: 'completed' },
      { num: 2, title: 'Stacks & Queues', date: 'Apr 1, 10:00 PM', status: 'pending' },
      { num: 3, title: 'Trees & Graphs', date: 'Apr 4, 10:00 PM', status: 'pending' },
      { num: 4, title: 'Hash Tables & Sets', date: 'Apr 7, 10:00 PM', status: 'pending' },
      { num: 5, title: 'Interview Problems', date: 'Apr 10, 10:00 PM', status: 'pending' }
    ] }
  ];

  let coins = 6, userName = 'Harini', purchasedCourses = [], teachingSessions = [], notifications = [];
  
  function initPurchasedCourses() {
    if (purchasedCourses.length === 0) {
      const testCourse = courseData.find(c => c.name === 'JavaScript & the DOM');
      if (testCourse) {
        purchasedCourses.push(testCourse);
      }
    }
  }
  let transactions = [
    { label: 'Taught JavaScript', amt: 5 },
    { label: 'Booked Python Basics', amt: -4 },
    { label: 'Starter bonus', amt: 5 }
  ];
  let activeFilter = 'all';

  function openAbout() {
    document.getElementById('aboutModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function closeAbout() {
    document.getElementById('aboutModal').style.display = 'none';
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeAbout();
  });

  /* Spawn floating particles on auth page */
  (function spawnParticles() {
    const wrap = document.getElementById('authWrap');
    if (!wrap) return;
    const count = 14;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'auth-particle';
      const size = 4 + Math.random() * 6;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        top:${80 + Math.random() * 20}%;
        opacity:${0.3 + Math.random() * 0.4};
        animation-duration:${8 + Math.random() * 14}s;
        animation-delay:${Math.random() * 10}s;
        background: rgba(${Math.random()>0.5?'116,148,236':'90,125,224'},${0.4+Math.random()*0.3});
      `;
      wrap.appendChild(p);
    }
  })();

  function showAuthTab(t) {
    const container = document.getElementById('authContainer');
    if (t === 'signup') {
      container.classList.add('active');
    } else {
      container.classList.remove('active');
    }
  }
  function launchApp(email) {
    if (!currentUser) return;
    
    userName = currentUser.name;
    coins = currentUser.coins || 6;
    purchasedCourses = currentUser.courses || [];
    teachingSessions = currentUser.teachings || [];
    notifications = currentUser.notifications || [];
    transactions = currentUser.transactions || [];
    
    const init = currentUser.name.charAt(0).toUpperCase();
    ['userAvatar', 'profAv'].forEach(id => document.getElementById(id).textContent = init);
    document.getElementById('profName').textContent = currentUser.name;
    document.getElementById('homeUserName').textContent = currentUser.name;
    
    updateCoins();
    document.getElementById('authWrap').style.display = 'none';
    document.getElementById('appWrap').style.display = 'flex';
    renderCourses();
    renderEnrolled();
    renderOfferings();
    updateTransactions();
    updateNotifications();
  }
  
  function saveCurrentUserState() {
    if (!currentUser) return;
    currentUser.coins = coins;
    currentUser.courses = purchasedCourses;
    currentUser.teachings = teachingSessions;
    currentUser.notifications = notifications;
    currentUser.transactions = transactions;
    accountSystem.updateUser(currentUser.email, currentUser);
  }
  
  function doLogout() {
    if (!confirm('Are you sure you want to logout?')) return;
    saveCurrentUserState();
    currentUser = null;
    userName = 'User';
    coins = 6;
    purchasedCourses = [];
    teachingSessions = [];
    notifications = [];
    transactions = [];
    document.getElementById('authWrap').style.display = 'flex';
    document.getElementById('appWrap').style.display = 'none';
    showAuthTab('login');
    document.getElementById('lEmail').value = '';
    document.getElementById('lPass').value = '';
    document.getElementById('sName').value = '';
    document.getElementById('sEmail').value = '';
    document.getElementById('sPass').value = '';
    document.getElementById('lNote').textContent = '';
    document.getElementById('sNote').textContent = '';
  }
  function doLogin() {
    const e = document.getElementById('lEmail').value.trim();
    const p = document.getElementById('lPass').value;
    const n = document.getElementById('lNote');
    
    if (!e || !p) {
      n.textContent = 'Please fill in all fields.';
      n.className = 'anote';
      return;
    }
    
    const result = accountSystem.login(e, p);
    if (!result.success) {
      n.textContent = '❌ ' + result.error;
      n.className = 'anote';
      return;
    }
    
    currentUser = result.user;
    n.className = 'anote ok';
    n.textContent = '✓ Welcome back, ' + currentUser.name + '!';
    setTimeout(() => launchApp(currentUser.email), 600);
  }
  
  function doSignup() {
    const nm = document.getElementById('sName').value.trim();
    const e = document.getElementById('sEmail').value.trim();
    const p = document.getElementById('sPass').value;
    const n = document.getElementById('sNote');
    
    if (!nm || !e || !p) {
      n.textContent = 'Please fill in all fields.';
      n.className = 'anote';
      return;
    }
    
    if (!e.includes('@')) {
      n.textContent = 'Please enter a valid email.';
      n.className = 'anote';
      return;
    }
    
    const result = accountSystem.createAccount(e, nm, p);
    if (!result.success) {
      n.textContent = '❌ ' + result.error;
      n.className = 'anote';
      return;
    }
    
    currentUser = accountSystem.getUser(e);
    n.className = 'anote ok';
    n.textContent = '🎉 Account created! You got 6 starter coins!';
    showAuthTab('login');
    setTimeout(() => launchApp(e), 600);
  }
  
  function doGoogleLogin(isSignup = false) {
    const email = prompt('Enter your email (must be unique):')?.trim();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email.');
      return;
    }
    
    if (isSignup) {
      const name = prompt('Enter your full name:')?.trim();
      if (!name) return;
      
      const result = accountSystem.createAccount(email, name, 'google-oauth');
      if (!result.success) {
        alert('❌ ' + result.error + '\n\nTip: Use a different email if this one already exists.');
        return;
      }
      
      currentUser = accountSystem.getUser(email);
      document.getElementById('sNote').className = 'anote ok';
      document.getElementById('sNote').textContent = '🎉 Google account created! You got 6 starter coins!';
      setTimeout(() => launchApp(email), 600);
    } else {
      const result = accountSystem.login(email, 'google-oauth');
      if (!result.success) {
        alert('❌ ' + result.error + '\n\nTip: Email not found. Try signing up instead.');
        return;
      }
      
      currentUser = result.user;
      document.getElementById('lNote').className = 'anote ok';
      document.getElementById('lNote').textContent = '✓ Welcome back with Google!';
      setTimeout(() => launchApp(email), 600);
    }
  }
  
  function updateCoins() {
    ['coinDisplay', 'balStat', 'profCoins'].forEach(id => document.getElementById(id).textContent = coins);
  }
  function updateTransactions() {
    document.getElementById('transactionList').innerHTML = transactions.map(t =>
      `<div class="tx-item"><span class="tx-label">${t.label}</span><span class="tx-amt ${t.amt > 0 ? 'tx-pos' : 'tx-neg'}">${t.amt > 0 ? '+' : ''}${t.amt}</span></div>`
    ).join('');
  }
  
  function addNotification(title, message, type = 'booking') {
    const notification = {
      id: Date.now(),
      title: title,
      message: message,
      type: type,
      timestamp: new Date()
    };
    notifications.unshift(notification);
    updateNotifications();
  }

  function updateNotifications() {
    const badge = document.getElementById('notifBadge');
    const list = document.getElementById('notifList');
    
    const notifArray = currentUser && currentUser.notifications ? currentUser.notifications : notifications;
    
    if (notifArray.length === 0) {
      badge.style.display = 'none';
      list.innerHTML = '<div class="notif-empty">No notifications yet</div>';
    } else {
      badge.style.display = 'flex';
      badge.textContent = notifArray.length;
      list.innerHTML = notifArray.map(n => {
        const timeStr = n.timestamp ? formatTime(new Date(n.timestamp)) : 'Just now';
        return `
        <div class="notif-item">
          <div class="notif-item-title">${n.title}</div>
          <div>${n.message}</div>
          <div class="notif-item-time">${timeStr}</div>
        </div>
      `}).join('');
    }
  }

  function formatTime(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return date.toLocaleDateString();
  }

  function toggleNotifPanel() {
    document.getElementById('notifPanel').classList.toggle('open');
  }

  function clearNotifications() {
    notifications = [];
    updateNotifications();
    document.getElementById('notifPanel').classList.remove('open');
  }

  document.addEventListener('click', function(e) {
    const notifBell = document.getElementById('notifBell');
    const notifPanel = document.getElementById('notifPanel');
    if (!notifBell.contains(e.target) && !notifPanel.contains(e.target)) {
      notifPanel.classList.remove('open');
    }
  });

  function goPage(p) {
    document.querySelectorAll('.page').forEach(el => el.classList.remove('on'));
    document.getElementById('pg-' + p).classList.add('on');
    document.querySelectorAll('.bnav-btn').forEach(b => b.classList.toggle('on', b.dataset.p === p));
  }
  function switchLT(mode) {
    const lp = document.getElementById('ltLearnPanel'), tp = document.getElementById('ltTeachPanel');
    const lb = document.getElementById('ltLearnBtn'), tb = document.getElementById('ltTeachBtn');
    if (mode === 'learn') {
      lp.classList.add('on'); tp.classList.remove('on');
      lb.className = 'lt-btn active-learn'; tb.className = 'lt-btn';
      document.getElementById('ltPanelTitle').textContent = 'My Learning';
      initPurchasedCourses();
      renderEnrolled();
    } else {
      tp.classList.add('on'); lp.classList.remove('on');
      tb.className = 'lt-btn active-teach'; lb.className = 'lt-btn';
      document.getElementById('ltPanelTitle').textContent = 'My Teaching';
      renderOfferings();
    }
  }
  function renderEnrolled() {
    const el = document.getElementById('enrolledList');
    document.getElementById('learnCount').textContent = purchasedCourses.length;
    if (purchasedCourses.length === 0) {
      el.innerHTML = `<div class="empty-state"><div class="es-icon">📚</div><p>You haven't enrolled in any courses yet.<br>Browse the Learn tab to find skills.</p><button class="es-btn" onclick="goPage('learn')">Browse courses →</button></div>`;
      return;
    }
    el.innerHTML = purchasedCourses.map((c, idx) => `
    <div class="enrolled-card" style="flex-direction:column;align-items:stretch;">
      <div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;" onclick="toggleCourseSessions(${idx})">
        <div>
          <h4>${c.name}</h4>
          <span style="font-size:12px;color:var(--amber);">By ${c.teacher} · ${c.cat} · ${c.level}</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <span class="ec-badge">Enrolled</span>
          <span id="toggle-${idx}" style="font-size:18px;transition:transform 0.3s;color:#7494ec;">▼</span>
        </div>
      </div>
      <div id="sessions-${idx}" style="display:none;margin-top:12px;padding-top:12px;border-top:1px solid rgba(116,148,236,0.15);">
        ${c.sessions ? c.sessions.map((s, sIdx) => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(116,148,236,0.08);">
            <div style="flex:1;">
              <div style="font-size:13px;font-weight:600;color:var(--text);">Session ${s.num}: ${s.title}</div>
              <div style="font-size:11.5px;color:var(--sub);margin-top:2px;">📅 ${s.date}</div>
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
              <span style="font-size:11px;font-weight:600;padding:4px 10px;border-radius:6px;${s.status === 'completed' ? 'background:rgba(16,185,129,0.1);color:#10b981;' : 'background:rgba(116,148,236,0.08);color:var(--sub);'}">${s.status === 'completed' ? '✓ Done' : 'Upcoming'}</span>
              ${s.status === 'completed' ? `<button onclick="startSessionQuiz(${idx}, ${sIdx})" style="font-size:12px;padding:5px 12px;border:none;border-radius:6px;background:linear-gradient(135deg,#7494ec,#4268d4);color:#fff;font-weight:600;cursor:pointer;transition:all 0.15s;" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">📝 Quiz</button>` : ''}
            </div>
          </div>
        `).join('') : ''}
      </div>
    </div>`).join('');
  }
  function toggleCourseSessions(idx) {
    const sessionsDiv = document.getElementById(`sessions-${idx}`);
    const toggleBtn = document.getElementById(`toggle-${idx}`);
    if (sessionsDiv.style.display === 'none') {
      sessionsDiv.style.display = 'block';
      toggleBtn.style.transform = 'rotate(180deg)';
    } else {
      sessionsDiv.style.display = 'none';
      toggleBtn.style.transform = 'rotate(0deg)';
    }
  }
  function renderOfferings() {
    const el = document.getElementById('offeringsList');
    document.getElementById('teachCount').textContent = teachingSessions.length;
    if (teachingSessions.length === 0) {
      el.innerHTML = `<div class="empty-state"><div class="es-icon">✍️</div><p>You haven't offered any skills yet.<br>Share your knowledge and earn coins.</p><button class="es-btn" onclick="goPage('teach')">Offer a skill →</button></div>`;
      return;
    }
    el.innerHTML = teachingSessions.map((s, idx) => {
      const allTeachings = Object.values(getAllTeachings());
      const globalCourse = allTeachings.find(t => t.name === s.name && t.teacherEmail === currentUser.email);
      const buyerCount = globalCourse && globalCourse.buyers ? globalCourse.buyers.length : 0;
      
      return `
    <div class="teach-card" onclick="showTeachingDetail(${idx})" style="cursor:pointer;position:relative;">
      <div class="tc-left"><h4>${s.name}</h4><span>${s.cat} · ${s.level}${s.slots ? ' · ' + s.slots + ' sessions' : ''}${s.demoVideo ? ' · 🎬 Demo' : ''}</span></div>
      <div class="tc-right">
        <span class="tc-badge" style="background:${buyerCount > 0 ? 'rgba(16,185,129,0.12)' : 'rgba(116,148,236,0.1)'};color:${buyerCount > 0 ? '#10b981' : '#7494ec'};">👥 ${buyerCount} ${buyerCount === 1 ? 'student' : 'students'}</span>
        <span class="tc-coins">${s.price} coins/course</span>
      </div>
    </div>`;
    }).join('');
  }
  function renderCourses() {
    const list = document.getElementById('skillsList');
    list.innerHTML = '';
    
    let allCourses = courseData.slice(0, 5);
    const allTeachings = Object.values(getAllTeachings());
    allCourses = allCourses.concat(allTeachings);
    
    allCourses.forEach((c, idx) => {
      const div = document.createElement('div');
      div.className = 'skill-card';
      div.setAttribute('data-cat', c.cat);
      div.setAttribute('data-q', (c.name + ' ' + (c.teacher || c.teacherEmail || 'Teacher')).toLowerCase());
      div.setAttribute('data-source', c.teacherEmail ? 'teaching' : 'preset');
      div.setAttribute('data-course-id', c.id || idx);
      
      const teacher = c.teacher || c.teacherEmail.split('@')[0];
      div.innerHTML = `<h3>${c.name}</h3><div class="sc-meta">Teacher: ${teacher} · ★ ${c.rating || 4.5} · ${c.cat} · ${c.level}</div><div class="sc-footer"><div class="sc-price"><div class="coin-dot"></div> ${c.price} Coins</div><button class="view-btn" data-idx="${idx}" data-source="${c.teacherEmail ? 'teaching' : 'preset'}">View details</button></div>`;
      list.appendChild(div);
    });
    
    document.querySelectorAll('#skillsList .view-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const source = this.getAttribute('data-source');
        const allCoursesList = document.querySelectorAll('#skillsList .skill-card');
        let idx = 0;
        for (let i = 0; i < allCoursesList.length; i++) {
          if (allCoursesList[i] === this.parentElement.parentElement) {
            idx = i;
            break;
          }
        }
        if (source === 'teaching') {
          const card = this.closest('.skill-card');
          const courseId = card.getAttribute('data-course-id');
          if (courseId && courseId.startsWith('teach_')) {
            showCourseDetails(idx, 'teaching', courseId);
          }
        } else {
          showCourseDetails(idx, 'preset');
        }
      });
    });
  }
  function setFilter(el, f) {
    document.querySelectorAll('#pg-learn .chip').forEach(c => c.classList.remove('on'));
    el.classList.add('on'); activeFilter = f; filterSkills();
  }
  function filterSkills() {
    const q = document.getElementById('searchBox').value.toLowerCase();
    document.querySelectorAll('#skillsList .skill-card').forEach(c => {
      const catMatch = activeFilter === 'all' || c.dataset.cat === activeFilter;
      const qMatch = !q || c.dataset.q.includes(q) || c.querySelector('h3').textContent.toLowerCase().includes(q);
      c.style.display = catMatch && qMatch ? 'block' : 'none';
    });
  }

  function showCourseDetails(idx, source = 'preset', courseId = null) {
    let c;
    if (source === 'teaching' && courseId) {
      c = getTeachingById(courseId);
    } else {
      let allCourses = courseData.slice(0, 5).concat(Object.values(getAllTeachings()));
      c = allCourses[idx];
    }
    
    if (!c) return;
    
    const already = purchasedCourses.find(p => p.name === c.name);
    const overlay = document.createElement('div');
    overlay.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(226,226,226,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;overflow-y:auto;backdrop-filter:blur(6px);';
    
    const videoHTML = c.demoVideo ? `
      <div style='margin-bottom:18px;border-radius:12px;overflow:hidden;background:#000;'>
        <div style='position:relative;padding-bottom:56.25%;height:0;overflow:hidden;'>
          <video style='position:absolute;top:0;left:0;width:100%;height:100%;' controls controlsList="nodownload">
            <source src='${c.demoVideo}' type='video/mp4'>
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    ` : '';
    
    const teacher = c.teacher || (c.teacherEmail ? c.teacherEmail.split('@')[0] : 'Unknown');
    
    overlay.innerHTML = `<div style="background:#fff;padding:28px 24px 22px;border-radius:18px;max-width:480px;width:100%;box-shadow:0 8px 40px rgba(116,148,236,0.2);color:#333;max-height:85vh;overflow-y:auto;border:2px solid rgba(116,148,236,0.2);">
    <h2 style='font-size:20px;font-weight:800;margin-bottom:8px;color:#333;'>${c.name}</h2>
    <div style='font-size:13.5px;color:#888;margin-bottom:16px;'>Teacher: ${teacher} · ★ ${c.rating || 4.5} · ${c.cat} · ${c.level}</div>
    ${videoHTML}
    <div style='font-size:13.5px;margin-bottom:16px;color:#555;line-height:1.6;'>${c.desc}</div>
    <div style='background:rgba(201,214,255,0.2);border-left:3px solid rgba(116,148,236,0.4);padding:12px;border-radius:8px;margin-bottom:16px;font-size:12px;color:#888;'>
      <strong style='color:#333;'>📚 Session Details:</strong><br>
      ${c.sessions && c.sessions.length > 0 ? c.sessions.map(s => `Session ${s.num}: ${s.title} (${s.date}) - <span style='color:${s.status === 'completed' ? '#10b981' : '#888'}'>${s.status}</span>`).join('<br>') : 'Session details coming soon'}
    </div>
    <div style='font-size:15px;font-weight:700;margin-bottom:18px;color:#333;'>Price: <span style='color:#7494ec'>${c.price} Coins</span></div>
    <div style='display:flex;gap:10px;flex-wrap:wrap;'>
      ${already
        ? `<div style='padding:10px 16px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:8px;color:#10b981;font-size:14px;font-weight:600;width:100%;text-align:center;'>✓ Already enrolled - View sessions in Learning tab</div>`
        : `<button id='bookSlotBtn' style='padding:11px 22px;border:none;border-radius:8px;background:linear-gradient(135deg,#7494ec,#4268d4);color:#fff;font-weight:700;font-size:14px;cursor:pointer;flex:1;'>Book Course →</button>`
      }
      <button style='padding:11px 20px;border:1px solid rgba(116,148,236,0.3);border-radius:8px;background:transparent;color:#888;font-weight:600;font-size:14px;cursor:pointer;flex:1;'>Close</button>
    </div>
    <div id='bookErr' style='margin-top:10px;font-size:13px;color:#ff6b6b;'></div>
  </div>`;
    document.getElementById('appWrap').appendChild(overlay);
    
    const closeBtn = overlay.querySelector('button:last-of-type');
    closeBtn.addEventListener('click', function() {
      overlay.remove();
    });
    
    const btn = document.getElementById('bookSlotBtn');
    if (btn) btn.onclick = function () {
      if (!currentUser) { document.getElementById('bookErr').textContent = 'Please login first.'; return; }
      if (coins < c.price) { document.getElementById('bookErr').textContent = 'Not enough coins to book this slot.'; return; }
      
      coins -= c.price;
      updateCoins();
      purchasedCourses.push(c);
      transactions.push({ label: 'Booked ' + c.name, amt: -c.price });
      
      if (c.id && c.id.startsWith('teach_')) {
        recordCoursePurchase(c.id, currentUser.email, currentUser.name);
      }
      
      let sellerEmail = c.teacherEmail || c.teacher.toLowerCase() + '@skillcycle.com';
      if (!sellerEmail.includes('@')) sellerEmail = sellerEmail.toLowerCase() + '@skillcycle.com';
      
      const sellerUser = accountSystem.getUser(sellerEmail);
      if (sellerUser) {
        sellerUser.notifications = sellerUser.notifications || [];
        const notifMsg = `${currentUser.name} booked your "${c.name}" course for ${c.price} coins`;
        sellerUser.notifications.unshift({
          id: Date.now(),
          title: '🎓 New Booking!',
          message: notifMsg,
          type: 'booking',
          buyerEmail: currentUser.email,
          buyerName: currentUser.name,
          courseId: c.id,
          courseName: c.name,
          timestamp: new Date().toISOString()
        });
        accountSystem.updateUser(sellerEmail, sellerUser);
      }
      
      saveCurrentUserState();
      addNotification('✓ Enrolled', `You successfully enrolled in ${c.name}!`, 'success');
      updateTransactions();
      renderEnrolled();
      overlay.remove();
      showBookingSuccess(c);
    };
  }

  function showTeachingDetail(idx) {
    const s = teachingSessions[idx];
    
    const allTeachings = Object.values(getAllTeachings());
    const globalCourse = allTeachings.find(t => t.name === s.name && t.teacherEmail === currentUser.email);
    const buyers = globalCourse && globalCourse.buyers ? globalCourse.buyers : [];
    const totalEarnings = buyers.length * (s.price || 0);
    
    const buyersHTML = buyers.length === 0 
      ? '<div style="color:#888;font-size:13px;padding:10px;text-align:center;">No students yet. Share your course!</div>'
      : buyers.map(b => `
        <div style="background:rgba(16,185,129,0.06);padding:10px 12px;border-radius:8px;margin-bottom:8px;border-left:3px solid #10b981;">
          <div style="font-weight:600;color:#333;">${b.name}</div>
          <div style="font-size:12px;color:#888;">${b.email}</div>
          <div style="font-size:11px;color:#aaa;margin-top:4px;">Purchased: ${new Date(b.purchasedAt).toLocaleDateString()}</div>
        </div>
      `).join('');
    
    const overlay = document.createElement('div');
    overlay.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(226,226,226,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;overflow-y:auto;backdrop-filter:blur(6px);';
    overlay.innerHTML = `<div style="background:#fff;padding:28px 24px 22px;border-radius:18px;max-width:480px;width:100%;box-shadow:0 8px 40px rgba(116,148,236,0.2);color:#333;max-height:80vh;overflow-y:auto;border:2px solid rgba(116,148,236,0.2);">
    <h2 style='font-size:20px;font-weight:800;margin-bottom:8px;color:#333;'>${s.name}</h2>
    <div style='font-size:13.5px;color:#888;margin-bottom:16px;'>${s.cat} · ${s.level}${s.slots ? ' · ' + s.slots + ' sessions' : ''}</div>
    <div style='font-size:13.5px;margin-bottom:16px;color:#555;line-height:1.6;'>${s.description || 'A skill session with practical learning.'}</div>
    
    <div style='background:rgba(201,214,255,0.2);border-left:3px solid rgba(116,148,236,0.4);padding:14px;border-radius:8px;margin-bottom:16px;'>
      <div style='display:grid;grid-template-columns:1fr 1fr;gap:12px;'>
        <div><div style='font-size:11px;color:#888;text-transform:uppercase;'>Price per student</div><div style='font-weight:700;color:#10b981;font-size:16px;'>${s.price} coins</div></div>
        <div><div style='font-size:11px;color:#888;text-transform:uppercase;'>Students enrolled</div><div style='font-weight:700;color:#7494ec;font-size:16px;'>${buyers.length}</div></div>
        <div style='grid-column:1/-1;'><div style='font-size:11px;color:#888;text-transform:uppercase;'>Total earnings</div><div style='font-weight:700;color:#f59e0b;font-size:18px;'>+${totalEarnings} coins</div></div>
      </div>
    </div>
    
    <div style='margin-bottom:16px;'>
      <div style='font-weight:700;margin-bottom:10px;font-size:14px;color:#333;'>👥 Student Details (${buyers.length})</div>
      <div style='max-height:200px;overflow-y:auto;'>
        ${buyersHTML}
      </div>
    </div>
    
    <div style='display:flex;gap:10px;flex-wrap:wrap;'>
      <button style='padding:11px 20px;border:1px solid rgba(116,148,236,0.3);border-radius:8px;background:transparent;color:#888;font-weight:600;font-size:14px;cursor:pointer;flex:1;'>← Back</button>
    </div>
  </div>`;
    document.getElementById('appWrap').appendChild(overlay);
    overlay.querySelector('button').addEventListener('click', function() {
      overlay.remove();
    });
  }

  function showBookingSuccess(c) {
    const wrap = document.createElement('div');
    wrap.className = 'dialogue-overlay';
    wrap.innerHTML = `
    <div class="dialogue-box">
      <div class="dialogue-ring ring-green">✓</div>
      <h2>Slot Booked!</h2>
      <p>You have successfully enrolled in</p>
      <div class="dialogue-highlight-blue">${c.name}</div>
      <div class="dialogue-coins">${c.price} coins deducted · Balance: ${coins} coins</div>
      <div class="progress-bar-wrap"><div class="progress-bar blue"></div></div>
      <div class="dialogue-note">Redirecting to My Learning…</div>
    </div>`;
    document.getElementById('appWrap').appendChild(wrap);
    setTimeout(() => {
      wrap.remove();
      goPage('home');
      switchLT('learn');
      document.getElementById('pg-home').scrollTop = 0;
    }, 2700);
  }

  function handleVideoUpload(input) {
    const file = input.files[0];
    if (!file) return;
    const mb = (file.size / 1024 / 1024).toFixed(1);
    document.getElementById('videoUploadPrompt').style.display = 'none';
    const chosen = document.getElementById('videoUploadChosen');
    chosen.style.display = 'flex';
    document.getElementById('videoFileName').textContent = file.name;
    document.getElementById('videoFileSize').textContent = mb + ' MB';
    document.getElementById('videoUploadArea').style.borderColor = 'rgba(16,185,129,0.5)';
  }
  function clearVideoUpload() {
    document.getElementById('tDemoVideo').value = '';
    document.getElementById('videoUploadPrompt').style.display = 'block';
    document.getElementById('videoUploadChosen').style.display = 'none';
    document.getElementById('videoUploadArea').style.borderColor = 'rgba(116,148,236,0.35)';
  }

  function submitTeach() {
    const name = document.getElementById('tSkillName').value.trim();
    const n = document.getElementById('teachNote');
    if (!name) { n.textContent = 'Please enter a skill name.'; n.className = 'anote'; return; }
    const videoInput = document.getElementById('tDemoVideo');
    const videoFile = videoInput.files[0] || null;
    const session = { name, cat: document.getElementById('tCat').value, level: document.getElementById('tLevel').value, price: document.getElementById('tCoins').value, slots: document.getElementById('tSlots').value.trim(), demoVideo: videoFile ? videoFile.name : null };
    n.className = 'anote ok'; n.textContent = '✓ Skill submitted! Opening quiz…';
    clearVideoUpload();
    showTutorTest(name, session);
  }

  async function startSessionQuiz(courseIdx, sessionIdx) {
    const course = purchasedCourses[courseIdx];
    const session = course.sessions[sessionIdx];
    if (!session) return;

    document.getElementById('sessionQuizModal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'sessionQuizModal';
    modal.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(226,226,226,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;backdrop-filter:blur(6px);';
    modal.innerHTML = `<div style='background:#fff;padding:36px 24px 30px;border-radius:18px;max-width:420px;width:100%;color:#333;text-align:center;border:2px solid rgba(116,148,236,0.2);box-shadow:0 8px 40px rgba(116,148,236,0.15);'>
      <div style='font-size:36px;margin-bottom:14px;animation:spin 1.2s linear infinite;display:inline-block;'>⚙️</div>
      <h2 style='font-size:17px;font-weight:800;margin-bottom:8px;color:#333;'>Generating quiz…</h2>
      <p style='font-size:13px;color:#888;'>Creating 5 questions for <b style="color:#7494ec">${session.title}</b></p>
    </div>`;
    document.getElementById('appWrap').appendChild(modal);

    const prompt = `You are a quiz generator for an educational learning platform. Create exactly 5 multiple-choice questions to assess whether someone has learned the concepts from a specific session.

Session: "${session.title}"
Course: "${course.name}"
Category: "${course.cat}"
Level: "${course.level}"
Course Description: "${course.description || 'No description provided.'}"

Rules:
- Questions must be specific to the session topic: "${session.title}"
- Questions should test understanding of key learning outcomes from this session
- Each question must have exactly 4 options
- Exactly one option must be correct
- Vary difficulty appropriately for a ${course.level}-level learner
- Return ONLY valid JSON, no markdown, no explanation

Return this exact JSON structure:
[
  {"q":"question text","a":"correct answer","opts":["option1","option2","option3","option4"]},
  ...5 items total
]`;

    let qs = null;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await res.json();
      const raw = data.content.map(b => b.text || '').join('').trim().replace(/```json|```/g, '');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 5) qs = parsed.slice(0, 5);
    } catch (err) { }

    if (!qs) {
      const fallback = [
        { q: `What was the main topic of the "${session.title}" session?`, a: session.title, opts: [session.title, 'Basic Overview', 'Advanced Concepts', 'Troubleshooting'] },
        { q: `Which best describes the goal of "${session.title}"?`, a: 'To understand key concepts', opts: ['To understand key concepts', 'To memorize definitions', 'To pass an exam', 'To complete homework'] },
        { q: 'Did you find the session content clear and engaging?', a: 'Yes', opts: ['Yes', 'Somewhat', 'Not really', 'Very confusing'] },
        { q: 'What is one key takeaway from this session?', a: 'Key learning outcome', opts: ['Key learning outcome', 'Random fact', 'Teacher biography', 'Course schedule'] },
        { q: 'Would you like to revisit this session for more practice?', a: 'Yes', opts: ['Yes', 'No', 'Maybe later', 'Not applicable'] }
      ];
      qs = fallback;
    }

    modal.innerHTML = `<div style='background:#fff;padding:28px 24px 20px;border-radius:18px;max-width:420px;width:100%;border:2px solid rgba(116,148,236,0.2);box-shadow:0 8px 40px rgba(116,148,236,0.15);'>
      <div style='display:flex;align-items:center;gap:10px;margin-bottom:16px;'>
        <div style='font-size:20px;'>📚</div>
        <div>
          <h2 style='font-size:17px;font-weight:800;color:#333;margin:0;'>Session Quiz</h2>
          <div style='font-size:12px;color:#888;margin-top:2px;'>${course.name} · Session ${session.num}</div>
        </div>
      </div>
      <form id='sessionQuizForm' style='display:flex;flex-direction:column;gap:16px;max-height:60vh;overflow-y:auto;padding-right:8px;'>
        ${qs.map((q, i) => `
        <div style='background:rgba(201,214,255,0.1);border:1px solid rgba(116,148,236,0.15);border-radius:10px;padding:14px;'>
          <div style='color:#333;font-size:13.5px;font-weight:600;margin-bottom:10px;line-height:1.5;'>${i + 1}. ${q.q}</div>
          <div style='display:flex;flex-direction:column;gap:6px;'>
            ${q.opts.map(o => `
            <label style='display:flex;align-items:center;gap:9px;color:#555;font-size:13px;cursor:pointer;padding:7px 10px;border-radius:7px;border:1px solid transparent;transition:all 0.15s;' onmouseover="this.style.background='rgba(116,148,236,0.06)';this.style.borderColor='rgba(116,148,236,0.2)'" onmouseout="this.style.background='transparent';this.style.borderColor='transparent'">
              <input type='radio' name='q${i}' value='${o}' required style='accent-color:#7494ec;width:14px;height:14px;flex-shrink:0;'>${o}
            </label>`).join('')}
          </div>
        </div>`).join('')}
        <button type='submit' style='padding:12px;border:none;border-radius:9px;background:linear-gradient(135deg,#7494ec,#4268d4);color:#fff;font-weight:700;font-size:14px;cursor:pointer;margin-top:2px;'>Submit Quiz →</button>
      </form>
    </div>`;

    document.getElementById('sessionQuizForm').onsubmit = function (ev) {
      ev.preventDefault();
      let correct = 0;
      for (let i = 0; i < qs.length; ++i) {
        const ch = document.querySelector(`input[name='q${i}']:checked`);
        if (ch && ch.value === qs[i].a) correct++;
      }
      const pct = Math.round((correct / qs.length) * 100);
      session.quizScore = pct;
      session.quizAttempts = (session.quizAttempts || 0) + 1;
      modal.remove();
      showSessionQuizResults(course.name, session.title, pct, correct, qs.length);
    };
  }

  function showSessionQuizResults(courseName, sessionTitle, pct, correct, total) {
    const wrap = document.createElement('div');
    wrap.className = 'dialogue-overlay';
    const isPassed = pct >= 70;
    wrap.innerHTML = `
    <div class="dialogue-box">
      <div class="dialogue-ring ${isPassed ? 'ring-green' : 'ring-orange'}">${isPassed ? '✓' : '📊'}</div>
      <h2>${isPassed ? 'Great Job!' : 'Quiz Complete'}</h2>
      <p>${sessionTitle}</p>
      <div class="dialogue-highlight-${isPassed ? 'green' : 'orange'}">${pct}%</div>
      <div class="dialogue-score">Score: ${correct}/${total} correct</div>
      <div class="progress-bar-wrap" style="height:8px;background:rgba(116,148,236,0.1);border-radius:4px;overflow:hidden;margin:12px 0;">
        <div class="progress-bar" style="height:100%;background:linear-gradient(90deg,#7494ec,#4268d4);width:${pct}%;transition:width 0.6s ease;"></div>
      </div>
      <div class="dialogue-note">${isPassed ? '✓ Mastered this session!' : 'Keep practicing to improve your score'}</div>
      <button onclick="this.closest('.dialogue-overlay').remove()" style="padding:10px 24px;border:none;border-radius:8px;background:rgba(116,148,236,0.08);border:1px solid rgba(116,148,236,0.3);color:#7494ec;font-size:13px;font-weight:600;cursor:pointer;margin-top:8px;">Close</button>
    </div>`;
    document.getElementById('appWrap').appendChild(wrap);
  }

  async function showTutorTest(skill, session) {
    document.getElementById('tutorTestModal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'tutorTestModal';
    modal.style = 'position:absolute;top:0;left:0;width:100%;min-height:100%;background:rgba(226,226,226,0.7);display:flex;align-items:flex-start;justify-content:center;z-index:9999;padding:60px 16px 40px;backdrop-filter:blur(6px);';
    modal.innerHTML = `<div style='background:#fff;padding:36px 24px 30px;border-radius:18px;max-width:420px;width:100%;color:#333;text-align:center;border:2px solid rgba(116,148,236,0.2);box-shadow:0 8px 40px rgba(116,148,236,0.15);'>
      <div style='font-size:36px;margin-bottom:14px;animation:spin 1.2s linear infinite;display:inline-block;'>⚙️</div>
      <h2 style='font-size:17px;font-weight:800;margin-bottom:8px;color:#333;'>Generating your quiz…</h2>
      <p style='font-size:13px;color:#888;'>Creating 5 questions tailored to <b style="color:#7494ec">${skill}</b></p>
    </div>`;
    document.getElementById('appWrap').appendChild(modal);

    const cat = session.cat || '';
    const level = session.level || '';
    const desc = document.getElementById('tDesc')?.value?.trim() || '';

    const prompt = `You are a quiz generator for an educational platform. Create exactly 5 multiple-choice questions to test whether someone is qualified to TEACH the following course.

Course name: ${skill}
Category: ${cat}
Level: ${level}
Description: ${desc || 'No description provided.'}

Rules:
- Questions must be specific to THIS course topic, not generic.
- Each question must have exactly 4 options.
- Exactly one option must be correct.
- Questions should test genuine understanding appropriate for a ${level}-level teacher.
- Return ONLY valid JSON, no markdown, no explanation.

Return this exact JSON structure:
[
  {"q":"question text","a":"correct answer","opts":["option1","option2","option3","option4"]},
  ...5 items total
]`;

    const fallbackBank = {
      java: [
        { q: 'Which keyword is used to define a class in Java?', a: 'class', opts: ['class', 'define', 'struct', 'object'] },
        { q: 'What is the entry-point method signature in Java?', a: 'public static void main(String[] args)', opts: ['public static void main(String[] args)', 'void main()', 'static main(String args)', 'public void start()'] },
        { q: 'Which of these is NOT a primitive type in Java?', a: 'String', opts: ['int', 'boolean', 'String', 'char'] },
        { q: 'What does the "final" keyword do to a variable?', a: 'Makes it a constant (cannot be reassigned)', opts: ['Makes it a constant (cannot be reassigned)', 'Makes it global', 'Deletes it after use', 'Makes it thread-safe'] },
        { q: 'Which access modifier makes a member visible only within its class?', a: 'private', opts: ['public', 'protected', 'private', 'default'] },
        { q: 'What is the output of: System.out.println(10 % 3)?', a: '1', opts: ['3', '1', '0', '2'] },
        { q: 'Which Java keyword is used for inheritance?', a: 'extends', opts: ['implements', 'extends', 'inherits', 'super'] },
        { q: 'What does JVM stand for?', a: 'Java Virtual Machine', opts: ['Java Variable Method', 'Java Visual Machine', 'Java Virtual Machine', 'Java Verified Module'] },
        { q: 'Which collection maintains insertion order and allows duplicates?', a: 'ArrayList', opts: ['HashSet', 'TreeSet', 'ArrayList', 'HashMap'] },
        { q: 'What exception is thrown when dividing an integer by zero?', a: 'ArithmeticException', opts: ['NullPointerException', 'ArithmeticException', 'IndexOutOfBoundsException', 'IllegalArgumentException'] }
      ],
      python: [
        { q: 'What is the output of print(2 ** 3)?', a: '8', opts: ['6', '8', '9', '5'] },
        { q: 'Which keyword defines a function in Python?', a: 'def', opts: ['func', 'define', 'def', 'function'] },
        { q: 'What type does 3 / 2 return in Python 3?', a: 'float', opts: ['int', 'float', 'str', 'bool'] },
        { q: 'How do you start a single-line comment in Python?', a: '#', opts: ['//', '#', '--', '/*'] },
        { q: 'Which data structure uses key-value pairs in Python?', a: 'dict', opts: ['list', 'tuple', 'set', 'dict'] },
        { q: 'What does len([1, 2, 3]) return?', a: '3', opts: ['2', '3', '4', 'None'] },
        { q: 'Which keyword is used for exception handling in Python?', a: 'try', opts: ['catch', 'except', 'try', 'handle'] },
        { q: 'What is the correct way to create a virtual environment?', a: 'python -m venv env', opts: ['python -m venv env', 'pip install venv', 'venv create env', 'python create venv env'] },
        { q: 'What does the "self" parameter represent in a class method?', a: 'The instance of the class', opts: ['The class itself', 'The instance of the class', 'A global variable', 'The parent class'] },
        { q: 'Which built-in function converts a value to an integer?', a: 'int()', opts: ['integer()', 'int()', 'toInt()', 'Number()'] }
      ],
      html: [
        { q: 'What does HTML stand for?', a: 'HyperText Markup Language', opts: ['HyperText Markup Language', 'HighText Machine Language', 'HyperTool Multi Language', 'HyperTransfer Markup Language'] },
        { q: 'Which tag creates a hyperlink?', a: '<a>', opts: ['<link>', '<a>', '<href>', '<url>'] },
        { q: 'What attribute specifies the URL in an <a> tag?', a: 'href', opts: ['src', 'href', 'link', 'url'] },
        { q: 'Which HTML tag is used for the largest heading?', a: '<h1>', opts: ['<h6>', '<heading>', '<h1>', '<head>'] },
        { q: 'What tag embeds an image in HTML?', a: '<img>', opts: ['<image>', '<img>', '<pic>', '<src>'] },
        { q: 'Which attribute makes an input field required?', a: 'required', opts: ['mandatory', 'required', 'validate', 'nonempty'] },
        { q: 'What is the correct HTML tag for an unordered list?', a: '<ul>', opts: ['<list>', '<ol>', '<ul>', '<li>'] },
        { q: 'Which HTML element contains metadata about the document?', a: '<head>', opts: ['<meta>', '<top>', '<head>', '<info>'] },
        { q: 'What does the "alt" attribute in <img> provide?', a: 'Alternative text for accessibility', opts: ['Image alignment', 'Alternative text for accessibility', 'Image animation', 'Link target'] },
        { q: 'Which tag defines a table row?', a: '<tr>', opts: ['<td>', '<th>', '<tr>', '<row>'] }
      ],
      c: [
        { q: 'Which header file is required for printf() in C?', a: '#include <stdio.h>', opts: ['#include <stdlib.h>', '#include <stdio.h>', '#include <string.h>', '#include <math.h>'] },
        { q: 'What is the correct syntax to declare a pointer to int?', a: 'int *p;', opts: ['int &p;', 'pointer int p;', 'int *p;', 'int@ p;'] },
        { q: 'What does malloc() return?', a: 'A void pointer to the allocated memory', opts: ['An int', 'A void pointer to the allocated memory', 'NULL always', 'A char pointer'] },
        { q: 'What is the size of int on a 32-bit system (typically)?', a: '4 bytes', opts: ['2 bytes', '4 bytes', '8 bytes', '1 byte'] },
        { q: 'Which operator is used to access a struct member via a pointer?', a: '->', opts: ['.', '->', '::', '*'] },
        { q: 'What does the "const" keyword do to a variable?', a: 'Makes it read-only', opts: ['Makes it global', 'Makes it read-only', 'Allocates heap memory', 'Makes it static'] },
        { q: 'What is the output of printf("%d", 5 / 2) in C?', a: '2', opts: ['2.5', '2', '3', '0'] },
        { q: 'Which function is used to free dynamically allocated memory?', a: 'free()', opts: ['delete()', 'remove()', 'free()', 'dealloc()'] },
        { q: 'What does scanf() do?', a: 'Reads formatted input from stdin', opts: ['Prints formatted output', 'Reads formatted input from stdin', 'Scans files', 'Sorts arrays'] },
        { q: 'Which storage class makes a variable retain its value between function calls?', a: 'static', opts: ['extern', 'auto', 'static', 'register'] }
      ]
    };

    function getFallback(skillName) {
      const key = skillName.toLowerCase();
      if (key.includes('java') && !key.includes('javascript')) return fallbackBank.java;
      if (key.includes('python')) return fallbackBank.python;
      if (key.includes('html')) return fallbackBank.html;
      if (key.includes(' c ') || key === 'c' || key.startsWith('c ') || key.endsWith(' c') || key.includes('c programming') || key.includes('c language')) return fallbackBank.c;
      return null;
    }

    function pickRandom(arr, n) {
      const shuffled = [...arr].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, n);
    }

    let qs = null;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await res.json();
      const raw = data.content.map(b => b.text || '').join('').trim().replace(/```json|```/g, '');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 5) qs = parsed.slice(0, 5);
    } catch (err) { }

    if (!qs) {
      const bank = getFallback(skill);
      if (bank) {
        qs = pickRandom(bank, 5);
      } else {
        modal.innerHTML = `<div style='background:#fff;padding:28px 24px 20px;border-radius:18px;max-width:420px;width:100%;color:#333;text-align:center;border:2px solid rgba(116,148,236,0.2);box-shadow:0 8px 40px rgba(116,148,236,0.15);'>
          <div style='font-size:32px;margin-bottom:10px;'>⚠️</div>
          <h2 style='font-size:17px;font-weight:800;margin-bottom:8px;color:#333;'>Quiz Unavailable</h2>
          <p style='font-size:13px;color:#888;margin-bottom:18px;'>No quiz available for <b style="color:#7494ec">${skill}</b>. Try: Java, Python, HTML, or C.</p>
          <button onclick='document.getElementById("tutorTestModal").remove()' style='padding:10px 22px;border:none;border-radius:8px;background:linear-gradient(135deg,#7494ec,#4268d4);color:#fff;font-weight:700;font-size:14px;cursor:pointer;'>Close</button>
        </div>`;
        return;
      }
    }

    modal.innerHTML = `<div style='background:#fff;padding:28px 24px 20px;border-radius:18px;max-width:420px;width:100%;border:2px solid rgba(116,148,236,0.2);box-shadow:0 8px 40px rgba(116,148,236,0.15);'>
      <div style='display:flex;align-items:center;gap:10px;margin-bottom:16px;'>
        <div style='font-size:20px;'>🎓</div>
        <div>
          <h2 style='font-size:17px;font-weight:800;color:#333;margin:0;'>Tutor Quiz</h2>
          <div style='font-size:12px;color:#888;margin-top:2px;'>${skill} · ${level} · Score 70%+ to teach</div>
        </div>
      </div>
      <form id='ttForm' style='display:flex;flex-direction:column;gap:16px;'>
        ${qs.map((q, i) => `
        <div style='background:rgba(201,214,255,0.1);border:1px solid rgba(116,148,236,0.15);border-radius:10px;padding:14px;'>
          <div style='color:#333;font-size:13.5px;font-weight:600;margin-bottom:10px;line-height:1.5;'>${i + 1}. ${q.q}</div>
          <div style='display:flex;flex-direction:column;gap:6px;'>
            ${q.opts.map(o => `
            <label style='display:flex;align-items:center;gap:9px;color:#555;font-size:13px;cursor:pointer;padding:7px 10px;border-radius:7px;border:1px solid transparent;transition:all 0.15s;' onmouseover="this.style.background='rgba(116,148,236,0.06)';this.style.borderColor='rgba(116,148,236,0.2)'" onmouseout="this.style.background='transparent';this.style.borderColor='transparent'">
              <input type='radio' name='q${i}' value='${o}' required style='accent-color:#7494ec;width:14px;height:14px;flex-shrink:0;'>${o}
            </label>`).join('')}
          </div>
        </div>`).join('')}
        <button type='submit' style='padding:12px;border:none;border-radius:9px;background:linear-gradient(135deg,#7494ec,#4268d4);color:#fff;font-weight:700;font-size:14px;cursor:pointer;margin-top:2px;'>Submit Quiz →</button>
      </form>
    </div>`;

    document.getElementById('ttForm').onsubmit = function (ev) {
      ev.preventDefault();
      let correct = 0;
      for (let i = 0; i < qs.length; ++i) {
        const ch = document.querySelector(`input[name='q${i}']:checked`);
        if (ch && ch.value === qs[i].a) correct++;
      }
      const pct = Math.round((correct / qs.length) * 100), passed = pct >= 70;
      modal.remove();
      if (passed) {
        teachingSessions.push(session);
        const courseObj = {
          name: skill,
          teacher: currentUser ? currentUser.name : 'Unknown',
          teacherEmail: currentUser ? currentUser.email : 'unknown@skillcycle.com',
          rating: 4.8,
          cat: session.cat,
          level: session.level,
          price: parseInt(session.price) || 0,
          desc: `A ${session.level.toLowerCase()} ${session.cat.toLowerCase()} course taught by ${currentUser ? currentUser.name : 'Unknown'}.`,
          demoVideo: session.demoVideo ? `file:${session.demoVideo}` : null,
          sessions: [{
            num: 1,
            title: skill,
            date: new Date().toLocaleDateString(),
            status: 'pending'
          }]
        };
        saveTeachingToCourses(courseObj, currentUser ? currentUser.email : 'unknown@skillcycle.com');
        renderOfferings();
        showTeachEligibleDialogue(skill, pct, correct, qs.length);
      } else {
        showQuizFailedDialogue(skill, pct, correct, qs.length);
      }
    };
  }

  function showTeachEligibleDialogue(skill, pct, correct, total) {
    const wrap = document.createElement('div');
    wrap.className = 'dialogue-overlay';
    wrap.innerHTML = `
    <div class="dialogue-box">
      <div class="dialogue-ring ring-pink">🎓</div>
      <h2>You're Eligible!</h2>
      <p>You passed the quiz for</p>
      <div class="dialogue-highlight-pink">${skill}</div>
      <div class="dialogue-score">Score: ${pct}% · ${correct}/${total} correct</div>
      <div class="progress-bar-wrap"><div class="progress-bar pink"></div></div>
      <div class="dialogue-note">Redirecting to My Teaching…</div>
    </div>`;
    document.getElementById('appWrap').appendChild(wrap);
    setTimeout(() => {
      wrap.remove();
      goPage('home');
      switchLT('teach');
      document.getElementById('pg-home').scrollTop = 0;
    }, 2700);
  }

  function showQuizFailedDialogue(skill, pct, correct, total) {
    const wrap = document.createElement('div');
    wrap.className = 'dialogue-overlay';
    wrap.innerHTML = `
    <div class="dialogue-box">
      <div class="dialogue-ring ring-red">✕</div>
      <h2>Not Quite!</h2>
      <p>You need at least <b style="color:#333">70%</b> to teach <span style="color:#ff6b6b">${skill}</span>.</p>
      <div style="font-size:22px;font-weight:800;color:#ff6b6b;margin:10px 0 4px;">${pct}%</div>
      <div style="font-size:13px;color:var(--sub);margin-bottom:22px;">${correct}/${total} correct · Try again after reviewing the material</div>
      <button onclick="this.closest('.dialogue-overlay').remove()" style="padding:11px 28px;border:none;border-radius:9px;background:rgba(255,107,107,0.1);border:1px solid rgba(255,107,107,0.3);color:#ff6b6b;font-size:14px;font-weight:700;cursor:pointer;">Got it</button>
    </div>`;
    document.getElementById('appWrap').appendChild(wrap);
  }
