chrome.runtime.onInstalled.addListener(() => {
    console.log("installed")
    chrome.contextMenus.create({
        id: 'note',
        title: "Notes",
        type: "normal",
        contexts: ["selection"]
    })
})


chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log("clicked")
    console.log(info)
});