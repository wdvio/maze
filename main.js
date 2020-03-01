window.onload = () => init();

const sizeInput = document.getElementById("size");
const wallSaturation = document.getElementById("wallSaturation");

let SIZE;
const SPEED = 0;

let isDone;
let isRunning;

let grid;
let ref = document.getElementById('grid');
let runButton = document.getElementById('zxc123');

let start;
let end;
let current;

let walls;
let visited;
let stack;

function init () {
  SIZE = sizeInput.value;
  isDone = false;
  isRunning = false;
  updateRunButton();
  ref.innerHTML = '';
  grid = generateGrid(SIZE);

  for (const [i, row] of Object.entries(grid)) {
    const el = ref.appendChild(createEl('div', { className: 'row' }, ''));

    for (const col of row) {
      el.appendChild(createEl('div', { className: 'node' }, ''));
    }
  }

  start = getRandomStartPoint(SIZE);
  current = start;
  end = getRandomEndPoint(SIZE);
  stack = [start];
  visited = [start];
  walls = generateWalls(SIZE, wallSaturation.value, start, end);


  paint(ref, start, end, walls);
}

function run () {
  if (! isDone) {
    isRunning = ! isRunning;
    updateRunButton();
    move();
  }
}

function updateRunButton () {
  runButton.innerText = isRunning ? '\u25A0' : '\u21E2';
  if (isRunning) {
    runButton.classList.replace('bg-green', 'bg-red')
  } else {
    runButton.classList.replace('bg-red', 'bg-green')
  }
}

function move () {
  if (isRunning && ! isDone) {
    let adv = advance(current, SIZE, walls, visited);

    if (adv) {
      let [nr, nc] = adv;
      ref.childNodes[current[0]].childNodes[current[1]].classList.replace('current', 'visited');
      current = adv;
      stack.push(adv);
      visited.push(adv);

      if (nr === end[0] && nc === end[1]) {
        // PATH HAS BEEN FOUND!

        ref.childNodes[current[0]].childNodes[current[1]].classList.replace('end', 'start');

        // for (const item of stack) {
        //   ref.childNodes[item[0]].childNodes[item[1]].classList.replace('visited', 'path');
        // }

        isDone = true;
        isRunning = false;
        updateRunButton();
      } else {
        ref.childNodes[nr].childNodes[nc].classList.add('current');

        // move();
        setTimeout(() => move(), SPEED);
      }
    } else if (stack.length > 0) {
      ref.childNodes[current[0]].childNodes[current[1]].classList.replace('current', 'visited');
      current = stack.pop();

      // Getting back to checkpoints is too slow
      // ref.childNodes[current[0]].childNodes[current[1]].classList.replace('visited', 'current');
      // setTimeout(() => move(), SPEED);

      move();
    } else {
      isDone = true;
      isRunning = false;
      updateRunButton();
    }
  }
}

function generateGrid (size) {
  const grid = [];

  for (let row = 0; row < size; row++) {
    grid.push([]);

    for (let col = 0; col < size; col++) {
      grid[row].push(col);
    }
  }

  return grid;
}

function getRandomStartPoint (size) {
  return [0, Math.floor(Math.random(0, 1) * size)];
}

function getRandomEndPoint (size) {
  return [size - 1, Math.floor(Math.random(0, 1) * size)];
}

function generateWalls (size, saturation, start, end) {
  const arr = [];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (Math.round(Math.random(0, 1) * 100) < saturation) {
        if (start[0] !== row || start[1] !== col) {
          if (end[0] !== row || end[1] !== col) {
            arr.push([row, col]);
          }
        }
      }
    }
  }

  return arr;
}

function advance (point, size, walls, visited) {
  const [r, c] = point;

  const dr = [-1, 0, 1, 0];
  const dc = [0, 1, 0, -1];

  for (let i = 0; i < 4; i++) {
    let rr = r + dr[i];
    let cc = c + dc[i];
    let isWall = false;
    let isVisited = false;

    // check bounds
    if (rr < 0 || cc < 0 || rr >= size || cc >= size) {
      continue;
    }

    // check walls
    for (const [row, col] of walls) {
      if (rr === row && cc === col) {
        isWall = true;
        break;
      }
    }

    // check explored
    for (const [row, col] of visited) {
      if (rr === row && cc === col) {
        isVisited = true;
        break;
      }
    }

    if (isWall || isVisited) {
      continue;
    }

    return [rr, cc];
  }

  return null;
}

// Paints start point, end point, and walls
function paint (ref, start, end, walls) {
  ref.childNodes[start[0]].childNodes[start[1]].classList.add('start');
  ref.childNodes[end[0]].childNodes[end[1]].classList.add('end');

  for (const [row, col] of walls) {
    ref.childNodes[row].childNodes[col].classList.add('wall');
  }
}

// Helper: renders DOM elements
function createEl (tag, attributes = {}, text) {
  const el = document.createElement(tag);

  Object.assign(el, attributes);

  if (text) {
    el.appendChild(document.createTextNode(text));
  }

  return el;
}
