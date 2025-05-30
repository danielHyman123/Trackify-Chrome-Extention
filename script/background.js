chrome.runtime.onInstalled.addListener(() => {
    console.log("installed")
    chrome.contextMenus.create({
        id: 'note',
        title: "Notes",
        type: "normal",
        contexts: ["selection"]
    })
    // start the notes value as an empty array to start
    chrome.storage.local.set({notes: []})
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log("clicked")
    console.log(info)
});