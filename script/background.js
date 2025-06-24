// chrome.runtime.onInstalled.addListener(() => {
//     console.log("installed")
//     chrome.contextMenus.create({
//         id: 'note',
//         title: "Notes",
//         type: "normal",
//         contexts: ["selection"]
//     })
//     // start the notes value as an empty array to start
//     chrome.storage.local.set({notes: []})
// })

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//     console.log("clicked")
//     console.log(info)

//     // Save the ID of the tab where context menu was used
//     chrome.storage.local.set({ lastActiveTabId: tab.id });

//     //Open notes.html as a popup when the notes button is clicked after right clicking
//     chrome.windows.create({
//         url: chrome.runtime.getURL('notes.html'),
//         type: "popup", 
//         width:600,
//         height:600
//     });
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     //If the message is to update the sidebar, inform injectSidebar.js to refresh the sidebar
//     if (message.action === 'updateSidebar') {
//         console.log("Background received update request for note:", message.noteText);
        
//         // Forward the message to all active tabs
//         chrome.tabs.query({}, (tabs) => {
//             tabs.forEach(tab => {   //Loop through all tabs
//                 chrome.tabs.sendMessage(tab.id, {
//                     action: 'refreshSidebar',
//                     noteText: message.noteText
//                 }).catch((error) => {
//                     // Ignore errors for tabs that don't have the content script
//                     console.log(`Could not send message to tab ${tab.id}:`, error.message);
//                 });
//             });
//         });
        
//         sendResponse({success: true});
//     }

//     if (message.action === 'getURL') {
//         // Tell Chrome we will respond asynchronously
//         let didRespond = false;

//         chrome.storage.local.get(['lastActiveTabId'], ({ lastActiveTabId }) => {
//             if (lastActiveTabId !== undefined) {
//                 chrome.tabs.get(lastActiveTabId, (tab) => {
//                     if (chrome.runtime.lastError || !tab) {
//                         sendResponse({ url: "Error retrieving tab" });
//                     } else {
//                         sendResponse({ url: tab.url });
//                     }
//                 });
//             } else {
//                 sendResponse({ url: "No stored tab ID" });
//             }
//         });

//         return true; // Indicates that we will send a response asynchronously
//     }
// });

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

    // Save the current tab info (both ID and URL) when context menu is used
    chrome.storage.local.set({ 
        lastActiveTabId: tab.id,
        lastActiveTabUrl: tab.url
    });

    //Open notes.html as a popup when the notes button is clicked after right clicking
    chrome.windows.create({
        url: chrome.runtime.getURL('notes.html'),
        type: "popup", 
        width:600,
        height:600
    });
});

// Handle opening notes from the + button in sidebar
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //If the message is to update the sidebar, inform injectSidebar.js to refresh the sidebar
    if (message.action === 'updateSidebar') {
        console.log("Background received update request for note:", message.noteText);
        
        // Forward the message to all active tabs
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {   //Loop through all tabs
                chrome.tabs.sendMessage(tab.id, {
                    action: 'refreshSidebar',
                    noteText: message.noteText
                }).catch((error) => {
                    // Ignore errors for tabs that don't have the content script
                    console.log(`Could not send message to tab ${tab.id}:`, error.message);
                });
            });
        });
        
        sendResponse({success: true});
    }

    // Handle URL requests from notes.html
    if (message.action === 'getURL') {
        chrome.storage.local.get(['lastActiveTabId', 'lastActiveTabUrl'], (result) => {
            if (result.lastActiveTabUrl) {
                // Return the stored URL
                sendResponse({ url: result.lastActiveTabUrl });
            } else if (result.lastActiveTabId) {
                // Fallback: try to get current tab info
                chrome.tabs.get(result.lastActiveTabId, (tab) => {
                    if (chrome.runtime.lastError || !tab) {
                        sendResponse({ url: "Error retrieving tab" });
                    } else {
                        sendResponse({ url: tab.url });
                    }
                });
            } else {
                sendResponse({ url: "No stored tab info" });
            }
        });
        
        return true; // Indicates that we will send a response asynchronously
    }

    // Handle saving current tab URL when + button is clicked
    if (message.action === 'saveCurrentTab') {
        // Get the sender tab info and save it
        if (sender.tab) {
            chrome.storage.local.set({ 
                lastActiveTabId: sender.tab.id,
                lastActiveTabUrl: sender.tab.url
            }, () => {
                sendResponse({ success: true, url: sender.tab.url });
            });
        } else {
            sendResponse({ success: false, error: "No tab info available" });
        }
        
        return true;
    }
});