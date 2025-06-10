/* Checks if the sidebar is already open
   If it is, remove it. If not, create it. 

   Creates new bookmark on sidebar when save button on notes.html is activated
   Implements Delete button function for every bookmark*/  

window.SIDEBARWIDTH = 20; 

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //Checks if the message is to refresh the sidebar
    if (message.action === 'refreshSidebar') {
        console.log("Received refresh request for note:", message.noteText);
        initNotesUI(); // Call the function to refresh the sidebar UI
        sendResponse({success: true});  //Built-in chrome function which sends a response back to the sender(notes.js)
    }
});


if (!document.getElementById('myExtensionSidebar')) {
    // Toggle it on
    const sidebar = document.createElement('div');
    sidebar.id = 'myExtensionSidebar';
    sidebar.style.position = 'fixed';
    sidebar.style.top = '0';
    sidebar.style.right = '0';
    sidebar.style.width = window.SIDEBARWIDTH + 'vw';
    sidebar.style.height = '100vh';
    sidebar.style.backgroundColor = '#111';
    sidebar.style.color = 'white';
    sidebar.style.padding = '10px';
    sidebar.style.zIndex = '9999';
    sidebar.style.boxSizing = 'border-box';
    sidebar.style.overflowY = 'auto';

    //Create top wrapper with title and plus button
    const topWrapper = document.createElement('div');
    topWrapper.style.display = 'flex';  //Insures elements inside this div will be side by side
    topWrapper.style.alignItems = 'center';
    topWrapper.style.margin = '5px 0';
    topWrapper.style.justifyContent = 'space-between'; // space between title and button

    //Create title 
    const title = document.createElement('h1');
    title.style.fontSize = '18px';
    title.textContent = 'My Notes';
    title.style.marginTop = '0';

    //Create PLUS button
    const plusButton = document.createElement('button');
    plusButton.id = " plusButton"
    plusButton.textContent = '+';
    plusButton.style.border = '1px solid gray';
    plusButton.style.color = 'white';
    plusButton.style.backgroundColor = '#333';
    plusButton.style.cursor = 'pointer';
    plusButton.style.padding = '4px 8px';
    plusButton.style.borderRadius = '4px';
    plusButton.style.fontSize = '16px';

    //Add title and + button to top wrapper
    topWrapper.appendChild(title);
    topWrapper.appendChild(plusButton);

    //Create user instructions
    const instructions = document.createElement('p');
    instructions.textContent = 'Click notes to copy to clipboard';
    instructions.style.fontSize = '12px';
    instructions.style.color = '#ccc';
    instructions.style.marginBottom = '15px';

    // Create notes container
    const notesContainer = document.createElement('div');
    notesContainer.id = 'notesContainer';
    notesContainer.style.marginTop = '10px';

    //Append everything to sidebar
    sidebar.appendChild(topWrapper);
    sidebar.appendChild(instructions);
    sidebar.appendChild(notesContainer);

    document.body.appendChild(sidebar);
    document.body.style.marginRight = window.SIDEBARWIDTH + 'vw';
    
    // Initialize the notes UI after sidebar is created
    setTimeout(initNotesUI, 100); // Small delay to ensure DOM is ready
    
    //+ button click handler to open notes.html
    plusButton.addEventListener('click', openNotes);

} else {
    // Toggle it off
    document.getElementById('myExtensionSidebar').remove();
    document.documentElement.style.marginRight = '';
    document.body.style.marginRight = '';
}

// initNotesUI function to load existing notes into the sidebar
function initNotesUI() {
    console.log("Initializing notes UI in sidebar");
    const container = document.getElementById('notesContainer');
    
    if (!container) {
        console.warn("notesContainer not found");
        return;
    }

    // Load saved notes
    chrome.storage.local.get(['notes'], (result) => {
        const notes = result.notes || [];
        container.innerHTML = ''; // Clear existing content
        notes.forEach(note => addTextToDOM(note, container));
    });
}

// Updated addTextToDOM function with delete functionality
function addTextToDOM(noteObj, container) {
    console.log("Adding note to sidebar:", noteObj);
    
    // Create wrapper div to hold both note button and delete button
    // Each pair of note and delete button bundle in one wapper
    const markWrapper = document.createElement('div');
    markWrapper.style.display = 'flex';
    markWrapper.style.alignItems = 'center';
    markWrapper.style.margin = '5px 0';
    markWrapper.style.gap = '5px';
    
    // Create the note button
    const btn = document.createElement('button');
    btn.textContent = noteObj.title;
    btn.style.flex = '1';
    btn.style.padding = '1vw 1vh';
    btn.style.backgroundColor = '#333';
    btn.style.color = 'white';
    btn.style.border = '1px solid #555';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '12px';
    btn.style.textAlign = 'left';
    btn.style.overflow = 'hidden';
    btn.style.textOverflow = 'ellipsis';
    
    // Add click handler to copy note to clipboard
    btn.addEventListener('click', () => {
        navigator.clipboard.writeText(noteObj.title).then(() => {
            const originalText = btn.textContent;
            const originalBg = btn.style.backgroundColor;
            btn.textContent = 'Copied!';
            btn.style.backgroundColor = '#4CAF50';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = originalBg;
            }, 1000);
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    });
    
    // Create the delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.style.backgroundColor = '#f44336';
    deleteBtn.style.color = 'white';
    deleteBtn.style.border = '1px solid #555';
    deleteBtn.style.padding = '1vw 1vh';
    deleteBtn.style.borderRadius = '4px';
    deleteBtn.style.width = window.SIDEBARWIDTH * 0.1 + 'vw';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.fontSize = '12px';
    deleteBtn.style.lineHeight = '1';
    deleteBtn.style.flexShrink = '0';
    deleteBtn.style.fontWeight = 'bold';
    
    // Add click handler for delete button
    deleteBtn.addEventListener('click', (e) => {        
        /*e is short for event (I could also write (event) => {...} — it's the same thing)
        It contains details about the event that occurred:
            What type of event it was (click)
            What element triggered it
            Mouse position
            Whether modifier keys (Ctrl, Shift, etc.) were pressed, etc*/
        e.stopPropagation();
        console.log("Delete button clicked for:", noteObj);
        
        // Remove this specific note from Chrome storage
        chrome.storage.local.get(['notes'], (result) => {
            const notes = result.notes || [];
            const updatedNotes = notes.filter(note => note.id !== noteObj.id);
            
            chrome.storage.local.set({ notes: updatedNotes }, () => {
                console.log("Note deleted from storage:", noteObj);
                markWrapper.remove(); // Remove the entire wrapper (note + delete button)
            });
        });
    });
    
    // Add both buttons to wrapper
    markWrapper.appendChild(btn);
    markWrapper.appendChild(deleteBtn);
    
    // Add markWrapper to container
    container.appendChild(markWrapper);
}

// Function called in event listener to the plus button to open notes.html
function openNotes(){
    const notesWindow = window.open(chrome.runtime.getURL("notes.html"), "NoteTaker", "width=600,height=400");
    if (!notesWindow) {
        console.error("Failed to open notes window. Please allow pop-ups for this site.");
    } else {
        console.log("Notes window opened successfully.");
    }
}