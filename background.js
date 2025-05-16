chrome.runtime.onInstalled.addListener(() => {
    console.log("installed")
    chrome.contextMenus.create({
        id: 'note',
        title: "Notes",
        type: "normal",
        contexts: ["selection"]
    })
    // start the notes value as an empty array to start
    let notes = chrome.storage.local.get('notes', (result) => {
        if (result.notes == undefined) {
            return [];
        } else {
            return result.notes;
        }
    })
    chrome.storage.local.set({notes: JSON.stringify(notes)});
})


chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log("clicked")
    console.log(info)
});

// listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //handlling different events from messages
    switch(request.event) {
        case "saveNote":
            // adding new note to the notes array from local storage
            chrome.storage.local.get('notes', (result) => {
                let notes = JSON.parse(result.notes);
                notes.push(request.data);
                console.log('note is ', request.data)
                chrome.storage.local.set({"notes": JSON.stringify(notes)});
            })
            sendResponse({message: "Note saved from background"});
            return true;
            break;
        case "getNotes":
            chrome.storage.local.get('notes', result => {
                console.log('the notes are', result.notes);
                sendResponse({notes: JSON.parse(result.notes)});
            });
            return true;
            break;
    };
})