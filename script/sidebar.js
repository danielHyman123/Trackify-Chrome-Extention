const toggleButton = document.getElementById('toggleButton');
const sidebar = document.querySelector('.sidebar');

toggleButton.addEventListener('click', function() {
  if (sidebar.style.display === 'none' || sidebar.style.display === '') {
    sidebar.style.display = 'block';
    document.documentElement.style.setProperty('margin-right', '0px', 'important');
    document.body.style.setProperty('margin-right', '0px', 'important');
  } else {
    sidebar.style.display = 'none';
    document.documentElement.style.setProperty('margin-right', '250px', 'important');
    document.body.style.setProperty('margin-right', '250px', 'important');
  }
});