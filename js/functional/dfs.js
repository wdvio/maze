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
let stack = [];
const start = {};
const end = {};
const current = {};

function restart () {
  renderGrid();

  walls = [];
  stack = [];
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

function move () {
  visited.add(JSON.stringify([current.row, current.col]));
  refGrid.childNodes[current.row].childNodes[current.col].classList.replace('current', 'visited');

  for (let i = 0; i < 4; i++) {
    const r = current.row + [-1, 0, 1, 0][i];
    const c = current.col + [0, 1, 0, -1][i];

    if (r < 0 || c < 0 || r >= n || c >= n) {
      continue;
    }

    if (walls.includes(JSON.stringify([r, c]))) {
      continue;
    }

    if (visited.has(JSON.stringify([r, c]))) {
      continue;
    }

    if (r === end.row && c === end.col) {
      restart();
      return;
    }

    stack.push([current.row, current.col]);

    current.row = r;
    current.col = c;
    refGrid.childNodes[r].childNodes[c].classList.add('current');
    return;
  }

  if (stack.length === 0) {
    return;
  }

  const [row, col] = stack.pop();
  current.row = row;
  current.col = col;
  refGrid.childNodes[row].childNodes[col].classList.add('current');
}

function bindKeys () {
  document.onkeydown = e => {
    switch (e.keyCode) {
      case 32:
        move();
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