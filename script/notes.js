const note_area = document.getElementById("note_area");
const save_but = document.getElementById("saveButton");
const title = document.getElementById("title_area");
save_but.addEventListener('click', () => {
    let newNote = {title: title.value, content: note_area.value};
    sendNote(newNote);
    note_area.value = '';
    title.value = '';
})

/**
 * Send note data to background script for saving in local storage.
 *
 * @param {string} dat The note data to be saved.
 */
function sendNote(dat) {
    console.log("dat is ", dat);
    chrome.runtime.sendMessage({data: dat, event: 'saveNote'}, (response) => {
        console.log(response.message);
    })
}