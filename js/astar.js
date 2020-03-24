window.onload = () => {
  restart();

  bindKeys();
};

const refGrid = document.getElementById('ae01c4af-9296-4976-9a53-c7b881ebd683');

const n = 20;
const saturation = 35;
const grid = [];
let walls = [];
let distances = [];
const start = {};
const end = {};
const current = {};

function restart () {
  renderGrid();

  walls = [];

  setRandomStartPoint();
  setCurrentPoint();
  setRandomEndPoint();
  generateWalls();

  distances = [calculateDistance(current.row, current.col, true)];
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
  refGrid.childNodes[current.row].childNodes[current.col].classList.replace('current', 'visited');

  for (let i = 0; i < 4; i++) {
    const rr = current.row + [-1, 0, 1, 0][i];
    const cc = current.col + [0, 1, 0, -1][i];

    if (rr < 0 || cc < 0 || rr >= n || cc >= n) {
      continue;
    }

    if (walls.includes(JSON.stringify([rr, cc]))) {
      continue;
    }

    if (! distances.some(d => d.r === rr && d.c === cc)) {
      distances.push(calculateDistance(rr, cc));
    }
  }

  const next = distances
    .filter(d => ! d.v)
    .sort((a, b) => a.f - b.f || a.h - b.h)[0];

  if (! next) {
    restart();
    return;
  }

  if (next.r === end.row && next.c === end.col) {
    restart();
    return;
  }

  next.v = true;

  current.row = next.r;
  current.col = next.c;
  refGrid.childNodes[next.r].childNodes[next.c].classList.add('current');
}

function calculateDistance (r, c, v = false) {
  const g = Math.abs(start.row - r) + Math.abs(start.col - c);
  const h = Math.abs(end.row - r) + Math.abs(end.col - c);

  return { r, c, g, h, f: g + h, v };
}

function toIndex (r, c) {
  return (n * r) + c;
}

function toCoordinates (i) {
  return [Math.floor(i / n), i % n];
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