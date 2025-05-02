/*
Chrome storage API is used to store data in the browser. 
It allows you to store data in a key-value pair format. 
The data is stored in the browser's local storage and can be accessed by your extension.
By: Daniel
*/

// let txt;    //Decalre variable
// document.getElementById("saveButton").onclick = function(){
//     txt = document.getElementById("containerID").value; //Store input in txt variable
//     console.log(txt);   //Test if stored
// }

function saveNote(){
    let txt = document.getElementById("containerID").value;
    console.log("Button clicked");
    console.log(txt);
    // Save the note to Chrome storage
    chrome.storage.sync.set({ note: txt }, () => {
        console.log("Note saved:", txt);
    });
//
    chrome.storage.sync.get("note", (result) => {
        console.log("Retrieved note:", result.note);
      });
      


}
saveButton.addEventListener('click', saveNote);