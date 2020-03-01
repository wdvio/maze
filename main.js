window.onload = () => init();

const DEBUG = false;
const SIZE = 10;
const WALL_SATURATION = 30;

let grid;
let ref;

let start;
let end;
let current;

let walls;
let visited;
let stack;

function init () {
  grid = generateGrid(SIZE);
  ref = document.getElementById('grid');

  for (const [i, row] of Object.entries(grid)) {
    const el = ref.appendChild(createEl('div', { className: 'row' }, ''));

    for (const col of row) {
      if (DEBUG) {
        el.appendChild(createEl('div', { className: 'node' }, `${i},${col}`));
      } else {
        el.appendChild(createEl('div', { className: 'node' }, ''));
      }
    }
  }

  start = getRandomStartPoint(SIZE);
  current = start;
  end = getRandomEndPoint(SIZE);
  walls = generateWalls(SIZE, WALL_SATURATION, start, end);
  stack = [start];
  visited = [start];

  paint(ref, start, end, walls);
}

function move () {
  console.log(stack);

  let adv = advance(current, SIZE, walls, visited);

  if (adv) {
    let [nr, nc] = adv;
    ref.childNodes[current[0]].childNodes[current[1]].classList.replace('current', 'visited');
    current = adv;
    stack.push(adv);
    visited.push(adv);

    ref.childNodes[nr].childNodes[nc].classList.add('current');

    // setTimeout(() => {
    //   ref.childNodes[nr].childNodes[nc].classList.add('current');
    // }, 500);
  } else if (stack.length > 0) {
    ref.childNodes[current[0]].childNodes[current[1]].classList.replace('current', 'visited');
    current = stack.pop();
    ref.childNodes[current[0]].childNodes[current[1]].classList.replace('visited', 'current');
  } else {
    console.log('gg');
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

function createEl (tag, attributes = {}, text) {
  const el = document.createElement(tag);

  Object.assign(el, attributes);

  if (text) {
    el.appendChild(document.createTextNode(text));
  }

  return el;
}

function paint (ref, start, end, walls) {
  ref.childNodes[start[0]].childNodes[start[1]].classList.add('start');
  ref.childNodes[end[0]].childNodes[end[1]].classList.add('end');

  for (const [row, col] of walls) {
    ref.childNodes[row].childNodes[col].classList.add('wall');
  }

  // ref.childNodes[0].childNodes[2].classList.add('wall');
  // ref.childNodes[0].childNodes[3].classList.add('wall');
  // ref.childNodes[0].childNodes[4].classList.add('wall');
  // ref.childNodes[1].childNodes[4].classList.add('wall');
  // ref.childNodes[2].childNodes[4].classList.add('wall');
  // ref.childNodes[3].childNodes[4].classList.add('wall');
  // ref.childNodes[4].childNodes[4].classList.add('wall');

  // ref.childNodes[0].childNodes[0].classList.add('start');
  // ref.childNodes[0].childNodes[1].classList.add('visited');
  // ref.childNodes[1].childNodes[1].classList.add('visited');
  // ref.childNodes[1].childNodes[2].classList.add('visited');
  // ref.childNodes[1].childNodes[3].classList.add('current');
  // ref.childNodes[4].childNodes[3].classList.add('end');

  // setTimeout(() => {
  //   ref.childNodes[1].childNodes[3].classList.replace('current', 'visited');

  //   ref.childNodes[2].childNodes[3].classList.add('current');
  // }, 1000);
}