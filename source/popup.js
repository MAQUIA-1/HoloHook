const toggleBtn = document.getElementById("toggle");
const slider1 = document.getElementById("refreshRange");
const output1 = document.getElementById("refreshRangeOut");
const slider2 = document.getElementById("chatRange");
const output2 = document.getElementById("chatRangeOut");
const saveButton = document.getElementById("save");
const settingcontainer = document.getElementById("settingcontainer");

//전체 메세지 수신
chrome.runtime.onConnect.addListener((port) => {
  switch (port.name) {
    case "toggleWakeUp":
      port.onMessage.addListener((message) => {
        if (message == "true") {
          toggleBtn.checked = true;
          settingDisplayOff();
        } else if (message == "false") {
          toggleBtn.checked = false;
          settingDisplayOn();
        }
        console.log(`toggle popup:${message}`);
      });
      break;
    //------------------------------------------------
    case "slider1WakeUp":
      port.onMessage.addListener((message) => {
        slider1.value = message;
        output1.innerHTML = message;
      });
    //------------------------------------------------
    case "slider2WakeUp":
      port.onMessage.addListener((message) => {
        slider2.value = message;
        output2.innerHTML = message;
      });
  }
  return true;
});

//toggle이 눌렸을때, background로 토글 메세지 발신
toggleBtn.addEventListener("change", async (event) => {
  const port = await chrome.runtime.connect({ name: "toggleChange" });
  if (event.target.checked) {
    port.postMessage("Checked!");
    settingDisplayOff();
  } else {
    port.postMessage("Unchecked!");
    settingDisplayOn();
  }
});

//save 눌릴시 background로 직접읽어온 슬라이더값 메세지 발신
saveButton.addEventListener("click", function () {
  sendMessage("SaveBtnslider1", slider1.value);
  sendMessage("SaveBtnslider2", slider2.value);
});

//DOM 시작시 background에게 일어났다고 메세지, 슬라이더값 초기 표시
document.addEventListener("DOMContentLoaded", function () {
  sendMessage("PopupDOMLoaded", "loaded!");
});

//====================================================================
//슬라이더 값 실시간 표시
slider1.oninput = function () {
  output1.innerHTML = this.value;
};
slider2.oninput = function () {
  output2.innerHTML = this.value;
};
//====================================================================

//메세지 발신용 함수
async function sendMessage(nameVal, Message) {
  const port = await chrome.runtime.connect({ name: nameVal });
  port.postMessage(Message);
}

function settingDisplayOff() {
  settingcontainer.style.display = "none"; // hide
}

function settingDisplayOn() {
  settingcontainer.style.display = ""; // show
}
