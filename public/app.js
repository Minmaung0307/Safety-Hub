// Navigation Logic
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId + '-view').classList.add('active');
    
    // Update Nav Icons
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    // (Add logic to sync nav with view here)
}

// SOS Logic (Hold for 3 seconds to trigger)
let timer;
const sosBtn = document.getElementById('sos-btn');

sosBtn.addEventListener('mousedown', startTimer);
sosBtn.addEventListener('touchstart', startTimer);
sosBtn.addEventListener('mouseup', cancelTimer);
sosBtn.addEventListener('touchend', cancelTimer);

function startTimer() {
    sosBtn.style.background = "#991b1b";
    timer = setTimeout(sendSOS, 3000);
}

function cancelTimer() {
    clearTimeout(timer);
    sosBtn.style.background = "#dc2626";
}

function sendSOS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const data = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            db.collection("emergency_alerts").add(data)
                .then(() => alert("အရေးပေါ်သတိပေးချက် ပို့ပြီးပါပြီ။"))
                .catch(err => alert("Error: " + err.message));
        });
    }
}