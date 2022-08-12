let slideVal1;
let slideVal2;

//전체 메세지 수신
chrome.runtime.onConnect.addListener((port) => {
  switch (port.name) {
    case "togglePortContent":
      port.onMessage.addListener((message) => {
        if (message == "true") {
          activateCrawl();
        } else if (message == "false") {
          stopCrawl();
        }
      });
    //----------------------------------------------
    case "toggleOnSlide1":
      port.onMessage.addListener((message) => {
        slideVal1 = JSON.parse(message) * 1000;
      });
    //----------------------------------------------
    case "toggleOnSlide2":
      port.onMessage.addListener((message) => {
        slideVal2 = JSON.parse(message) * -1 - 1;
      });
  }
  return true;
});

let interval;

function activateCrawl() {
  console.log("activate!!");
  console.log(slideVal1);
  console.log(slideVal2);
  clearInterval(interval);
  interval = setInterval(getChat, slideVal1, slideVal2);
}

function stopCrawl() {
  console.log("stop!!");
  clearInterval(interval);
}

function getChat(slideVal2) {
  try {
    const frame = document.querySelector("#chatframe");
    const frameInside =
      frame.contentWindow.document.querySelectorAll("#content #message");

    let chatArr = [];
    frameInside.forEach(function (element) {
      let pureInnerText = element.innerText;
      chatArr.push(pureInnerText);
    });

    let chatArrSort = [];
    chatArrSort = chatArr.slice(Number(slideVal2), -1);

    let chatText = chatArrSort.join("\n");
    //=====================================================
    const textArea = document.createElement("textarea");

    textArea.textContent = chatText;
    document.body.append(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
    //=====================================================
    console.log(chatText);
  } catch {
    console.log("getChat() err");
  }
}
