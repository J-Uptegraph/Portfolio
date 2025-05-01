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

document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});


function clearAll() {
  screen.innerText = '0'; // Reset to 0 instead of 'Ready'
}

// Evaluate and display the calculation result in the same place
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

// Update screen with operations, replace 'Ready' text
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
