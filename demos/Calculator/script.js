
let screen = document.getElementById("screen");
const clickSound = document.getElementById("clickSound");

function playSound() {
  clickSound.currentTime = 0;
  clickSound.play();
}

function clearAll() {
  screen.innerText = '0';
}

function evaluate() {
  try {
    const expression = screen.innerText;
    if (/[0-9)]$/.test(expression)) {
      const result = Function('"use strict";return (' + expression + ')')();
      screen.innerText = result;
    }
  } catch (e) {
    screen.innerText = 'ERR';
  }
}

function handleInput(value) {
  playSound();

  if (value === 'C') {
    clearAll();
    return;
  }

  if (value === '←') {
    screen.innerText = screen.innerText.slice(0, -1) || '0';
    return;
  }

  if (value === '=') {
    evaluate();
    return;
  }

  if (!'0123456789+-*/.=C←'.includes(value)) return;

  const lastChar = screen.innerText.slice(-1);
  if ('+-*/'.includes(value) && '+-*/'.includes(lastChar)) return;

  if (value === '.') {
    const parts = screen.innerText.split(/[-+*/]/);
    const lastNum = parts[parts.length - 1];
    if (lastNum.includes('.')) return;
  }

  if (screen.innerText === '0' && '0123456789'.includes(value)) {
    screen.innerText = value;
  } else {
    screen.innerText += value;
  }
}

document.addEventListener("click", function (event) {
  if (event.target.tagName === 'BUTTON' && event.target.innerText.length <= 2) {
    handleInput(event.target.innerText);
  }
});

document.addEventListener("keyup", function (e) {
  const key = e.key;
  if (key === 'Enter') return handleInput('=');
  if (key === 'Backspace') return handleInput('←');
  handleInput(key);
});

// Toggle between dark and light mode
document.getElementById("toggleTheme").addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", document.getElementById("toggleTheme").checked);

  // Update the label text based on the mode
  const label = document.querySelector('.dark-mode-label');
  if (document.body.classList.contains('dark-mode')) {
    label.innerText = 'Dark Mode';
    label.style.color = 'white';
  } else {
    label.innerText = 'Light Mode';
    label.style.color = '#333';
  }
});
