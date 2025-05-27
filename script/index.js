createNoteButton = document.getElementsByTagName("button");
but = document.getElementById("createNoteButton")
console.log(createNoteButton);
console.log(but);
console.log("Button clicked");
but.addEventListener('click', () => { //() => is an on the spot function creator.
    const notesWindow = window.open("notes.html", "NoteTaker", "width=600,height=400");
    console.log("Button clicked again");
 });

 
toggleSidebar = document.getElementsByTagName("toggleSidebar");
bar = document.getElementById("toggleSidebar")
console.log(toggleSidebar);
console.log(bar);
console.log("Button clicked");
bar.addEventListener('click', async () => { //() => is an on the spot function creator.
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['script/injectSidebar.js']
    });
});

/*Code could be used for delete button*/ 

// deleteButton = document.getElementsByTagName("button");
// del = document.getElementById("deleteButton")
// console.log(deleteButton);
// console.log(del);
// console.log("Button clicked");
// del.addEventListener('click', () => { //() => is an on the spot function creator.
//   notesWindow.close();
//   console.log("Button clicked again");
//  });

