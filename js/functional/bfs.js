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
let current = [];

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
  current = [];

  current.push({
    row: 0,
    col: start.col
  });
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
  const neighbors = new Set();

  while (current.length > 0) {
    const { row, col } = current.pop();

    for (let i = 0; i < 4; i++) {
      const r = row + [-1, 0, 1, 0][i];
      const c = col + [0, 1, 0, -1][i];

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

      visited.add(JSON.stringify([r, c]));
      neighbors.add(JSON.stringify([r, c]));
    }
  }

  for (const v of visited) {
    const [row, col] = JSON.parse(v);
    refGrid.childNodes[row].childNodes[col].classList.replace('current', 'visited');
  }

  for (const neighbor of neighbors) {
    const [row, col] = JSON.parse(neighbor);
    refGrid.childNodes[row].childNodes[col].classList.add('current');
    current.push({row, col});
  }
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