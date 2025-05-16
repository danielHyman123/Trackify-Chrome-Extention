// Function to get notes from local storage
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

// Wait until page is fully loaded
window.addEventListener("load", function () {
  // Create sidebar
  const sidebar = document.createElement("div");
  sidebar.className = "sidebar";
  sidebar.innerHTML = `
      <h1>Notes</h1>
      <input type="text" placeholder="Write here..." style="width: 90%; margin: 10px;">
      `;
  sidebar.style.display = "none"; // hide by default
  document.body.appendChild(sidebar);
  if (this.document.getElementById("toggleSidebar") != null) {
    document
      .getElementById("toggleSidebar")
      .addEventListener("click", function () {
        if (sidebar.style.display == "none" || sidebar.style.display == "") {
          sidebar.style.display = "block";
          document.documentElement.style.setProperty(
            "margin-right",
            "250px",
            "important"
          );
          document.body.style.setProperty("margin-right", "250px", "important");
        } else {
          sidebar.style.display = "none";
          document.documentElement.style.setProperty(
            "margin-right",
            "0px",
            "important"
          );
          document.body.style.setProperty("margin-right", "0px", "important");
        }
      });
  }
});

// Create toggle button
// const toggleButton = document.createElement('button');
// toggleButton.id = 'toggleButton';
// toggleButton.innerText = 'Toggle Sidebar';
// document.body.appendChild(toggleButton);

// Toggle logic
// toggleButton.addEventListener('click', function () {
//   if (sidebar.style.display === 'none' || sidebar.style.display === '') {
//     sidebar.style.display = 'block';
//     document.documentElement.style.setProperty('margin-right', '250px', 'important');
//     document.body.style.setProperty('margin-right', '250px', 'important');
//   } else {
//     sidebar.style.display = 'none';
//     document.documentElement.style.setProperty('margin-right', '0px', 'important');
//     document.body.style.setProperty('margin-right', '0px', 'important');
//   }
// });
