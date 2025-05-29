function getNotes() {
  console.log("getting notes");
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ event: 'getNotes' }, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response.notes);
      }
    });
  });
}

function createNoteCard({ title, content }) {
  console.log("in the function, title and content are ", title, content);
  const noteCard = document.createElement('li');
  noteCard.className = 'note-card-item';
  noteCard.innerHTML = `
      <h2>${title}</h2>
      <p>${content}</p>
  `;
  return noteCard;
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
    console.log('notes are: ', newNotes);
    // putting the notes in the sidebar
    sidebar.innerHTML = `
      <h1>Notes</h1>
      <input type="text" placeholder="Write here..." style="width: 90%; margin: 10px;">
      <ul id="notes-list"></ul>
    `;
    document.body.appendChild(sidebar);
    const notesList = document.getElementById('notes-list');
    if (notesList) {
      newNotes.forEach(element => {
        notesList.appendChild(createNoteCard(element));
      });
    } else {
      notesList.innerHTML = '<li class="note-card-item">No notes yet</li>';
    }
    document.documentElement.style.marginRight = '250px';
    document.body.style.marginRight = '250px';
  })
} else {
  // Toggle it off
  document.getElementById('myExtensionSidebar').remove();
  document.documentElement.style.marginRight = '';
  document.body.style.marginRight = '';
}