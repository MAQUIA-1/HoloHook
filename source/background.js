let toggleState;
let slideVal1 = 1;
let slideVal2 = 20;

//전체 메세지 수신부
chrome.runtime.onConnect.addListener((port) => {
  switch (port.name) {
    case "toggleChange":
      port.onMessage.addListener((message) => {
        if (message == "Checked!") {
          toggleState = "true";
          console.log(`toggle change:${toggleState}`);
          //content로 슬라이더값 보내기
          sendMessageTab("toggleOnSlide1", slideVal1);
          sendMessageTab("toggleOnSlide2", slideVal2);
        } else if (message == "Unchecked!") {
          toggleState = "false";
          console.log(`toggle change:${toggleState}`);
        }
        chrome.storage.sync.set({ toggle: toggleState }); //크롬스토리지 저장
        //content으로 메세지 발신
        sendMessageTab("togglePortContent", toggleState);
      });
      break;
    //---------------------------------------------------------
    //popup 일어남!
    case "PopupDOMLoaded":
      port.onMessage.addListener((message) => {
        if (message == "loaded!") {
          //크롬스토리지에서 불러오기
          chrome.storage.sync.get("slide1", function (res) {
            slideVal1 = res.slide1;
            //만약 저장된 슬라이드 값이 없다면, 기본값 적용.
            if (slideVal1 === undefined) {
              slideVal1 = 1;
              chrome.storage.sync.set({ slide1: slideVal1 }); //크롬스토리지 저장
            }
            sendMessage("slider1WakeUp", slideVal1);
          });

          chrome.storage.sync.get("slide2", function (res) {
            slideVal2 = res.slide2;
            if (slideVal2 === undefined) {
              slideVal2 = 20;
              chrome.storage.sync.set({ slide2: slideVal2 }); //크롬스토리지 저장
            }
            sendMessage("slider2WakeUp", slideVal2);
          });

          //background 슬립시 토글값 날아감 방지
          chrome.storage.sync.get("toggle", function (res) {
            toggleState = res.toggle;
            console.log(`toggle:${toggleState}`);
            sendMessage("toggleWakeUp", toggleState);
          });

          console.log(`slideVal1: ${slideVal1}`);
          console.log(`slideVal2: ${slideVal2}`);
        }
      });
      break;
    //---------------------------------------------------------
    case "SaveBtnslider1":
      port.onMessage.addListener((message) => {
        slideVal1 = message;
        chrome.storage.sync.set({ slide1: slideVal1 }); //크롬스토리지 저장
      });
    //---------------------------------------------------------
    case "SaveBtnslider2":
      port.onMessage.addListener((message) => {
        slideVal2 = message;
        chrome.storage.sync.set({ slide2: slideVal2 }); //크롬스토리지 저장
      });
  }
  return true;
});
//===============================================================

//메세지 발신용 함수 [back->popup]
async function sendMessage(nameVal, Message) {
  const port = await chrome.runtime.connect({ name: nameVal });
  port.postMessage(Message);
}

//메세지 발신용 함수 (탭) [back->content]
async function sendMessageTab(nameVal, Message) {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const contentPort = await chrome.tabs.connect(tabs[0].id, {
    name: nameVal,
  });
  contentPort.postMessage(Message);
}
