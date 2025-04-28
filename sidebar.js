const toggleButton = document.getElementById('toggleButton');
const sidebar = document.querySelector('.sidebar');

toggleButton.addEventListener('click', function() {
  if (sidebar.style.display === 'none' || sidebar.style.display === '') {
    sidebar.style.display = 'block';
  } else {
    sidebar.style.display = 'none';
  }
});