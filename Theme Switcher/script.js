const themeToggleBtn = document.getElementById('theme-toggle');
const toggleIcon = document.getElementById('toggle-icon');

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
        toggleIcon.setAttribute('name', 'sunny-outline');
    } else {
        toggleIcon.setAttribute('name', 'moon-outline');
    }
});
