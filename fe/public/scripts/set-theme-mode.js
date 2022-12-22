const themeMode = window.localStorage.getItem('theme_mode');
if (themeMode === 'dark') {
  document.getElementsByTagName("html")[0].classList.add('dark');
} else {
  document.getElementsByTagName("html")[0].classList.remove('dark');
}
