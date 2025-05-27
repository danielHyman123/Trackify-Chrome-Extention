/* Checks if the sidebar is already open
   If it is, remove it. If not, create it. */

window.SIDEBARWIDTH = 20;
 
if (!document.getElementById('myExtensionSidebar')) {
    // Toggle it on
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';
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
    
    sidebar.innerHTML = `
        <h1 style="margin-top: 0; font-size: 18px;">My Notes</h1>
        <p style="font-size: 12px; color: #ccc; margin-bottom: 15px;">Click notes to copy to clipboard</p>
        <div id="notesContainer" style="margin-top: 10px;"></div>
    `;
    
    document.body.appendChild(sidebar);
    // document.documentElement.style.marginRight = '250px';
    document.body.style.marginRight = window.SIDEBARWIDTH + 'vw';
    
    // Initialize the notes UI after sidebar is created
    setTimeout(initNotesUI, 100); // Small delay to ensure DOM is ready
} else {
    // Toggle it off
    document.getElementById('myExtensionSidebar').remove();
    document.documentElement.style.marginRight = '';
    document.body.style.marginRight = '';
}

// Listen for messages from the popup/extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message:", message);

    const container = document.getElementById('notesContainer');
    if (!container) {
        console.warn("notesContainer not found");
        return;
    }

    if (message.type === 'new_note') {
        // Add the new note to the sidebar
        addTextToDOM(message.note, container);
        sendResponse({success: true});
    } else if (message.type === 'clear_notes') {
        // Clear all notes from sidebar
        container.innerHTML = '';
        sendResponse({success: true});
    }
});

// Copy of initNotesUI function for the sidebar context
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
function addTextToDOM(noteText, container) {
    console.log("Adding note to sidebar:", noteText);
    
    // Create wrapper div to hold both note button and delete button
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.margin = '5px 0';
    wrapper.style.gap = '5px';
    
    // Create the note button
    const btn = document.createElement('button');
    btn.textContent = noteText;
    btn.style.flex = '1';
    btn.style.padding = '1vw 1vh';
    btn.style.backgroundColor = '#333';
    btn.style.color = 'white';
    btn.style.border = '1px solid #555';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '12px';
    btn.style.textAlign = 'left';
    // btn.style.wordWrap = 'break-word';
    btn.style.overflow = 'hidden';
    btn.style.textOverflow = 'ellipsis';
    
    // Add click handler to copy note to clipboard
    btn.addEventListener('click', () => {
        navigator.clipboard.writeText(noteText).then(() => {
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
        e.stopPropagation();
        console.log("Delete button clicked for:", noteText);
        
        // Remove this specific note from Chrome storage
        chrome.storage.local.get(['notes'], (result) => {
            const notes = result.notes || [];
            const updatedNotes = notes.filter(note => note !== noteText);
            
            chrome.storage.local.set({ notes: updatedNotes }, () => {
                console.log("Note deleted from storage:", noteText);
                wrapper.remove(); // Remove the entire wrapper (note + delete button)
            });
        });
    });
    
    // Add both buttons to wrapper
    wrapper.appendChild(btn);
    wrapper.appendChild(deleteBtn);
    
    // Add wrapper to container
    container.appendChild(wrapper);
}