/*
Chrome storage API is used to store data in the browser. 
It allows you to store data in a key-value pair format. 
The data is stored in the browser's local storage and can be accessed by your extension.
By: Daniel
*/

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('containerID');
    const saveButton = document.getElementById('saveButton');
    const textList = document.getElementById('textOutput');
  
    // Load saved inputs
    chrome.storage.local.get({ inputs: [] }, (result) => {
      result.inputs.forEach(addTextToDOM);
    });
  
    // Save button handler
    saveButton.addEventListener('click', () => {
        console.log("Button clicked");
        console.log('Input value: ' + input.value);
        const text = input.value.trim();
        if (text === '') return;  
        /*'==' compares values and converts types; '===' compares values and types(not type converstion)
        i.e. 0 == '0' is true as 0 is converted to string, 
         but 0 === '0' is false because number and strings are different types.
        */

         //Retreive the current inputs from storage
        chrome.storage.local.get({ inputs: [] }, (result) => {
        const updatedInputs = [...result.inputs, text];
  
        //Add the new input, and save it back
        chrome.storage.local.set({ inputs: updatedInputs }, () => {
          addTextToDOM(text);
          input.value = ''; // Clear input
        });
      });
    });
  
    //This function displays the text in <p> list
    function addTextToDOM(text) {
        const listWindow = window.open("list.html", "List", "width=200,height=400");
      const button = document.createElement('button');
      button.textContent = text;
      textList.appendChild(button);
    }
  });



/*
function saveNote(){
    let txt = document.getElementById("containerID").value;
    console.log("Button clicked");
    console.log(txt);

    // Save the note to Chrome storage
    chrome.storage.sync.set({ note: txt }, () => {
        console.log("Note saved:", txt);
    });  

    //Display note list on sidebar
    chrome.storage.sync.get(null, function (items) {
        const listDiv = document.getElementById("listDiv");
        listDiv.innerHTML = ""; // Clear existing content
      
        for (let key in items) {
          const entry = document.createElement("p");
          entry.textContent = `${key}: ${items[key]}`;
          listDiv.appendChild(entry);
        }
      });

}

saveButton.addEventListener('click', saveNote);
*/