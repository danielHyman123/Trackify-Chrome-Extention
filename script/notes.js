/* Chrome storage API is used to store data in the browser.
   By: Daniel */

// Check if we're in the popup/extension page context
if (document.getElementById('content')) {
    // This is the popup page - handle save button
    const contentArea = document.getElementById('content');
    const titleArea = document.getElementById('title_input');
    const saveButton = document.getElementById('saveButton');
    const highlightedTextElement = document.getElementById('highlightedText');

    // Load existing note content when page loads
    chrome.storage.local.get(['currentNote'], (result) => {
        if (result.currentNote) {
            contentArea.value = result.currentNote.content;
            titleArea.value = result.currentNote.title;
        }
    });

    //Load highlighted text when page loads
    chrome.storage.local.get(['highlighted'], (result) =>{
        const highlighted = result.highlighted || '';
        
        //note.html is opened though highlighting text and right clicking
        if (highlighted){
            //Display highlighted text
            if (highlightedTextElement){
                highlightedTextElement.textContent = "Highlighted Text: " + highlighted;
            }

            //Clear highlighted text from storage after use
            chrome.storage.local.remove('highlighted');
        }
        //note.html is opened though sidebar or index.html
        else{
            if (highlightedTextElement){
                highlightedTextElement.textContent = ''
            }
        }
    })

    // Save button handler for popup
    saveButton.addEventListener('click', () => {
        console.log("Save button clicked");
        const noteText = contentArea.value.trim();
        const titleText = titleArea.value.trim();
        if (noteText === '' || titleText === '') return;

        // Save to chrome storage
        chrome.storage.local.get(['notes'], (result) => {
            const notes = result.notes || [];
            new_note = {
                // use a number representing the exact current time as id
                id : Date.now(),
                title: titleText, 
                content: noteText
            }
            notes.push(new_note);
            
            chrome.storage.local.set({ 
                notes: notes,
                currentNote: '' // Clear current note after saving
            }, () => {
                console.log("Note saved:", noteText);
                contentArea.value = ''; // Clear textarea
                titleArea.value = ''; // Clear titleArea

                if (highlightedTextElement){
                    highlightedTextElement.textContent = '';
                }

                // Send message to background script to update sidebar
                chrome.runtime.sendMessage({
                    action: 'updateSidebar',
                    noteText: noteText
                });
            });
        }); 
    });

    // Auto-save current text as user types
    contentArea.addEventListener('input', () => {
        chrome.storage.local.set({ currentNote: { title: titleArea.value, content: contentArea.value } });
    });

    titleArea.addEventListener('input', () => {
        chrome.storage.local.set({ 
            currentNote: { 
                title: titleArea.value, 
                content: contentArea.value 
            } 
        });
    });
}