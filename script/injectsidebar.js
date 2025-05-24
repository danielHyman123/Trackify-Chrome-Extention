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
    sidebar.innerHTML = `
      <h1>Notes</h1>
      <input type="text" placeholder="Write here..." style="width: 90%; margin: 10px;">
      <p>Hello</p>
      <button id="textOutput">hello</button>
      <script src="script/notes.js"></script>
   `;
    document.body.appendChild(sidebar);
    document.documentElement.style.marginRight = '250px';
    document.body.style.marginRight = '250px';
  } else {
    // Toggle it off
    document.getElementById('myExtensionSidebar').remove();
    document.documentElement.style.marginRight = '';
    document.body.style.marginRight = '';
  }