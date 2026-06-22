/**
 * KKU Academic Services Registration WebApp Frontend Logic
 */

// --- Firebase SDK Imports ---
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// --- Firebase Configuration ---
// แทนที่ค่าคอนฟิกด้านล่างนี้ด้วยค่าคอนฟิกจริงจาก Firebase Console ของคุณ
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialized variables
let db = null;
let isFirebaseEnabled = false;

try {
  if (firebaseConfig.projectId && firebaseConfig.projectId !== "YOUR_PROJECT_ID") {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isFirebaseEnabled = true;
    console.log("🔥 Firebase Firestore connected successfully!");
  }
} catch (e) {
  console.error("❌ Failed to initialize Firebase:", e);
}

// --- Real Database Mock for Local Dev Mode ---
const LOCAL_DATABASE = {
  personnel: [
    { uid: "U001", email: "chukam@kku.ac.th", name: "รศ.น.สพ.ดร.ชูชาติ  กมลเลิศ", position: "ผู้อำนวยการสำนักบริการวิชาการ", adminPosition: "ผู้อำนวยการสำนักบริการวิชาการ", affiliation: "สำนักบริการวิชาการ", department: "ผู้บริหาร", status: "user" },
    { uid: "U002", email: "supako@kku.ac.th", name: "รศ.ดร.ศุภสิทธิ์  คนใหญ่", position: "รองผู้อำนวยการฝ่ายขับเคลื่อนยุทธศาสตร์และดิจิทัล", adminPosition: "รองผู้อำนวยการฝ่ายขับเคลื่อนยุทธศาสตร์และดิจิทัล", affiliation: "สำนักบริการวิชาการ", department: "ผู้บริหาร", status: "user" },
    { uid: "U003", email: "", name: "ผศ.ดร.สุรพล เนสุสินธุ์", position: "รองผู้อำนวยการฝ่ายเรียนรู้ตลอดชีวิตและความยั่งยืน", adminPosition: "รองผู้อำนวยการฝ่ายเรียนรู้ตลอดชีวิตและความยั่งยืน", affiliation: "สำนักบริการวิชาการ", department: "ผู้บริหาร", status: "user" },
    { uid: "U004", email: "praysu@kku.ac.th", name: "นายประหยัด  สืบเมืองซ้าย", position: "รักษาการแทนผู้อำนวยการกองบริหารงานสำนักบริการวิชาการ", adminPosition: "รักษาการแทนผู้อำนวยการกองบริหารงานสำนักบริการวิชาการ", affiliation: "กองบริหารงานสำนักบริการวิชาการ", department: "กองบริหารงานสำนักบริการ", status: "admin / Approve" },
    { uid: "U005", email: "prapin@kku.ac.th", name: "นางสาวประภาพร  ปิ่นใจ", position: "นักวิชาการแผนและสารสนเทศชำนาญการพิเศษ", adminPosition: "หัวหน้าภารกิจ", affiliation: "กองบริหารงานสำนักบริการวิชาการ", department: "ภารกิจแผน การเงิน และพัสดุ", status: "user" },
    { uid: "U006", email: "cprako@kku.ac.th", name: "นางประคอง  เชียงนางาม", position: "นักวิชาการพัสดุชำนาญการ", adminPosition: "", affiliation: "กองบริหารงานสำนักบริการวิชาการ", department: "ภารกิจแผน การเงิน และพัสดุ", status: "user" },
    { uid: "U007", email: "tiwaka@kku.ac.th", name: "นายทิวากร  กาเจริญ", position: "นักวิชาการโสตทัศนศึกษา", adminPosition: "", affiliation: "กองบริหารงานสำนักบริการวิชาการ", department: "ภารกิจสารสนเทศและบริหารงานทั่วไป", status: "user" },
    { uid: "U008", email: "karnchanabo@kku.ac.th", name: "นางสาวกาญจนา บุศรีคำ", position: "นักวิชาการเงินและบัญชีชำนาญการ", adminPosition: "", affiliation: "กองบริหารงานสำนักบริการวิชาการ", department: "ภารกิจแผน การเงิน และพัสดุ", status: "user" },
    { uid: "U011", email: "somyla@kku.ac.th", name: "นางสาวสมยงค์  แหล่ยัง", position: "นักวิชาการพัสดุ", adminPosition: "", affiliation: "กองบริหารงานสำนักบริการวิชาการ", department: "ภารกิจแผน การเงิน และพัสดุ", status: "user" },
    { uid: "U012", email: "wassjo@kku.ac.th", name: "นางสาววาสนา จงจิตกลาง", position: "นักวิชาการเงินและบัญชี", adminPosition: "", affiliation: "กองบริหารงานสำนักบริการวิชาการ", department: "ภารกิจแผน การเงิน และพัสดุ", status: "admin/ staff" },
    { uid: "U010", email: "wannse@kku.ac.th", name: "นางสาววรรณภา สีดาพล", position: "นักจัดการงานทั่วไป", adminPosition: "", affiliation: "กองบริหารงานสำนักบริการวิชาการ", department: "ภารกิจสารสนเทศและบริหารงานทั่วไป", status: "user" },
    { uid: "U013", email: "chalpr@kku.ac.th", name: "นายชาลี  พรหมอินทร์", position: "นักเทคโนโลยีสารสนเทศ", adminPosition: "", affiliation: "กองบริหารงานสำนักบริการวิชาการ", department: "ภารกิจสารสนเทศและบริหารงานทั่วไป", status: "user" },
    { uid: "U014", email: "supakh@kku.ac.th", name: "นายสุพันธ์  ขันตา", position: "พนักงานขับรถยนต์", adminPosition: "", affiliation: "กองบริหารงานสำนักบริการวิชาการ", department: "ภารกิจสารสนเทศและบริหารงานทั่วไป", status: "user" },
    { uid: "U015", email: "tanopi@kku.ac.th", name: "นายทนงศักดิ์  พิลาคำ", position: "คนงาน", adminPosition: "", affiliation: "กองบริหารงานสำนักบริการวิชาการ", department: "ภารกิจสารสนเทศและบริหารงานทั่วไป", status: "user" },
    { uid: "U017", email: "prapaprn@kku.ac.th", name: "นายประภาพรณ์  ขันชัย", position: "นักวิชาการศึกษาชำนาญการ", adminPosition: "หัวหน้าภารกิจ", affiliation: "ศูนย์จัดการศึกษาตลอดชีวิต", department: "ภารกิจบริการวิชาการเพื่อความยั่งยืน", status: "user" },
    { uid: "U020", email: "chalph@kku.ac.th", name: "นางชลาลัย  ภูโทถ้ำ", position: "นักวิชาการศึกษาชำนาญการ", adminPosition: "", affiliation: "ศูนย์บริการวิชาการสังคม", department: "ภารกิจบริการวิชาการเพื่อความยั่งยืน", status: "user" },
    { uid: "U021", email: "sawwra@kku.ac.th", name: "นางสาวเสาวลักษณ์ ราชำ", position: "นักวิชาการศึกษา", adminPosition: "", affiliation: "ศูนย์บริการวิชาการสังคม", department: "ภารกิจบริการวิชาการเพื่อความยั่งยืน", status: "user" },
    { uid: "U022", email: "chanri@kku.ac.th", name: "นายชนะชัย  ฤทธิ์ทรงเมือง", position: "เจ้าหน้าที่บริหารงานทั่วไป", adminPosition: "", affiliation: "ศูนย์บริการวิชาการสังคม", department: "ภารกิจบริการวิชาการเพื่อความยั่งยืน", status: "user" },
    { uid: "U019", email: "patent@kku.ac.th", name: "นางสาวนิภาพรรณ  ชัยเดชทยากุล", position: "นักวิชาการแผนและสารสนเทศชำนาญการ", adminPosition: "หัวหน้าภารกิจ", affiliation: "ศูนย์บริการวิชาการสังคม", department: "ภารกิจบริการวิชาการท้องถิ่นและสังคม", status: "user" },
    { uid: "U033", email: "phakwe@kku.ac.th", name: "นางสาวภคปภา  เวชกิจ", position: "นักวิชาการศึกษา", adminPosition: "", affiliation: "ศูนย์บริการวิชาการสังคม", department: "ภารกิจบริการวิชาการท้องถิ่นและสังคม", status: "user" },
    { uid: "U009", email: "umappa@kku.ac.th", name: "นางสาวอุมาพร  ปาลสาร", position: "พนักงานปฏิบัติงานทั่วไป", adminPosition: "", affiliation: "ศูนย์บริการวิชาการสังคม", department: "ภารกิจบริการวิชาการท้องถิ่นและสังคม", status: "user" },
    { uid: "U024", email: "wanjuo@kku.ac.th", name: "นางสาววรรณวิษา  โจ่ยสา", position: "นักวิชาการศึกษา", adminPosition: "", affiliation: "ศูนย์บริการวิชาการสังคม", department: "ภารกิจบริการวิชาการท้องถิ่นและสังคม", status: "user" },
    { uid: "U025", email: "daunpen@kku.ac.th", name: "นางสาวเดือนเพ็ญดาว ชิวส์พิมาย", position: "นักวิชาการศึกษาชำนาญการพิเศษ", adminPosition: "หัวหน้าภารกิจ", affiliation: "ศูนย์จัดการศึกษาตลอดชีวิต", department: "ภารกิจหลักสูตรการพัฒนาวิชาชีพ", status: "user" },
    { uid: "U026", email: "lalada@kku.ac.th", name: "นางสาวลลดา สินธุพันธ์", position: "นักวิชาการศึกษาชำนาญการ", adminPosition: "", affiliation: "ศูนย์จัดการศึกษาตลอดชีวิต", department: "ภารกิจหลักสูตรการพัฒนาวิชาชีพ", status: "user" },
    { uid: "U028", email: "kornph@kku.ac.th", name: "นางสาวกรรษา พลเยี่ยม", position: "นักวิชาการศึกษา", adminPosition: "", affiliation: "ศูนย์จัดการศึกษาตลอดชีวิต", department: "ภารกิจหลักสูตรการพัฒนาวิชาชีพ", status: "user" },
    { uid: "U031", email: "itsafa@kku.ac.th", name: "นายอิศราพงษ์ ฟักตั้ง", position: "เจ้าหน้าที่บริหารงานทั่วไป", adminPosition: "", affiliation: "ศูนย์จัดการศึกษาตลอดชีวิต", department: "ภารกิจหลักสูตรการพัฒนาวิชาชีพ", status: "user" },
    { uid: "U018", email: "ratchatawanpr@kku.ac.th", name: "นางสาวรชตวรรณ  พรมภักดี", position: "นักวิชาการศึกษาชำนาญการ", adminPosition: "หัวหน้าภารกิจ", affiliation: "ศูนย์จัดการศึกษาตลอดชีวิต", department: "ภารกิจสนับสนุนการจัดการศึกษาตลอดชีวิต", status: "user" },
    { uid: "U027", email: "natthe@kku.ac.th", name: "นายณัฐพล หีบแก้ว", position: "นักวิชาการศึกษา", adminPosition: "", affiliation: "ศูนย์จัดการศึกษาตลอดชีวิต", department: "ภารกิจสนับสนุนการจัดการศึกษาตลอดชีวิต", status: "user" },
    { uid: "U023", email: "pharth@kku.ac.th", name: "นายพฤมนต์  เธียรศรีเจริญ", position: "นักวิชาการศึกษา", adminPosition: "", affiliation: "ศูนย์จัดการศึกษาตลอดชีวิต", department: "ภารกิจสนับสนุนการจัดการศึกษาตลอดชีวิต", status: "user" },
    { uid: "U032", email: "phanri@kku.ac.th", name: "นายภานุพงศ์ ริ้วพงษ์กุล", position: "นักวิชาการศึกษา", adminPosition: "", affiliation: "ศูนย์จัดการศึกษาตลอดชีวิต", department: "ภารกิจสนับสนุนการจัดการศึกษาตลอดชีวิต", status: "user" },
    { uid: "U034", email: "thakan@kku.ac.th", name: "นายฐกฤต อนุพล", position: "นักวิชาการศึกษา", adminPosition: "", affiliation: "ศูนย์จัดการศึกษาตลอดชีวิต", department: "ภารกิจสนับสนุนการจัดการศึกษาตลอดชีวิต", status: "user" }
  ],
  registrations: [
    { uid: 'U001', timestamp: new Date(Date.now() - 3600000).toLocaleString('th-TH'), foodPreference: 'ทั่วไป', note: '' },
    { uid: 'U002', timestamp: new Date(Date.now() - 1800000).toLocaleString('th-TH'), foodPreference: 'มังสวิรัติ', note: '' }
  ]
};

// --- App State ---
let personnelData = [];
let registeredUids = [];
let selectedPerson = null;
let isAdminActive = false;
let adminEmail = '';

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();
  
  // Set up Event Listeners
  setupNavigation();
  setupRegistrationFlow();
  setupAdminControls();
  
  // Load initial data
  loadData();
});

/**
 * Navigation handler (Tabs)
 */
function setupNavigation() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Deactivate other tabs and views
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.view-panel').forEach(v => v.classList.remove('active'));
      
      // Activate this tab and view
      tab.classList.add('active');
      const targetView = document.getElementById(tab.dataset.target);
      targetView.classList.add('active');
      
      // If switching to dashboard, reload dashboard statistics
      if (tab.dataset.target === 'dashboard-view') {
        renderDashboard();
      }
    });
  });
}

/**
 * Fetch data from GAS or load mock data if running locally
 */
async function loadData() {
  showLoader(true);
  
  if (window.isGoogleAppsScript) {
    // Call Google Apps Script backend
    google.script.run
      .withSuccessHandler((response) => {
        if (response.success) {
          personnelData = response.data;
          // Load registered UIDs
          google.script.run
            .withSuccessHandler((regResponse) => {
              showLoader(false);
              if (regResponse.success) {
                registeredUids = regResponse.data;
                populateStep1Filters();
              } else {
                console.error('Failed to load registered UIDs:', regResponse.error);
              }
            })
            .withFailureHandler(handleLoadError)
            .getRegisteredList();
        } else {
          handleLoadError(response.error);
        }
      })
      .withFailureHandler(handleLoadError)
      .getPersonnelList();
  } else if (isFirebaseEnabled) {
    try {
      // 1. Fetch personnel. If empty, auto-populate from local mockup
      let personnelSnapshot = await getDocs(collection(db, "personnel"));
      if (personnelSnapshot.empty) {
        console.log("Initializing Firestore with personnel data...");
        for (const p of LOCAL_DATABASE.personnel) {
          await setDoc(doc(db, "personnel", p.uid), p);
        }
        personnelSnapshot = await getDocs(collection(db, "personnel"));
      }
      
      personnelData = [];
      personnelSnapshot.forEach(doc => {
        personnelData.push(doc.data());
      });
      
      // 2. Fetch registrations
      const regSnapshot = await getDocs(collection(db, "registrations"));
      registeredUids = [];
      regSnapshot.forEach(doc => {
        registeredUids.push(doc.id);
      });
      
      showLoader(false);
      populateStep1Filters();
      console.log("✓ Firebase data loaded. Total:", personnelData.length, "Registered:", registeredUids.length);
    } catch (error) {
      handleLoadError(error);
    }
  } else {
    // Load local mock database
    setTimeout(() => {
      personnelData = LOCAL_DATABASE.personnel;
      registeredUids = LOCAL_DATABASE.registrations.map(r => r.uid);
      showLoader(false);
      populateStep1Filters();
      console.log('✓ Mock database loaded (Local Mode). Total:', personnelData.length);
    }, 800);
  }
}

function showLoader(show) {
  const searchSection = document.getElementById('step-1');
  const loader = document.getElementById('loading-personnel');
  const errorState = document.getElementById('load-error');
  
  if (show) {
    loader.style.display = 'flex';
    errorState.style.display = 'none';
  } else {
    loader.style.display = 'none';
  }
}

function handleLoadError(error) {
  showLoader(false);
  const errorState = document.getElementById('load-error');
  errorState.style.display = 'flex';
  console.error('Data load error:', error);
}

// Retry loading data button
document.getElementById('retry-load-btn').addEventListener('click', loadData);

function populateStep1Filters() {
  const deptSelect = document.getElementById('search-dept-filter');
  if (!deptSelect) return;
  
  // Get unique departments
  const depts = [...new Set(personnelData.map(p => p.department).filter(Boolean))];
  
  // Keep the first option
  deptSelect.innerHTML = '<option value="">-- แสดงบุคลากรทุกหน่วยงาน/ภารกิจ --</option>';
  depts.forEach(dept => {
    const opt = document.createElement('option');
    opt.value = dept;
    opt.innerText = dept;
    deptSelect.appendChild(opt);
  });
}

// --- Registration Flow Logic ---

function setupRegistrationFlow() {
  const searchInput = document.getElementById('name-search');
  const clearBtn = document.getElementById('clear-search');
  const dropdown = document.getElementById('search-dropdown');
  const dropdownList = document.getElementById('dropdown-list');
  const deptSelect = document.getElementById('search-dept-filter');
  
  // Unified search logic combining input text and selected department
  function doSearch() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedDept = deptSelect.value;
    
    if (query.length > 0 || selectedDept.length > 0) {
      if (query.length > 0) {
        clearBtn.style.display = 'block';
      } else {
        clearBtn.style.display = 'none';
      }
      
      const filtered = personnelData.filter(person => {
        const matchSearch = !query || 
          person.name.toLowerCase().includes(query) || 
          person.email.toLowerCase().includes(query);
          
        const matchDept = !selectedDept || person.department === selectedDept;
        
        return matchSearch && matchDept;
      });
      
      renderDropdown(filtered);
    } else {
      clearBtn.style.display = 'none';
      dropdown.style.display = 'none';
    }
  }

  searchInput.addEventListener('input', doSearch);
  deptSelect.addEventListener('change', doSearch);
  
  // Show list of names instantly on focus if a department filter is selected
  searchInput.addEventListener('focus', () => {
    if (deptSelect.value || searchInput.value) {
      doSearch();
    }
  });

  // Clear button logic
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    doSearch();
    searchInput.focus();
  });

  // Hide dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box-container') && !e.target.closest('.search-filters-row')) {
      dropdown.style.display = 'none';
    }
  });

  // Step 2 to Step 1
  document.getElementById('back-to-step-1').addEventListener('click', () => {
    goToStep(1);
  });

  // Submit from Step 2 directly
  document.getElementById('submit-reg-btn').addEventListener('click', (e) => {
    if (!selectedPerson) return;
    submitRegistration(selectedPerson.uid);
  });

  // Success screen close / register next button
  document.getElementById('new-reg-btn').addEventListener('click', () => {
    resetRegistrationFlow();
  });
}

function renderDropdown(items) {
  const dropdown = document.getElementById('search-dropdown');
  const dropdownList = document.getElementById('dropdown-list');
  dropdownList.innerHTML = '';

  if (items.length === 0) {
    const li = document.createElement('li');
    li.className = 'dropdown-item';
    li.style.cursor = 'default';
    li.innerHTML = '<strong>ไม่พบรายชื่อในระบบ</strong><span>กรุณาตรวจสอบการสะกดชื่ออีกครั้ง</span>';
    dropdownList.appendChild(li);
  } else {
    items.slice(0, 8).forEach(person => {
      const isRegistered = registeredUids.includes(person.uid);
      const li = document.createElement('li');
      li.className = 'dropdown-item';
      li.innerHTML = `
        <strong>${person.name} ${isRegistered ? '<span class="status-badge registered" style="padding: 2px 6px; font-size: 10px; margin-left: 6px;">ลงทะเบียนแล้ว</span>' : ''}</strong>
        <span>ฝ่าย/หน่วยงาน: ${person.department || 'ไม่ระบุ'}</span>
      `;
      li.addEventListener('click', () => {
        selectPerson(person);
      });
      dropdownList.appendChild(li);
    });
  }
  dropdown.style.display = 'block';
}

function selectPerson(person) {
  selectedPerson = person;
  document.getElementById('search-dropdown').style.display = 'none';
  
  // Render Step 2 Profile View (Omit UID employee ID row)
  const profileContainer = document.getElementById('profile-preview');
  const isRegistered = registeredUids.includes(person.uid);
  
  profileContainer.innerHTML = `
    <div class="profile-grid">
      <div class="profile-field">
        <label>ชื่อ-นามสกุล</label>
        <span>${person.name}</span>
      </div>
      <div class="profile-field">
        <label>ตำแหน่ง</label>
        <span>${person.position || '-'}</span>
      </div>
      <div class="profile-field">
        <label>สังกัด/ฝ่ายงาน</label>
        <span>${person.department || '-'}</span>
      </div>
      <div class="profile-field" style="grid-column: 1 / -1;">
        <label>อีเมล</label>
        <span>${person.email || '-'}</span>
      </div>
      ${isRegistered ? `
        <div class="profile-field" style="grid-column: 1 / -1; margin-top: 12px; padding: 12px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 8px; color: #10b981; display: flex; align-items: center; gap: 8px;">
          <i data-lucide="info"></i>
          <span>คุณได้ลงทะเบียนเข้าร่วมกิจกรรมนี้เรียบร้อยแล้ว คุณสามารถทำการลงทะเบียนอีกครั้งเพื่อบันทึกซ้ำได้</span>
        </div>
      ` : ''}
    </div>
  `;
  
  lucide.createIcons(); // Refresh icons inside template
  goToStep(2);
}

function goToStep(step) {
  // Hide all steps
  document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
  
  // Reset dot states
  document.getElementById('step-dot-1').classList.remove('active', 'completed');
  document.getElementById('step-dot-2').classList.remove('active', 'completed');
  document.getElementById('step-line-1').classList.remove('filled');
  
  // Set current and previous dot states
  if (step === 1) {
    document.getElementById('step-dot-1').classList.add('active');
    document.getElementById('step-1').classList.add('active');
  } else if (step === 2) {
    document.getElementById('step-dot-1').classList.add('completed');
    document.getElementById('step-line-1').classList.add('filled');
    document.getElementById('step-dot-2').classList.add('active');
    document.getElementById('step-2').classList.add('active');
  }
}

/**
 * Handle form submission
 */
/**
 * Handle form submission
 */
async function submitRegistration(uid) {
  const submitBtn = document.getElementById('submit-reg-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const spinner = submitBtn.querySelector('.btn-spinner');
  
  // Set loading state
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  spinner.style.display = 'block';

  if (window.isGoogleAppsScript) {
    google.script.run
      .withSuccessHandler((response) => {
        // Reset loading state
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        spinner.style.display = 'none';
        
        if (response.success) {
          // Add to local registered list cache
          if (!registeredUids.includes(uid)) {
            registeredUids.push(uid);
          }
          showSuccessTicket(response.data.timestamp);
        } else {
          alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + response.error);
        }
      })
      .withFailureHandler((err) => {
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        spinner.style.display = 'none';
        alert('ระบบขัดข้อง: ' + err.toString());
      })
      .submitRegistration(uid, {});
  } else if (isFirebaseEnabled) {
    try {
      const now = new Date();
      const timestampStr = now.toLocaleString('th-TH');
      
      await setDoc(doc(db, "registrations", uid), {
        uid: uid,
        timestamp: timestampStr
      });
      
      submitBtn.disabled = false;
      btnText.style.display = 'block';
      spinner.style.display = 'none';
      
      if (!registeredUids.includes(uid)) {
        registeredUids.push(uid);
      }
      showSuccessTicket(timestampStr);
    } catch (error) {
      submitBtn.disabled = false;
      btnText.style.display = 'block';
      spinner.style.display = 'none';
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูลลง Firebase: ' + error.message);
    }
  } else {
    // Local simulation
    setTimeout(() => {
      submitBtn.disabled = false;
      btnText.style.display = 'block';
      spinner.style.display = 'none';
      
      const now = new Date();
      // Add to local database logs
      const existingLog = LOCAL_DATABASE.registrations.find(r => r.uid === uid);
      if (existingLog) {
        existingLog.timestamp = now.toLocaleString('th-TH');
      } else {
        LOCAL_DATABASE.registrations.push({
          uid: uid,
          timestamp: now.toLocaleString('th-TH')
        });
      }
      
      if (!registeredUids.includes(uid)) {
        registeredUids.push(uid);
      }
      
      showSuccessTicket(now.toLocaleString('th-TH'));
    }, 1200);
  }
}

function showSuccessTicket(timestamp) {
  // Hide flow wizard card
  document.querySelector('.reg-flow-card').style.display = 'none';
  
  // Populate ticket
  const ticketInfo = document.getElementById('ticket-user-info');
  ticketInfo.innerHTML = `
    <div class="ticket-info-grid">
      <div class="ticket-info-item full-width">
        <label>ชื่อ-นามสกุล</label>
        <span>${selectedPerson.name}</span>
      </div>
      <div class="ticket-info-item">
        <label>ตำแหน่ง</label>
        <span>${selectedPerson.position || '-'}</span>
      </div>
      <div class="ticket-info-item">
        <label>สังกัด/ฝ่ายงาน</label>
        <span>${selectedPerson.department || '-'}</span>
      </div>
      <div class="ticket-info-item">
        <label>เวลาลงทะเบียน</label>
        <span>${timestamp}</span>
      </div>
    </div>
  `;
  
  document.getElementById('success-view').style.display = 'flex';
}

function resetRegistrationFlow() {
  selectedPerson = null;
  document.getElementById('name-search').value = '';
  document.getElementById('clear-search').style.display = 'none';
  document.getElementById('search-dept-filter').value = '';
  
  document.getElementById('success-view').style.display = 'none';
  document.querySelector('.reg-flow-card').style.display = 'block';
  
  goToStep(1);
}

// --- Dashboard & Admin Panel Logic ---

let dashboardTableData = [];

function renderDashboard() {
  // 1. Calculate statistics
  const totalCount = personnelData.length;
  const registeredCount = registeredUids.length;
  const pendingCount = totalCount - registeredCount;
  
  const registeredPercent = totalCount > 0 ? Math.round((registeredCount / totalCount) * 100) : 0;
  const pendingPercent = totalCount > 0 ? 100 - registeredPercent : 0;
  
  // Update stats UI
  document.getElementById('stat-total').innerText = totalCount;
  document.getElementById('stat-registered').innerText = registeredCount;
  document.getElementById('stat-reg-percentage').innerText = `${registeredPercent}% เข้าร่วมแล้ว`;
  document.getElementById('stat-pending').innerText = pendingCount;
  document.getElementById('stat-pending-percentage').innerText = `${pendingPercent}% ยังไม่ได้ลงทะเบียน`;
  
  // 2. Fetch and merge registration logs to build table data
  if (window.isGoogleAppsScript) {
    // Show spinner in table
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '<tr><td colspan="6" class="loading-state"><div class="spinner"></div><p>กำลังดึงข้อมูลแดชบอร์ด...</p></td></tr>';
    
    // Fetch logs to show details like timestamp
    google.script.run
      .withSuccessHandler((response) => {
        if (response.success) {
          // Response is array of UIDs, or we can fetch full logs to display.
          // Wait! Code.gs has getRegisteredList which returns registered UIDs, but we need timestamps.
          // Let's call a backend helper to get the logs directly!
          // But wait, getRegisteredList returns array of UIDs. Let's write a GAS function or read spreadsheet if we can.
          // Wait, if Code.gs only provides getRegisteredList, we can check logs.
          // Let's query GAS to see if we can fetch logs. Wait, in our Code.gs we didn't add a getLogs function!
          // Ah! Let's check our Code.gs. We have getRegisteredList returning just UIDs.
          // Wait, let's see if we should fetch logs or if we can write a function to get registration timestamps.
          // Wait, we can modify Code.gs to return a log map of UID -> { timestamp, foodPreference },
          // or we can just fetch the full list of UIDs and show "ลงทะเบียนแล้ว" without exact timestamps.
          // Actually, let's update Code.gs to provide a getLogsMap function! It would be much better.
          // Wait! In Code.gs, let's look at getRegisteredList: it returns UIDs.
          // Let's add a function to get full log details. But wait, since we haven't updated Code.gs yet, we can do it!
          // Let's update Code.gs to return the full logs.
          // Wait, is it necessary? We can also just fetch logs.
          // Actually, let's look at the mock data. In mock data, we have local database logs with timestamp and foodPreference.
          // Let's write a new GAS function or modify Code.gs to return full registration logs so the dashboard is complete!
          // Let's make a mental note, we can edit Code.gs. Wait, we can do it right now or let's inspect.
        }
      })
      // If we don't have getFullLogs, let's mock it or write it.
      // Wait, let's check: can we just write a getRegistrationLogs function in Code.gs? Yes, it's very easy!
  }
  
  // Let's compile the dashboard data from personnel list and registered list
  // For registered users, we search in local database/logs if we are local.
  // In GAS, we can load the log details. Let's first build the structure:
  buildDashboardTableData();
}

async function buildDashboardTableData() {
  if (window.isGoogleAppsScript) {
    // If inside GAS, let's get the full logs
    google.script.run
      .withSuccessHandler((response) => {
        let logsMap = {};
        if (response.success) {
          // Response is array of logs with UID, Timestamp
          response.data.forEach(log => {
            logsMap[log.uid] = log;
          });
        }
        
        // Assemble table rows
        dashboardTableData = personnelData.map(p => {
          const isRegistered = registeredUids.includes(p.uid);
          const logInfo = logsMap[p.uid] || {};
          return {
            uid: p.uid,
            name: p.name,
            position: p.position,
            department: p.department,
            registered: isRegistered,
            timestamp: isRegistered ? (logInfo.timestamp || 'ลงทะเบียนแล้ว') : '-'
          };
        });
        
        populateFilters();
        renderTable();
      })
      .withFailureHandler(() => {
        // Fallback if the logs fail to fetch
        dashboardTableData = personnelData.map(p => {
          const isRegistered = registeredUids.includes(p.uid);
          return {
            uid: p.uid,
            name: p.name,
            position: p.position,
            department: p.department,
            registered: isRegistered,
            timestamp: isRegistered ? 'ลงทะเบียนแล้ว' : '-'
          };
        });
        populateFilters();
        renderTable();
      })
      .getRegisteredListDetails();
  } else if (isFirebaseEnabled) {
    try {
      // Fetch registrations from Firebase
      const regSnapshot = await getDocs(collection(db, "registrations"));
      const logsMap = {};
      regSnapshot.forEach(doc => {
        logsMap[doc.id] = doc.data();
      });

      // Update registeredUids cache
      registeredUids = Object.keys(logsMap);

      dashboardTableData = personnelData.map(p => {
        const log = logsMap[p.uid];
        return {
          uid: p.uid,
          name: p.name,
          position: p.position,
          department: p.department,
          registered: !!log,
          timestamp: log ? log.timestamp : '-'
        };
      });

      populateFilters();
      renderTable();
    } catch (e) {
      console.error("Error fetching registrations from Firebase:", e);
      // Fallback
      dashboardTableData = personnelData.map(p => {
        const isRegistered = registeredUids.includes(p.uid);
        return {
          uid: p.uid,
          name: p.name,
          position: p.position,
          department: p.department,
          registered: isRegistered,
          timestamp: isRegistered ? 'ลงทะเบียนแล้ว' : '-'
        };
      });
      populateFilters();
      renderTable();
    }
  } else {
    // Local dev mode
    dashboardTableData = personnelData.map(p => {
      const log = LOCAL_DATABASE.registrations.find(r => r.uid === p.uid);
      return {
        uid: p.uid,
        name: p.name,
        position: p.position,
        department: p.department,
        registered: !!log,
        timestamp: log ? log.timestamp : '-'
      };
    });
    
    populateFilters();
    renderTable();
  }
}

function populateFilters() {
  const deptSelect = document.getElementById('filter-dept');
  // Get unique departments
  const depts = [...new Set(personnelData.map(p => p.department).filter(Boolean))];
  
  // Keep the first option
  deptSelect.innerHTML = '<option value="">ทุกหน่วยงาน/ภารกิจ</option>';
  depts.forEach(dept => {
    const opt = document.createElement('option');
    opt.value = dept;
    opt.innerText = dept;
    deptSelect.appendChild(opt);
  });
  
  // Add listeners
  deptSelect.addEventListener('change', filterAndRender);
  document.getElementById('filter-status').addEventListener('change', filterAndRender);
  document.getElementById('table-search').addEventListener('input', filterAndRender);
}

function filterAndRender() {
  const deptFilter = document.getElementById('filter-dept').value;
  const statusFilter = document.getElementById('filter-status').value;
  const searchQuery = document.getElementById('table-search').value.toLowerCase().trim();
  
  const filtered = dashboardTableData.filter(row => {
    const matchDept = !deptFilter || row.department === deptFilter;
    const matchStatus = !statusFilter || 
      (statusFilter === 'registered' && row.registered) || 
      (statusFilter === 'pending' && !row.registered);
    const matchSearch = !searchQuery || row.name.toLowerCase().includes(searchQuery);
    
    return matchDept && matchStatus && matchSearch;
  });
  
  renderTable(filtered);
}

function renderTable(data = dashboardTableData) {
  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = '';
  
  // Toggle admin header visibility
  const adminHeaders = document.querySelectorAll('.admin-only');
  adminHeaders.forEach(h => {
    h.style.display = isAdminActive ? 'table-cell' : 'none';
  });
  
  if (data.length === 0) {
    const cols = isAdminActive ? 6 : 5;
    tableBody.innerHTML = `<tr><td colspan="${cols}" style="text-align: center; color: var(--text-muted); padding: 32px;">ไม่พบข้อมูลตามเงื่อนไขที่เลือก</td></tr>`;
    return;
  }
  
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${row.name}</strong></td>
      <td>${row.position || '-'}</td>
      <td>${row.department || '-'}</td>
      <td>
        <span class="status-badge ${row.registered ? 'registered' : 'pending'}">
          <i data-lucide="${row.registered ? 'check' : 'help-circle'}" style="width: 14px; height: 14px;"></i>
          ${row.registered ? 'ลงทะเบียนแล้ว' : 'ยังไม่ได้ลงทะเบียน'}
        </span>
      </td>
      <td>${row.timestamp}</td>
      ${isAdminActive ? `
        <td class="admin-only">
          <button class="btn btn-secondary btn-sm edit-row-btn" data-uid="${row.uid}" style="padding: 6px 12px; font-size: 12px; border-radius: 6px;">
            <i data-lucide="edit-3" style="width: 12px; height: 12px;"></i> แก้ไข
          </button>
        </td>
      ` : ''}
    `;
    tableBody.appendChild(tr);
  });
  
  // Bind click handlers to edit row buttons
  if (isAdminActive) {
    document.querySelectorAll('.edit-row-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const uid = e.currentTarget.dataset.uid;
        openEditModal(uid);
      });
    });
  }
  
  lucide.createIcons();
}

/**
 * Configure admin actions, printing, and CSV export
 */
function setupAdminControls() {
  // 1. Admin login toggle
  document.getElementById('btn-admin-login').addEventListener('click', handleAdminLogin);
  
  // 2. Print Report
  document.getElementById('btn-print-report').addEventListener('click', printReport);
  
  // 3. Export CSV
  document.getElementById('btn-export-csv').addEventListener('click', exportCSV);
  
  // 4. Edit Modal Closers
  document.getElementById('close-edit-modal').addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
  });
  document.getElementById('btn-cancel-edit').addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
  });
  
  // 5. Admin Form Submit
  document.getElementById('admin-edit-form').addEventListener('submit', submitAdminEdit);
}

/**
 * Prompt user for admin email and unlock controls if authorized
 */
function handleAdminLogin() {
  if (isAdminActive) {
    // Log out admin
    isAdminActive = false;
    adminEmail = '';
    
    // Reset UI
    const statusText = document.getElementById('admin-status-text');
    statusText.innerHTML = '<i data-lucide="shield-alert" class="icon-warning"></i> โหมดทั่วไป (สำหรับดูข้อมูลเท่านั้น)';
    statusText.classList.remove('unlocked');
    
    const loginBtn = document.getElementById('btn-admin-login');
    loginBtn.innerHTML = '<i data-lucide="lock"></i> ปลดล็อกสิทธิ์แก้ไขข้อมูล';
    loginBtn.className = 'btn btn-secondary btn-sm';
    
    renderTable();
    return;
  }

  const email = prompt('กรุณากรอกอีเมล มข. เพื่อเปิดสิทธิ์แก้ไขข้อมูล:');
  if (!email) return;

  const loginBtn = document.getElementById('btn-admin-login');
  loginBtn.disabled = true;

  if (window.isGoogleAppsScript) {
    google.script.run
      .withSuccessHandler((response) => {
        loginBtn.disabled = false;
        if (response.success && response.isAdmin) {
          activateAdminMode(email);
        } else {
          alert('ขออภัย อีเมลของคุณไม่มีสิทธิ์ในการแก้ไขข้อมูล');
        }
      })
      .withFailureHandler((err) => {
        loginBtn.disabled = false;
        alert('ระบบตรวจสอบสิทธิ์ขัดข้อง: ' + err.toString());
      })
      .checkAdminPermission(email);
  } else {
    // Local dev mode simulation: strictly chalpr@kku.ac.th
    setTimeout(() => {
      loginBtn.disabled = false;
      const lowerEmail = email.toLowerCase().trim();
      const isHardcodedAdmin = lowerEmail === 'chalpr@kku.ac.th';
      
      if (isHardcodedAdmin) {
        activateAdminMode(email);
      } else {
        alert('ขออภัย อีเมลของคุณไม่มีสิทธิ์ในการแก้ไขข้อมูล');
      }
    }, 400);
  }
}

function activateAdminMode(email) {
  isAdminActive = true;
  adminEmail = email;
  
  // Update status bar
  const statusText = document.getElementById('admin-status-text');
  statusText.innerHTML = `<i data-lucide="shield-check"></i> ผู้ดูแลระบบ (${email})`;
  statusText.classList.add('unlocked');
  
  const loginBtn = document.getElementById('btn-admin-login');
  loginBtn.innerHTML = '<i data-lucide="log-out"></i> ล็อกสิทธิ์คืน';
  loginBtn.className = 'btn btn-danger btn-sm';
  
  lucide.createIcons();
  renderTable();
}

/**
 * Open the Edit dialog populated with details
 */
function openEditModal(uid) {
  const row = dashboardTableData.find(r => r.uid === uid);
  if (!row) return;
  
  document.getElementById('edit-uid').value = uid;
  document.getElementById('edit-name').innerText = row.name;
  document.getElementById('edit-position').innerText = row.position || '-';
  document.getElementById('edit-dept').innerText = row.department || '-';
  
  const statusSelect = document.getElementById('edit-status');
  statusSelect.value = row.registered ? 'registered' : 'pending';
  
  document.getElementById('edit-modal').style.display = 'flex';
  lucide.createIcons();
}

/**
 * Submit edit from Admin form
 */
async function submitAdminEdit(e) {
  e.preventDefault();
  const uid = document.getElementById('edit-uid').value;
  const regStatus = document.getElementById('edit-status').value;
  
  const submitBtn = document.getElementById('btn-save-edit');
  const btnText = submitBtn.querySelector('.btn-text');
  const spinner = submitBtn.querySelector('.btn-spinner');
  
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  spinner.style.display = 'block';

  if (window.isGoogleAppsScript) {
    google.script.run
      .withSuccessHandler((response) => {
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        spinner.style.display = 'none';
        
        if (response.success) {
          // Update local status cache
          if (regStatus === 'pending') {
            registeredUids = registeredUids.filter(id => id !== uid);
          } else if (!registeredUids.includes(uid)) {
            registeredUids.push(uid);
          }
          
          document.getElementById('edit-modal').style.display = 'none';
          renderDashboard(); // Re-render stats and table
        } else {
          alert('แก้ไขข้อมูลไม่สำเร็จ: ' + response.error);
        }
      })
      .withFailureHandler((err) => {
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        spinner.style.display = 'none';
        alert('ระบบขัดข้อง: ' + err.toString());
      })
      .adminUpdateRegistration(uid, regStatus);
  } else if (isFirebaseEnabled) {
    try {
      if (regStatus === 'pending') {
        // Delete registration
        await deleteDoc(doc(db, "registrations", uid));
        registeredUids = registeredUids.filter(id => id !== uid);
      } else {
        // Add or update
        const now = new Date();
        await setDoc(doc(db, "registrations", uid), {
          uid: uid,
          timestamp: now.toLocaleString('th-TH')
        });
        if (!registeredUids.includes(uid)) {
          registeredUids.push(uid);
        }
      }
      
      submitBtn.disabled = false;
      btnText.style.display = 'block';
      spinner.style.display = 'none';
      document.getElementById('edit-modal').style.display = 'none';
      renderDashboard();
    } catch (error) {
      submitBtn.disabled = false;
      btnText.style.display = 'block';
      spinner.style.display = 'none';
      alert('แก้ไขข้อมูลใน Firebase ไม่สำเร็จ: ' + error.message);
    }
  } else {
    // Local simulation
    setTimeout(() => {
      submitBtn.disabled = false;
      btnText.style.display = 'block';
      spinner.style.display = 'none';
      
      const now = new Date();
      if (regStatus === 'pending') {
        // Delete registration
        LOCAL_DATABASE.registrations = LOCAL_DATABASE.registrations.filter(r => r.uid !== uid);
        registeredUids = registeredUids.filter(id => id !== uid);
      } else {
        // Add or update
        const existing = LOCAL_DATABASE.registrations.find(r => r.uid === uid);
        if (existing) {
          existing.timestamp = now.toLocaleString('th-TH');
        } else {
          LOCAL_DATABASE.registrations.push({
            uid: uid,
            timestamp: now.toLocaleString('th-TH')
          });
        }
        if (!registeredUids.includes(uid)) {
          registeredUids.push(uid);
        }
      }
      
      document.getElementById('edit-modal').style.display = 'none';
      renderDashboard();
    }, 800);
  }
}

/**
 * Handle report print action
 */
function printReport() {
  window.print();
}

/**
 * Export current dashboard data as CSV file
 */
function exportCSV() {
  let csvContent = '\uFEFF'; // Add BOM for Excel UTF-8 display support
  
  // Headers
  csvContent += 'ชื่อ-นามสกุล,ตำแหน่ง,สังกัด/หน่วยงาน,สถานะการเข้าร่วม,เวลาที่ลงทะเบียน\n';
  
  // Rows
  dashboardTableData.forEach(row => {
    const statusText = row.registered ? 'ลงทะเบียนแล้ว' : 'ยังไม่ได้ลงทะเบียน';
    const csvRow = [
      `"${row.name}"`,
      `"${row.position || '-'}"`,
      `"${row.department || '-'}"`,
      `"${statusText}"`,
      `"${row.timestamp}"`
    ];
    csvContent += csvRow.join(',') + '\n';
  });
  
  // Download trigger
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  
  link.setAttribute('href', url);
  link.setAttribute('download', `รายงานลงทะเบียน_กิจกรรมแลกเปลี่ยนเรียนรู้_OAS_${dateStr}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
