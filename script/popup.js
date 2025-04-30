// document.getElementById('toggleSidebar').addEventListener('click', async () => {
//     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       files: ['script/injectSidebar.js']
//     });
// });


toggleSidebar = document.getElementsByTagName("toggleSidebar");
bar = document.getElementById("toggleSidebar")
console.log(toggleSidebar);
console.log(bar);
console.log("Button clicked");
bar.addEventListener('click', async () => { //() => is an on the spot function creator.
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['script/injectSidebar.js']
    });
});