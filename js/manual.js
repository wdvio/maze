window.onload = () => {
  restart();

  bindKeys();
};

const refGrid = document.getElementById('ae01c4af-9296-4976-9a53-c7b881ebd683');

const n = 20;
const saturation = 35;
const grid = [];
let walls = [];
const visited = new Set();
const start = {};
const end = {};
const current = {};

function restart () {
  renderGrid();

  walls = [];
  visited.clear();

  setRandomStartPoint();
  setCurrentPoint();
  setRandomEndPoint();
  generateWalls();
}

function renderGrid () {
  refGrid.innerHTML = null;

  for (let row = 0; row < n; row++) {
    grid.push([]);
    const el = refGrid.appendChild(h('div', { className: 'flex justify-between' }, ''));

    for (let col = 0; col < n; col++) {
      grid[row].push(col);
      el.appendChild(h('div', { className: 'node' }, ''));
    }
  }
}

function setRandomStartPoint () {
  start.row = 0;
  start.col = Math.floor(Math.random(0, 1) * n);

  refGrid.childNodes[start.row].childNodes[start.col].classList.add('start');
}

function setCurrentPoint () {
  current.row = 0;
  current.col = start.col;
}

function setRandomEndPoint () {
  end.row = n - 1;
  end.col = Math.floor(Math.random(0, 1) * n);

  refGrid.childNodes[end.row].childNodes[end.col].classList.add('end');
}

function generateWalls () {
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      if (Math.round(Math.random(0, 1) * 100) < saturation) {
        if (start.row !== row || start.col !== col) {
          if (end.row !== row || end.col !== col) {
            refGrid.childNodes[row].childNodes[col].classList.add('wall');

            walls.push(JSON.stringify([row, col]));
          }
        }
      }
    }
  }
}

function move (r, c) {
  if (current.row + r < 0 || current.col + c < 0 || current.row + r >= n || current.col + c >= n) {
    return;
  }

  if (walls.includes(JSON.stringify([current.row + r, current.col + c]))) {
    return;
  }

  visited.add(JSON.stringify([current.row + r, current.col + c]));
  refGrid.childNodes[current.row].childNodes[current.col].classList.replace('current', 'visited');

  current.row += r;
  current.col += c;

  refGrid.childNodes[current.row].childNodes[current.col].classList.add('current');

  if (current.row === end.row && current.col === end.col) {
    restart();
  }
}

function bindKeys () {
  document.onkeydown = e => {
    switch (e.keyCode) {
      case 37:
      case 65:
        move(0, -1);
        break;
      case 38:
      case 87:
        move(-1, 0);
        break;
      case 39:
      case 68:
        move(0, 1);
        break;
      case 40:
      case 83:
        move(1, 0);
        break;
      case 82:
        restart();
        break;
    }
  };
}

function h (tag, attributes = {}, text) {
  const el = document.createElement(tag);

  Object.assign(el, attributes);

  if (text) {
    el.appendChild(document.createTextNode(text));
  }

  return el;
}