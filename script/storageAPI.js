function getNotes() {
    console.log("getting notes");
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({event: 'getNotes'}, (response) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(response.notes);
            }
        });
    });
}