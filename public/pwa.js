let deferredPrompt;

// Service Worker ကို Register လုပ်ခြင်း
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(() => console.log("Service Worker Registered"));
}

window.addEventListener('beforeinstallprompt', (e) => {
    // Browser ရဲ့ ပုံမှန် prompt ကို တားထားမယ်
    e.preventDefault();
    deferredPrompt = e;
    
    // Install ခလုတ်ကို ပေါ်လာအောင်လုပ်မယ် (ဥပမာ Settings ထဲမှာ)
    const installBtn = document.getElementById('install-app-btn');
    if (installBtn) {
        installBtn.classList.remove('hidden');
    }
});

function handleAppInstall() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User installed the app');
            }
            deferredPrompt = null;
        });
    }
}