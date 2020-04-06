var ref = document.getElementById('7d552c');

var grid;
var queue;
var costs;
var tracing;

var h = 40;
var w = 50;

var beg = {};
var end = {};
var cur = {};

window.onload = () => {
  reset();

  document.onkeydown = event => {
    if (event.keyCode === 82) {
      reset();
    }
  };
};

function reset () {
  clearTimeouts();

  generateGrid();
  queue = new PriorityQueue();

  costs = {};
  tracing = {};

  [beg.row, beg.col] = [0, Math.floor(Math.random(0, 1) * w)];
  [end.row, end.col] = [h - 1, Math.floor(Math.random(0, 1) * w)];

  cur = beg;

  grid[beg.row][beg.col] = 4;
  grid[end.row][end.col] = 5;

  costs[toIndex(cur)] = 0;
  tracing[toIndex(cur)] = 0;

  render();

  advance();
}

function generateGrid () {
  grid = [];

  for (var row = 0; row < h; row++) {
    grid.push([]);

    for (var col = 0; col < w; col++) {
      if (Math.round(Math.random(0, 1) * 10) > 7) {
        grid[row].push(1);
      } else {
        grid[row].push(0);
      }
    }
  }
};

function advance () {
  ref.childNodes[cur.row].childNodes[cur.col].classList.toggle('current');
  ref.childNodes[cur.row].childNodes[cur.col].classList.add('visited');

  if (cur.row === end.row && cur.col === end.col) {
    trace();

    return;
  }

  for (var next of explore(cur)) {
    var newCost = costs[toIndex(cur)] + 1;

    if (! costs.hasOwnProperty(toIndex(next)) || newCost < costs[toIndex(next)]) {
      costs[toIndex(next)] = newCost;

      queue.push({ next, d: newCost + manhattan(next, end) });

      tracing[toIndex(next)] = toIndex(cur);
    }
  }

  if (queue.length === 0) {
    return;
  }

  cur = queue.pop().next;

  ref.childNodes[cur.row].childNodes[cur.col].classList.toggle('current');

  setTimeout(() => advance(), 1);
}

function explore ({ row, col }) {
  var arr = [];

  for (var i = 0; i < 4; i++) {
    var rr = row + [-1, 0, 1, 0][i];
    var cc = col + [0, 1, 0, -1][i];

    if (rr < 0 || cc < 0 || rr >= h || cc >= w || ! [0, 5].includes(grid[rr][cc])) {
      continue;
    }

    arr.push({ row: rr, col: cc });
  }

  return arr;
}

function trace () {
  var i = toIndex(cur);
  [cur.row, cur.col] = toCoordinates(tracing[i]);

  if (tracing[i] === toIndex(beg)) {
    return;
  }

  ref.childNodes[cur.row].childNodes[cur.col].classList.toggle('current');

  setTimeout(() => trace(), 25);
}

function toIndex ({ row, col }) {
  return (row * w) + col;
}

function toCoordinates (index) {
  return [Math.floor(index / w), index % w];
}

function manhattan ({ row: r1, col: c1 }, { row: r2, col: c2 }) {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

function render () {
  ref.innerHTML = null;

  for (var i = 0; i < h; i++) {
    var el = ref.appendChild(Object.assign(document.createElement('div'), { className: 'flex justify-between' }));

    for (var j = 0; j < w; j++) {
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
  var id = setTimeout(() => {}, 0);

  while (id--) {
    clearTimeout(id);
  }
}