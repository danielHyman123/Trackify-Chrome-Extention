chrome.runtime.onInstalled.addListener(() => {
    console.log("installed")
    chrome.contextMenus.create({
        id: 'note',
        title: "Notes",
        type: "normal",
        contexts: ["selection"]
    })
})


chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log("clicked")
    console.log(info)
});

/*
Chrome storage API is used to store data in the browser. 
It allows you to store data in a key-value pair format. 
The data is stored in the browser's local storage and can be accessed by your extension.
By: Daniel
*/
let txt = document.getElementById("containerID");
let saveButton = document.getElementById("saveButton");

function funct1(){
    console.log("Button clicked");
    console.log(txt.value);
}

saveButton.addEventListener('click', funct1);

// saveButton = document.getElementById("saveButton");
// saveButton.addEventListener('click', () => { //() => is an on the spot function creator.
//     containerID = document.getElementById("containerID");
//     console.log(containerID);
// });


// let containerInput = document.querySelector("containerID");
// let text = containerInput.value; // for a single textarea
// console.log(text);


// document.getElementById("saveButton").addEventListener("click", function () {
// const text = document.getElementById("container").value;
  
//     chrome.storage.local.set({ savedText: text }, function () {
//       document.getElementById("status").textContent = "Saved!";
//     });
//   });
  
  
  