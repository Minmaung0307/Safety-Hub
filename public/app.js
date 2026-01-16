// ၁။ NAVIGATION LOGIC (ဒါက အပေါ်ဆုံးမှာ ရှိရပါမယ်)
function showView(viewId) {
  console.log("Switching to view:", viewId);

  // ၁။ View အားလုံးကို ဖျောက်ပြီး Target View ကို ပြပါ
  const views = document.querySelectorAll(".view");
  views.forEach((v) => v.classList.remove("active"));

  const targetView = document.getElementById(viewId + "-view");
  if (targetView) {
    targetView.classList.add("active");
    window.scrollTo(0, 0); // စာမျက်နှာအပေါ်ဆုံးသို့ ပြန်တင်မည်
  }

  // ၂။ Bottom Nav ခလုတ်များ၏ Active Color ကို Update လုပ်ပါ
  const navBtns = document.querySelectorAll(".nav-btn"); // သင့် HTML မှာ nav-item ဖြစ်နေရင် nav-item လို့ ပြောင်းပါ
  navBtns.forEach((btn) => {
    // အရင်ဆုံး active အဟောင်းတွေကို ဖယ်ထုတ်မယ်
    btn.classList.remove("active");

    // onclick ထဲမှာ လက်ရှိ viewId ပါတဲ့ ခလုတ်ကို ရှာပြီး active class ထည့်မယ်
    const clickAttr = btn.getAttribute("onclick");
    if (clickAttr && clickAttr.includes(`'${viewId}'`)) {
      btn.classList.add("active");
    }
  });

  // ၃။ View အလိုက် လိုအပ်သော data များ load လုပ်ရန်
  if (viewId === "home") loadNews("home-news-feed", 3);
  if (viewId === "news") loadNews("full-news-feed", 20);
  if (viewId === "chat") loadChats();
  if (viewId === 'menu') {
        // ရင်းမြစ်များ စာမျက်နှာကို ရောက်ရင် လုပ်ဆောင်လိုတာရှိက ဒီမှာရေးနိုင်သည်
        console.log("Resources menu opened");
    }

  if (viewId === "support") {
    // ၁။ စာမျက်နှာကို အပေါ်ဆုံးသို့ ပို့ပေးခြင်း
    window.scrollTo(0, 0);

    // ၂။ ကျပန်း နှုတ်ခွန်းဆက်စာသား (Random Greeting) ပြောင်းပေးခြင်း
    // အလှူရှင်ကို ပိုပြီး နွေးထွေးစေပါတယ်
    const messages = [
      "လူသားချင်းစာနာမှုအတွက် ကျေးဇူးတင်ပါတယ် 🙏",
      "Community အတွက် ကူညီပေးတာ ကျေးဇူးအများကြီးတင်ပါတယ် ❤️",
      "App ကို ဆက်လက်ရှင်သန်အောင် ဝိုင်းဝန်းပေးလို့ ဝမ်းသာရပါတယ် 🤝",
      "သင်၏ အကူအညီက ကျွန်ုပ်တို့အတွက် ခွန်အားပါပဲ ✨",
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    // Support View ထဲက စာသားကို ရှာပြီး ပြောင်းမယ်
    const supportP = document.querySelector("#support-view p");
    if (supportP) {
      supportP.style.opacity = 0;
      setTimeout(() => {
        supportP.innerText = randomMsg;
        supportP.style.transition = "opacity 0.5s";
        supportP.style.opacity = 1;
      }, 200);
    }

    // ၃။ Stripe လုံခြုံရေးအတွက် သတိပေးချက် (Privacy Reminder)
    // အသုံးပြုသူတွေ စိတ်ချလက်ချ ပေးနိုင်အောင်ပါ
    console.log("Support mode activated: Tracking disabled for donor privacy.");
  }
}

// ၂။ SOS Logic
const sosBtn = document.getElementById("sos-btn");
let timer;

if (sosBtn) {
  const handleStart = (e) => {
    e.preventDefault();
    sosBtn.classList.add("pressing");
    timer = setTimeout(triggerSOS, 3000);
  };
  const handleEnd = () => {
    sosBtn.classList.remove("pressing");
    clearTimeout(timer);
  };

  sosBtn.addEventListener("mousedown", handleStart);
  sosBtn.addEventListener("mouseup", handleEnd);
  sosBtn.addEventListener("touchstart", handleStart, { passive: false });
  sosBtn.addEventListener("touchend", handleEnd);
}

// ၁။ Settings သိမ်းဆည်းခြင်း
function saveSettings() {
  const family1 = document.getElementById("family-phone-1").value;
  const family2 = document.getElementById("family-phone-2").value;
  const lawyer = document.getElementById("lawyer-phone").value;

  localStorage.setItem("familyPhone1", family1);
  localStorage.setItem("familyPhone2", family2);
  localStorage.setItem("lawyerPhone", lawyer);

  alert("အချက်အလက်များ သိမ်းဆည်းပြီးပါပြီ။");
  showView("home");
}

// ၂။ App စဖွင့်ရင် သိမ်းထားတဲ့ နံပါတ်တွေ ပြန်ဖော်ပြခြင်း
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("familyPhone1")) {
    document.getElementById("family-phone-1").value =
      localStorage.getItem("familyPhone1");
  }
  if (localStorage.getItem("familyPhone2")) {
    document.getElementById("family-phone-2").value =
      localStorage.getItem("familyPhone2");
  }
  if (localStorage.getItem("lawyerPhone")) {
    document.getElementById("lawyer-phone").value =
      localStorage.getItem("lawyerPhone");
  }
});

// ၃။ SOS Logic ပြင်ဆင်ခြင်း (Dynamic ဆက်သွယ်ရန်)
function triggerSOS() {
  if (!db) return alert("Database Connection Error");

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

      db.collection("sos_alerts")
        .add({
          lat: lat,
          lng: lng,
          time: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          const f1 = localStorage.getItem("familyPhone1");
          const f2 = localStorage.getItem("familyPhone2");
          const lawyerNum = localStorage.getItem("lawyerPhone");

          const actionBox = document.getElementById("sos-action");
          actionBox.innerHTML = `
                <p style="color:red; font-weight:bold; margin-bottom:15px;">အရေးပေါ် အကူအညီတောင်းခံရန် ရွေးချယ်ပါ</p>
                
                ${
                  f1
                    ? `<a href="tel:${f1}" class="emergency-call" style="background:#16a34a; margin-bottom:10px;">မိသားစု (၁) ထံ ဖုန်းခေါ်မည်</a>`
                    : ""
                }
                ${
                  f2
                    ? `<a href="tel:${f2}" class="emergency-call" style="background:#16a34a; margin-bottom:10px;">မိသားစု (၂) ထံ ဖုန်းခေါ်မည်</a>`
                    : ""
                }
                ${
                  lawyerNum
                    ? `<a href="tel:${lawyerNum}" class="emergency-call">ရှေ့နေထံ ဖုန်းခေါ်မည်</a>`
                    : ""
                }
                
                <div style="background:#f8fafc; padding:10px; border-radius:10px; margin-top:15px; border:1px solid #ddd;">
                    <p style="font-size:12px; margin:0 0 5px 0;">တည်နေရာ Link ကို Copy ယူပြီး SMS ပို့ပါ:</p>
                    <input type="text" value="${mapUrl}" id="map-link" style="width:70%; font-size:11px; padding:5px;">
                    <button onclick="copyLink()" style="padding:5px 10px; font-size:11px;">Copy</button>
                </div>
            `;
          actionBox.classList.remove("hidden");
          alert("SOS ပို့ပြီးပါပြီ။ ဖုန်းခေါ်ရန် ခလုတ်များ ပေါ်လာပါပြီ။");
        });
    },
    () => alert("Location ဖွင့်ပေးရန် လိုအပ်ပါသည်။")
  );
}

function copyLink() {
  const copyText = document.getElementById("map-link");
  copyText.select();
  document.execCommand("copy");
  alert("Map link copied!");
}

// ၄။ သတင်းပေးပို့ခြင်း
async function submitReport() {
  const desc = document.getElementById("report-desc").value;
  if (!desc) return alert("စာအရင်ရေးပါ");

  const btn = document.getElementById("submit-btn");
  btn.disabled = true;
  btn.innerText = "တင်နေသည်...";

  try {
    await db.collection("reports").add({
      description: desc,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    alert("အောင်မြင်စွာ ပေးပို့ပြီးပါပြီ");
    document.getElementById("report-desc").value = "";
    showView("home");
  } catch (e) {
    alert("Error: " + e.message);
  } finally {
    btn.disabled = false;
    btn.innerText = "အတည်ပြု သတင်းပေးပို့မည်";
  }
}

// ၅။ App စတင်ခြင်း
window.onload = () => {
  // ၁။ Home Page အတွက် နောက်ဆုံးရ ၃ ခုပဲ ဖတ်မယ်
  loadNews("home-news-feed", 3);

  // ၂။ News Page အတွက် နောက်ဆုံးရ ၂၀ အထိ ဖတ်မယ်
  loadNews("full-news-feed", 20);

  showView("home");
};

// App စဖွင့်ချိန်တွင် Onboarding စစ်ဆေးခြင်း
window.addEventListener("load", () => {
  const isFirstTime = localStorage.getItem("isFirstTimeUser");

  if (isFirstTime === null) {
    // ပထမဆုံးအကြိမ်ဆိုရင် Modal ကို ပြမယ်
    document.getElementById("onboarding-modal").classList.remove("hidden");
  }
});

function closeOnboarding() {
  // Modal ကို ပိတ်ပြီး Guide View ကို ပြမယ်
  document.getElementById("onboarding-modal").classList.add("hidden");
  localStorage.setItem("isFirstTimeUser", "false"); // နောက်တစ်ခါ ထပ်မပေါ်အောင် သိမ်းထားမယ်
  showView("guide");
}

// ပင်မစာမျက်နှာ (Home) မှာ ပြန်ကြည့်ဖို့ ခလုတ်ထည့်ရန် showView ထဲမှာ ထည့်သွင်းနိုင်သည်

// Emoji တစ်ခုကို နှိပ်လိုက်ရင် Input ထဲကို ထည့်ပေးမယ့် function
function addEmoji(emoji) {
  const chatInput = document.getElementById("chat-input");
  if (chatInput) {
    chatInput.value += emoji; // စာရိုက်ကွက်ထဲကို emoji ပေါင်းထည့်မယ်
    chatInput.focus(); // Cursor ကို input ထဲမှာပဲ ပြန်ထားမယ်
  }
}

// Enter ခေါက်ရင် စာပို့ပေးဖို့
document
  .getElementById("chat-input")
  ?.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendChatMessage();
    }
  });

// Chat Message ပို့ခြင်း
function sendChatMessage() {
  const input = document.getElementById("chat-input");
  const msg = input.value.trim();
  if (!msg || !db) return;

  let myName = localStorage.getItem("chatNickname");
  if (!myName) {
    myName = "User-" + Math.floor(Math.random() * 9000);
    localStorage.setItem("chatNickname", myName);
  }

  db.collection("chats")
    .add({
      sender: myName,
      text: msg,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      input.value = ""; // စာပို့ပြီးရင် ဖျက်မယ်
      input.focus(); // စာပြန်ရိုက်ဖို့ အဆင်သင့်ဖြစ်အောင် cursor ထားမယ်

      // အောက်ဆုံးကို scroll ဆင်းမယ်
      const container = document.getElementById("chat-messages");
      container.scrollTop = container.scrollHeight;
    });
}

// Chat Load လုပ်ခြင်း (showView('chat') ခေါ်တဲ့အခါ ဒါကိုပါ တွဲခေါ်ပါ)
function loadChats() {
  const chatContainer = document.getElementById("chat-messages");
  if (!chatContainer || !db) return;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  db.collection("chats")
    .where("timestamp", ">=", sevenDaysAgo)
    .orderBy("timestamp", "asc")
    .onSnapshot((snap) => {
      chatContainer.innerHTML = "";
      const myName = localStorage.getItem("chatNickname");

      snap.forEach((doc) => {
        const data = doc.data();
        const id = doc.id;
        const isMe = data.sender === myName;

        chatContainer.innerHTML += `
            <div class="msg ${isMe ? "me" : "others"}">
                <span class="msg-info">
                    ${data.sender} 
                    ${
                      isModerator
                        ? `<i class="fas fa-trash chat-mod-del" onclick="deleteChat('${id}')"></i>`
                        : ""
                    }
                </span>
                ${data.text}
            </div>
        `;
      });
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });
}

// Keyboard တက်လာတဲ့အခါ Footer ကို ခေတ္တဖျောက်ထားပေးခြင်း
const bottomNav = document.querySelector(".bottom-nav");

window.visualViewport.addEventListener("resize", () => {
  if (window.visualViewport.height < window.innerHeight * 0.8) {
    // Keyboard တက်လာပြီဟု ယူဆသည်
    bottomNav.style.display = "none";
  } else {
    // Keyboard ပြန်ဆင်းသွားပြီ
    bottomNav.style.display = "flex";
  }
});

// YouTube ID ထုတ်ယူသည့် Function
function getYouTubeID(url) {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// သတင်းပေးပို့ခြင်း (Link ပါဝင်အောင် ပြင်ဆင်ခြင်း)
async function handleReportSubmit() {
  const desc = document.getElementById("desc-input").value;
  const link = document.getElementById("link-in").value.trim();
  const linkTitle = document.getElementById("link-title-in").value.trim();
  const imgFile = document.getElementById("img-in").files[0];
  const vidFile = document.getElementById("vid-in").files[0];
  const audFile = document.getElementById("aud-in").files[0];

  if (!desc && !link) return alert("အကြောင်းအရာ သို့မဟုတ် Link တစ်ခုခု ထည့်ပါ");

  const btn = document.getElementById("post-btn");
  btn.disabled = true;
  btn.innerText = "တင်နေပါသည်...";

  try {
    let mediaUrls = { link: link, linkTitle: linkTitle };
    const ytID = getYouTubeID(link);
    if (ytID) mediaUrls.youtubeID = ytID;

    if (imgFile) mediaUrls.img = await uploadFile(imgFile, "images");
    if (vidFile) mediaUrls.video = await uploadFile(vidFile, "videos");
    if (audFile) mediaUrls.audio = await uploadFile(audFile, "audio");

    // ၁။ Database ထဲသို့ ဒေတာထည့်ခြင်း
    await db.collection("reports").add({
      description: desc,
      ...mediaUrls,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    // ၂။ အောင်မြင်ကြောင်းပြပြီး Input များကို ဖျက်ခြင်း (Reload မလုပ်တော့ပါ)
    alert("သတင်းပေးပို့မှု အောင်မြင်ပါသည်။");

    document.getElementById("desc-input").value = "";
    document.getElementById("link-in").value = "";
    document.getElementById("link-title-in").value = "";
    document.getElementById("img-in").value = "";
    document.getElementById("vid-in").value = "";
    document.getElementById("aud-in").value = "";
    if (document.getElementById("file-status")) {
      document.getElementById("file-status").innerText = "ဖိုင်မရွေးရသေးပါ";
    }

    // ၃။ ပင်မစာမျက်နှာသို့ ချက်ချင်းပြန်သွားခြင်း
    showView("home");
  } catch (e) {
    alert("Error: " + e.message);
  } finally {
    btn.disabled = false;
    btn.innerText = "သတင်းပေးပို့မည်";
  }
}

// သတင်းLoad လုပ်ခြင်း (YouTube နှင့် Link ပြသရန်)
function loadNews(targetId, limit) {
  const feed = document.getElementById(targetId);
  if (!feed || !db) return;

  // အမြဲတမ်း နောက်ဆုံးရသတင်းကို နားထောင်နေမည် (Real-time Listener)
  db.collection("reports")
    .orderBy("timestamp", "desc")
    .limit(limit)
    .onSnapshot(
      (snap) => {
        if (snap.empty) {
          feed.innerHTML = "<p class='status-txt'>သတင်းမရှိသေးပါ။</p>";
          return;
        }

        let htmlContent = "";
        snap.forEach((doc) => {
          const data = doc.data();
          const id = doc.id;
          const safeDesc = data.description
            ? data.description.replace(/'/g, "\\'").replace(/"/g, "&quot;")
            : "";

          htmlContent += `
                <div class="news-item card">
                    <p style="white-space:pre-wrap;">${
                      data.description || ""
                    } ${
            data.edited ? '<small style="color:blue;">(Edited)</small>' : ""
          }</p>
                    
                    ${
                      data.youtubeID
                        ? `
                        <strong class="yt-title">${
                          data.linkTitle || "YouTube Video"
                        }</strong>
                        <div class="video-container">
                            <iframe src="https://www.youtube.com/embed/${
                              data.youtubeID
                            }" frameborder="0" allowfullscreen></iframe>
                        </div>
                    `
                        : data.link
                        ? `
                        <a href="${
                          data.link
                        }" target="_blank" class="article-link-card">
                            <span class="article-link-title">${
                              data.linkTitle || "သတင်းခေါင်းစဉ်"
                            }</span>
                            <div class="article-link-url"><i class="fas fa-external-link-alt"></i> အသေးစိတ်ဖတ်ရန်</div>
                        </a>
                    `
                        : ""
                    }

                    ${
                      data.img
                        ? `<img src="${data.img}" style="width:100%; border-radius:10px; margin-top:10px;" onclick="window.open('${data.img}')">`
                        : ""
                    }
                    ${
                      data.video
                        ? `<video controls src="${data.video}" style="width:100%; border-radius:10px; margin-top:10px;"></video>`
                        : ""
                    }
                    ${
                      data.audio
                        ? `<audio controls src="${data.audio}" style="width:100%; margin-top:10px;"></audio>`
                        : ""
                    }

                    ${
                      isModerator
                        ? `
                        <div class="mod-controls">
                            <button class="btn-mod-edit" onclick="editReport('${id}', '${safeDesc}')">Edit</button>
                            <button class="btn-mod-delete" onclick="deleteReport('${id}')">Delete</button>
                        </div>
                    `
                        : ""
                    }
                </div>
            `;
        });
        feed.innerHTML = htmlContent;
      },
      (err) => {
        console.error("Snapshot error:", err);
        feed.innerHTML =
          "<p class='status-txt'>သတင်းများ ပြန်လည်ရယူရန် အခက်အခဲရှိနေပါသည်။</p>";
      }
    );
}

/* 
သတိပြုရန်:
အခု Admin ဝင်ချင်ရင် အပေါ်ဆုံးက "SAFETY HUB" ဆိုတဲ့ စာသားကြီးကို ၅ စက္ကန့်ကြာအောင် ဖိထားပေးပါ။ admin123 အဲဒါဆိုရင် Password တောင်းတဲ့ box တက်လာပါလိမ့်မယ်။ အဲဒီစနစ်က ပိုပြီး လျှို့ဝှက်သလို၊ ၁ မိနစ်ပြည့်တာနဲ့လည်း အလိုအလျောက် ပိတ်သွားမှာ ဖြစ်ပါတယ်။
*/
// --- Moderator Variables ---
let isModerator = false;
let modTimeout;
let countdownInterval;

// ၁။ လျှို့ဝှက်ဝင်ပေါက် (Secret Long Press on Logo)
const trigger = document.getElementById("admin-secret-trigger");
let triggerTimer;

if (trigger) {
  trigger.addEventListener("touchstart", () => {
    triggerTimer = setTimeout(enterModerator, 5000); // ၅ စက္ကန့် ဖိထားပါ
  });
  trigger.addEventListener("touchend", () => clearTimeout(triggerTimer));
  // PC အတွက်
  trigger.addEventListener("mousedown", () => {
    triggerTimer = setTimeout(enterModerator, 5000);
  });
  trigger.addEventListener("mouseup", () => clearTimeout(triggerTimer));
}

function enterModerator() {
  const pass = prompt("Admin Password ရိုက်ထည့်ပါ:");
  if (pass === "admin123") {
    isModerator = true;
    document.getElementById("mod-logout-btn").classList.remove("hidden");
    startModTimer();
    alert("Moderator Mode Enabled (၁ မိနစ်အတွင်း အလိုအလျောက် ပိတ်ပါမည်)");
    // View တွေကို Update လုပ်ရန် သတင်းပြန်ခေါ်ခြင်း
    showView("home");
  } else {
    alert("မှားယွင်းပါသည်။");
  }
}

// ၂။ ၁ မိနစ် Timer စနစ်
function startModTimer() {
  let timeLeft = 60;
  const timerDisplay = document.getElementById("mod-timer");

  if (modTimeout) clearTimeout(modTimeout);
  if (countdownInterval) clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    timeLeft--;
    if (timerDisplay) timerDisplay.innerText = timeLeft;
    if (timeLeft <= 0) exitModerator();
  }, 1000);

  modTimeout = setTimeout(exitModerator, 60000); // 60 seconds
}

function exitModerator() {
  isModerator = false;
  clearTimeout(modTimeout);
  clearInterval(countdownInterval);
  document.getElementById("mod-logout-btn").classList.add("hidden");
  alert("Moderator Mode ပိတ်လိုက်ပါပြီ။");
  location.reload(); // UI အားလုံး ပုံမှန်ပြန်ဖြစ်စေရန်
}

// ၃။ သတင်း Edit/Delete (သေချာအလုပ်လုပ်အောင် ပြင်ထားသည်)
async function editReport(id, currentDesc) {
  if (!isModerator) return;
  const newDesc = prompt("သတင်းကို ပြင်ဆင်ရန် ရေးသားပါ:", currentDesc);
  if (newDesc && newDesc !== currentDesc) {
    try {
      await db.collection("reports").doc(id).update({
        description: newDesc,
        edited: true,
      });
      alert("ပြင်ဆင်ပြီးပါပြီ။");
    } catch (e) {
      alert("Error: " + e.message);
    }
  }
}

async function deleteReport(id) {
  if (!isModerator) return;
  if (confirm("ဤသတင်းကို အပြီးတိုင် ဖျက်မည်လား?")) {
    try {
      await db.collection("reports").doc(id).delete();
      alert("ဖျက်ပြီးပါပြီ။");
    } catch (e) {
      alert("Error: " + e.message);
    }
  }
}

// ၄။ Chat စာတိုကို ဖျက်ခြင်း
async function deleteChat(id) {
  if (!isModerator) return;
  if (confirm("ဤစာတိုကို ဖျက်မလား?")) {
    await db.collection("chats").doc(id).delete();
  }
}
