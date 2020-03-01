window.onload = () => init();

const speedInput = document.getElementById('c1ff312f-ff79-43b8-8b42-4b503c44ff07');
const sizeInput = document.getElementById('38e1e422-4904-40be-af57-9d66f6e64ff2');
const wallSaturationInput = document.getElementById('5d634d76-6797-48c5-8945-84b17b41523a');

const refBacktracking = document.getElementById('e9376c88-483f-4117-9152-8cbdeb4be6c5');

const refRunButton = document.getElementById('9df5600b-6754-4fd3-a506-a2796c251ccc');

const refGrid = document.getElementById('ae01c4af-9296-4976-9a53-c7b881ebd683');

let size;
let speed;

let isDone;
let isRunning;

let grid;

let start;
let end;
let current;

let walls;
let visited;
let stack;

function init () {
  refGrid.innerHTML = null;

  speed = speedInput.value;
  size = sizeInput.value;

  isDone = false;
  isRunning = false;

  updateRunButton();

  grid = [];
  for (let row = 0; row < size; row++) {
    grid.push([]);
    const el = refGrid.appendChild(createEl('div', { className: 'row' }, ''));

    for (let col = 0; col < size; col++) {
      grid[row].push(col);
      el.appendChild(createEl('div', { className: 'node' }, ''));
    }
  }

  start = [0, Math.floor(Math.random(0, 1) * size)];
  end = [size - 1, Math.floor(Math.random(0, 1) * size)];
  walls = generateWalls(size, wallSaturationInput.value, start, end);

  current = start;
  stack = [start];
  visited = [start];

  paint(refGrid, start, end, walls);
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

function run () {
  if (! isDone) {
    isRunning = ! isRunning;
    updateRunButton();
    move();
  }
}

function updateRunButton () {
  if (isRunning) {
    refRunButton.innerText = '\u25A0';
    refRunButton.classList.replace('bg-green', 'bg-red')
  } else {
    refRunButton.innerText = '\u21E2';
    refRunButton.classList.replace('bg-red', 'bg-green')
  }
}

function move () {
  if (isRunning && ! isDone) {
    let adv = advance(current, size, walls, visited);

    if (adv) {
      let [newRow, newCol] = adv;
      refGrid.childNodes[current[0]].childNodes[current[1]].classList.replace('current', 'visited');
      stack.push(current);
      current = adv;
      visited.push(adv);

      if (newRow === end[0] && newCol === end[1]) {
        refGrid.childNodes[current[0]].childNodes[current[1]].classList.replace('end', 'start');

        finished();
      } else {
        refGrid.childNodes[newRow].childNodes[newCol].classList.add('current');

        if (speed == 0) {
          move();
        } else {
          setTimeout(() => move(), speed);
        }
      }
    } else if (stack.length > 0) {
      refGrid.childNodes[current[0]].childNodes[current[1]].classList.replace('current', 'visited');
      current = stack.pop();

      if (refBacktracking.checked) {
        refGrid.childNodes[current[0]].childNodes[current[1]].classList.replace('visited', 'current');
        setTimeout(() => move(), speed);
      } else {
        move();
      }
    } else {
      finished();
    }
  }
}

function finished () {
  isDone = true;
  isRunning = false;
  updateRunButton();
}

function advance (point, size, walls, visited) {
  const [r, c] = point;

  for (let i = 0; i < 4; i++) {
    let problems = 0;

    // ^, >, v, <
    let newRow = r + [-1, 0, 1, 0][i];
    let newCol = c + [0, 1, 0, -1][i];

    // check bounds
    if (newRow < 0 || newCol < 0 || newRow >= size || newCol >= size) {
      continue;
    }

    // check walls
    for (const [row, col] of walls) {
      if (newRow === row && newCol === col) {
        problems++;
        break;
      }
    }

    // check visited
    for (const [row, col] of visited) {
      if (newRow === row && newCol === col) {
        problems++;
        break;
      }
    }

    if (problems > 0) {
      continue;
    }

    return [newRow, newCol];
  }

  return null;
}

function paint (ref, start, end, walls) {
  ref.childNodes[start[0]].childNodes[start[1]].classList.add('start');
  ref.childNodes[end[0]].childNodes[end[1]].classList.add('end');

  for (const [row, col] of walls) {
    ref.childNodes[row].childNodes[col].classList.add('wall');
  }
}
