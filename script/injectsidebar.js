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

if (!document.getElementById('myExtensionSidebar')) {
  const sidebar = document.createElement('div');
  sidebar.id = 'myExtensionSidebar';
  sidebar.style.position = 'fixed';
  sidebar.style.top = '0';
  sidebar.style.right = '0';
  sidebar.style.width = '250px';
  sidebar.style.height = '100vh';
  sidebar.style.backgroundColor = '#111';
  sidebar.style.color = 'white';
  sidebar.style.padding = '10px';
  sidebar.style.zIndex = '9999';
  let newNotes = [];
  console.log('this is sidebar injector');
  // Handling the promise
  getNotes().then((notes) => {
    newNotes = notes;
    // turning the notes into proper format
    actual_notes = (!newNotes) ? newNotes.map(item => `title is ${item.title}, content is ${item.content} `).join('') : '<p>No Notes Yet</p>';
    console.log('notes are: ', newNotes);
    // putting the notes in the sidebar
    sidebar.innerHTML = `
      <h1>Notes</h1>
      <input type="text" placeholder="Write here..." style="width: 90%; margin: 10px;">
      <div>${newNotes}</div>
    `;
    document.body.appendChild(sidebar);
    document.documentElement.style.marginRight = '250px';
    document.body.style.marginRight = '250px';
  })} else {
    // Toggle it off
    document.getElementById('myExtensionSidebar').remove();
    document.documentElement.style.marginRight = '';
    document.body.style.marginRight = '';
  }