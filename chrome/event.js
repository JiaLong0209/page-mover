let Status = {
  active: true,
  activeMode: 1,
  scrollMode: 'linear',
}


function toggleMovePageFunction(isActive) {
  Status.active = isActive;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, Status, (response) => {
      console.log(response);
    });
  });
}

function OpenNewTab() {
  chrome.tabs.create({ 'url': 'https://www.google.com' });
}

function genericOnClick(info, tab) {
  //根據你點選右鍵的狀況不同，可以得到一些跟內容有關的資訊  
  //例如 頁面網址，選取的文字，圖片來源，連結的位址  
  let id = info.menuItemId;
  console.log(
    "Info :" + JSON.stringify(info) + "\n" +
    "ID是:" + info.menuItemId + "\n" +
    "現在的網址是:" + info.pageUrl + "\n" +
    "選取的文字是:" + (info.selectionText ? info.selectionText : "") + "\n" +
    "現在hover元素的圖片來源:" + (info.srcUrl ? info.srcUrl : "") + "\n" +
    "現在hover的連結:" + (info.linkUrl ? info.linkUrl : "") + "\n" +
    "現在hover的frame是:" + (info.frameUrl ? info.frameUrl : "") + "\n"
  );
  if (id == "activePageMover") {
    toggleMovePageFunction(info.checked);
  } else if (id == "newTab") {
    OpenNewTab();
  }

}

chrome.runtime.onInstalled.addListener(async () => {
  console.log('Extension is Installed');
  let parent = chrome.contextMenus.create({
    "title": "All functions",
    "contexts": ['all'],
    "id": "parent"
  })

  let activePageMover = chrome.contextMenus.create({
    "id": "activePageMover",
    "title": "active move page",
    "type": "checkbox",
    "contexts": ['all'],
    "parentId": parent,
    "checked": true,
  });


  let newTab = chrome.contextMenus.create({
    "id": "newTab",
    "title": "Open a new tab",
    "type": "normal",
    "contexts": ['all'],
    "parentId": parent,
  });

  chrome.commands.onCommand.addListener(function (command) {
    console.log('Command:', command);

    if (command == 'activePageMoverCommand') {
      toggleMovePageFunction(!Status.active);
      chrome.contextMenus.update("activePageMover", {  // update the checkBox
        "checked": Status.active
      });

    } else if (command == 'newTabCommand') {
      OpenNewTab();
    }
  });

  chrome.contextMenus.onClicked.addListener(genericOnClick);


});

// {  
//   "type" : "normal",  
//   "id" : "item1-1",  
//   "title" : "使用者選擇了'%s'",  
//   "contexts" : ["all", "page", "frame", "selection", "link", "editable", "image", "video", "audio", "launcher", "browser_action","page_action"],  
//   "documentUrlPatterns" : ["https://*.google.com/foo*bar"],  
//   "targetUrlPatterns" : [],  
//   "enabled": true,  
//   "onclick": function(info,tab){},  
//   "parentId": "item1",  
//   "checked" : false  
// };