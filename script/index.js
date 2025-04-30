createNoteButton = document.getElementsByTagName("button");
but = document.getElementById("createNoteButton")
console.log(createNoteButton);
console.log(but);
console.log("Button clicked");
but.addEventListener('click', () => { //() => is an on the spot function creator.
    window.open("notes.html", "NoteTaker", "width=600,height=400");
    console.log("Button clicked again");
 });