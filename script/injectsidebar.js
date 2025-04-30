if (!document.getElementById('myExtensionSidebar')) {
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';
    sidebar.id = 'myExtensionSidebar';
    // sidebar.style.paddingLeft = '0px';
    sidebar.innerHTML = `
      <h1>Notes</h1>
      <input type="text" placeholder="Write here..." style="width: 90%; margin: 10px;">
    `;
    document.body.appendChild(sidebar);
    document.documentElement.style.marginRight = '250px';
    // document.body.style.marginRight = '250px';
  } else {
    // Toggle it off
    document.getElementById('myExtensionSidebar').remove();
    document.documentElement.style.marginRight = '';
    // document.body.style.marginRight = '';
  }