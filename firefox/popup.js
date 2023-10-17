let link = document.querySelector('#github');

link.addEventListener('click',()=>{
    browser.tabs.create({"url": "https://github.com/JiaLong0209/coding365/tree/master/HTML/extensions/movePage"})
})