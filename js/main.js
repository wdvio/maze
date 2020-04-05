const ref = document.getElementById('7d552c');

let grid;
let priorityQueue;

let cost;
let tracing;

const h = 40;
const w = 50;
const speed = 15;

const c = [];
const s = [];
const e = [];

window.onload = () => {
  reset();

  document.onkeydown = e => {
    if (e.keyCode === 82) {
      reset();
    }
  };
};

function reset () {
  clearTimeouts();

  generateGrid();
  priorityQueue = new PriorityQueue();

  cost = {};
  tracing = {};

  [s[0], s[1]] = [0, Math.floor(Math.random(0, 1) * w)];
  [e[0], e[1]] = [h - 1, Math.floor(Math.random(0, 1) * w)];
  [c[0], c[1]] = [s[0], s[1]];

  grid[s[0]][s[1]] = 4;
  grid[e[0]][e[1]] = 5;

  cost[toIndex(c)] = 0;
  tracing[toIndex(c)] = 0;

  render();

  advance();
}

function generateGrid () {
  const t = 7;
  grid = [];

  for (let row = 0; row < h; row++) {
    grid.push([]);

    for (let col = 0; col < w; col++) {
      if (Math.round(Math.random(0, 1) * 10) > t) {
        grid[row].push(1);
      } else {
        grid[row].push(0);
      }
    }
  }
};

function advance () {
  ref.childNodes[c[0]].childNodes[c[1]].classList.toggle('current');
  ref.childNodes[c[0]].childNodes[c[1]].classList.toggle('visited');

  if (c[0] === e[0] && c[1] === e[1]) {
    trace();

    return;
  }

  for (const p of explore(c)) {
    const newCost = cost[toIndex(c)] + 1;

    if (! cost.hasOwnProperty(toIndex(p)) || newCost < cost[toIndex(p)]) {
      cost[toIndex(p)] = newCost;

      priorityQueue.push({ p, d: newCost + manhattan(p, e) });
      
      tracing[toIndex(p)] = toIndex(c);
    }
  }

  if (priorityQueue.length === 0) {
    return;
  }

  [c[0], c[1]] = priorityQueue.pop().p;

  ref.childNodes[c[0]].childNodes[c[1]].classList.toggle('current');

  setTimeout(() => advance(), speed);
}

function explore ([r, c]) {
  const arr = [];

  for (let i = 0; i < 4; i++) {
    const rr = r + [-1, 0, 1, 0][i];
    const cc = c + [0, 1, 0, -1][i];

    if (rr < 0 || cc < 0 || rr >= h || cc >= w || ! [0, 5].includes(grid[rr][cc])) {
      continue;
    }

    arr.push([rr, cc]);
  }

  return arr;
}

function trace () {
  const i = toIndex(c);
  [c[0], c[1]] = toCoordinates(tracing[i]);

  if (tracing[i] === toIndex(s)) {
    return;
  }

  ref.childNodes[c[0]].childNodes[c[1]].classList.toggle('current');

  setTimeout(() => trace(), speed);
}

function toIndex ([r, c]) {
  return (r * w) + c;
}

function toCoordinates (i) {
  return [Math.floor(i / w), i % w];
}

function manhattan ([r1, c1], [r2, c2]) {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

function render () {
  ref.innerHTML = null;

  for (let i = 0; i < h; i++) {
    const el = ref.appendChild(Object.assign(document.createElement('div'), { className: 'flex justify-between' }));

    for (let j = 0; j < w; j++) {
      if (grid[i][j] === 0) {
        el.appendChild(Object.assign(document.createElement('div'), { className: 'node open' }));
      } else if (grid[i][j] === 1) {
        el.appendChild(Object.assign(document.createElement('div'), { className: 'node wall' }));
      } else if (grid[i][j] === 4) {
        el.appendChild(Object.assign(document.createElement('div'), { className: 'node start' }));
      } else if (grid[i][j] === 5) {
        el.appendChild(Object.assign(document.createElement('div'), { className: 'node end' }));
      }
    }
  }
}

function clearTimeouts () {
  let id = setTimeout(function() {}, 0);

  while (id--) {
    clearTimeout(id);
  }
}