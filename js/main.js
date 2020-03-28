const button = document.getElementById('7f6598');
const theme = localStorage.getItem('theme');

setTimeout(() => {
  document.getElementById('24e19c').style.display = 'none';
}, 5000);

const themeText = {
  dark: 'Light Mode',
  light: 'Dark Mode'
}

if (localStorage.getItem('theme')) {
  document.body.className = theme;

  button.innerHTML = themeText[theme];
}

button.onclick = () => {
  if (document.body.className === 'light') {
    document.body.className = 'dark';
    button.innerHTML = themeText.dark;
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.className = 'light';
    button.innerHTML = themeText.light;
    localStorage.setItem('theme', 'light');    
  }
}