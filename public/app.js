// ၁။ NAVIGATION LOGIC (ဒါက အပေါ်ဆုံးမှာ ရှိရပါမယ်)
function showView(viewId) {
    console.log("နှိပ်လိုက်သော View:", viewId);
    
    // View အားလုံးကို ဖျောက်ပါ
    const views = document.querySelectorAll('.view');
    views.forEach(v => v.classList.remove('active'));

    // Target View ကို ပြပါ
    const target = document.getElementById(viewId + '-view');
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
    }

    // Nav Item အရောင်ပြောင်းရန်
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(n => {
        n.classList.remove('active');
        const attr = n.getAttribute('onclick');
        if (attr && attr.includes(`'${viewId}'`)) {
            n.classList.add('active');
        }
    });

    // View အလိုက် သတင်း Load လုပ်ပါ
    if (viewId === 'home') loadNews('home-news-feed', 3);
    if (viewId === 'news') loadNews('news-feed', 20);
}

// ၂။ SOS Logic
const sosBtn = document.getElementById('sos-btn');
let timer;

if (sosBtn) {
    const handleStart = (e) => {
        e.preventDefault();
        sosBtn.classList.add('pressing');
        timer = setTimeout(triggerSOS, 3000);
    };
    const handleEnd = () => {
        sosBtn.classList.remove('pressing');
        clearTimeout(timer);
    };

    sosBtn.addEventListener('mousedown', handleStart);
    sosBtn.addEventListener('mouseup', handleEnd);
    sosBtn.addEventListener('touchstart', handleStart, { passive: false });
    sosBtn.addEventListener('touchend', handleEnd);
}

// ၁။ Settings သိမ်းဆည်းခြင်း
function saveSettings() {
    const family1 = document.getElementById('family-phone-1').value;
    const family2 = document.getElementById('family-phone-2').value;
    const lawyer = document.getElementById('lawyer-phone').value;

    localStorage.setItem('familyPhone1', family1);
    localStorage.setItem('familyPhone2', family2);
    localStorage.setItem('lawyerPhone', lawyer);

    alert("အချက်အလက်များ သိမ်းဆည်းပြီးပါပြီ။");
    showView('home');
}

// ၂။ App စဖွင့်ရင် သိမ်းထားတဲ့ နံပါတ်တွေ ပြန်ဖော်ပြခြင်း
document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('familyPhone1')) {
        document.getElementById('family-phone-1').value = localStorage.getItem('familyPhone1');
    }
    if(localStorage.getItem('familyPhone2')) {
        document.getElementById('family-phone-2').value = localStorage.getItem('familyPhone2');
    }
    if(localStorage.getItem('lawyerPhone')) {
        document.getElementById('lawyer-phone').value = localStorage.getItem('lawyerPhone');
    }
});

// ၃။ SOS Logic ပြင်ဆင်ခြင်း (Dynamic ဆက်သွယ်ရန်)
function triggerSOS() {
    if (!db) return alert("Database Connection Error");

    navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

        db.collection("sos_alerts").add({
            lat: lat, lng: lng,
            time: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            const f1 = localStorage.getItem('familyPhone1');
            const f2 = localStorage.getItem('familyPhone2');
            const lawyerNum = localStorage.getItem('lawyerPhone');

            const actionBox = document.getElementById('sos-action');
            actionBox.innerHTML = `
                <p style="color:red; font-weight:bold; margin-bottom:15px;">အရေးပေါ် အကူအညီတောင်းခံရန် ရွေးချယ်ပါ</p>
                
                ${f1 ? `<a href="tel:${f1}" class="emergency-call" style="background:#16a34a; margin-bottom:10px;">မိသားစု (၁) ထံ ဖုန်းခေါ်မည်</a>` : ''}
                ${f2 ? `<a href="tel:${f2}" class="emergency-call" style="background:#16a34a; margin-bottom:10px;">မိသားစု (၂) ထံ ဖုန်းခေါ်မည်</a>` : ''}
                ${lawyerNum ? `<a href="tel:${lawyerNum}" class="emergency-call">ရှေ့နေထံ ဖုန်းခေါ်မည်</a>` : ''}
                
                <div style="background:#f8fafc; padding:10px; border-radius:10px; margin-top:15px; border:1px solid #ddd;">
                    <p style="font-size:12px; margin:0 0 5px 0;">တည်နေရာ Link ကို Copy ယူပြီး SMS ပို့ပါ:</p>
                    <input type="text" value="${mapUrl}" id="map-link" style="width:70%; font-size:11px; padding:5px;">
                    <button onclick="copyLink()" style="padding:5px 10px; font-size:11px;">Copy</button>
                </div>
            `;
            actionBox.classList.remove('hidden');
            alert("SOS ပို့ပြီးပါပြီ။ ဖုန်းခေါ်ရန် ခလုတ်များ ပေါ်လာပါပြီ။");
        });
    }, () => alert("Location ဖွင့်ပေးရန် လိုအပ်ပါသည်။"));
}

function copyLink() {
    const copyText = document.getElementById("map-link");
    copyText.select();
    document.execCommand("copy");
    alert("Map link copied!");
}

// ၃။ သတင်း Load လုပ်ခြင်း
function loadNews(targetId, limit) {
    const feed = document.getElementById(targetId);
    if (!feed || typeof db === 'undefined') return;

    db.collection("reports").orderBy("timestamp", "desc").limit(limit).onSnapshot(snap => {
        feed.innerHTML = "";
        snap.forEach(doc => {
            const data = doc.data();
            feed.innerHTML += `
                <div class="news-card card">
                    <p style="white-space:pre-wrap;">${data.description}</p>
                    ${data.img ? `<img src="${data.img}" style="width:100%; border-radius:10px; margin-top:10px;">` : ''}
                </div>`;
        });
    });
}

// ၄။ သတင်းပေးပို့ခြင်း
async function submitReport() {
    const desc = document.getElementById('report-desc').value;
    if (!desc) return alert("စာအရင်ရေးပါ");

    const btn = document.getElementById('submit-btn');
    btn.disabled = true; btn.innerText = "တင်နေသည်...";

    try {
        await db.collection("reports").add({
            description: desc,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("အောင်မြင်စွာ ပေးပို့ပြီးပါပြီ");
        document.getElementById('report-desc').value = "";
        showView('home');
    } catch (e) {
        alert("Error: " + e.message);
    } finally {
        btn.disabled = false; btn.innerText = "အတည်ပြု သတင်းပေးပို့မည်";
    }
}

// ၅။ App စတင်ခြင်း
window.onload = () => {
    showView('home');
};

// App စဖွင့်ချိန်တွင် Onboarding စစ်ဆေးခြင်း
window.addEventListener('load', () => {
    const isFirstTime = localStorage.getItem('isFirstTimeUser');
    
    if (isFirstTime === null) {
        // ပထမဆုံးအကြိမ်ဆိုရင် Modal ကို ပြမယ်
        document.getElementById('onboarding-modal').classList.remove('hidden');
    }
});

function closeOnboarding() {
    // Modal ကို ပိတ်ပြီး Guide View ကို ပြမယ်
    document.getElementById('onboarding-modal').classList.add('hidden');
    localStorage.setItem('isFirstTimeUser', 'false'); // နောက်တစ်ခါ ထပ်မပေါ်အောင် သိမ်းထားမယ်
    showView('guide');
}

// ပင်မစာမျက်နှာ (Home) မှာ ပြန်ကြည့်ဖို့ ခလုတ်ထည့်ရန် showView ထဲမှာ ထည့်သွင်းနိုင်သည်