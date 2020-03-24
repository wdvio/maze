window.onload = () => {
  restart();

  bindKeys();
};

const refGrid = document.getElementById('ae01c4af-9296-4976-9a53-c7b881ebd683');

const n = 12;
const saturation = 35;
const grid = [];
let walls = [];
let distances = {};
const start = {};
const end = {};
const current = {};

function restart () {
  renderGrid();

  walls = [];
  distances = {};

  setRandomStartPoint();
  setCurrentPoint();
  setRandomEndPoint();
  generateWalls();

  if (! distances.hasOwnProperty(toIndex(current.row, current.col))) {
    distances[toIndex(current.row, current.col)] = calculateDistance(current.row, current.col, true);
  }
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
  start.row = 4;
  start.col = 7;

  refGrid.childNodes[start.row].childNodes[start.col].classList.add('start');
}

function setCurrentPoint () {
  current.row = start.row;
  current.col = start.col;
}

function setRandomEndPoint () {
  end.row = 1;
  end.col = 4;

  refGrid.childNodes[end.row].childNodes[end.col].classList.add('end');
}

function generateWalls () {
  walls.push(JSON.stringify([1, 3]));
  walls.push(JSON.stringify([2, 3]));
  walls.push(JSON.stringify([2, 4]));
  walls.push(JSON.stringify([2, 5]));
  walls.push(JSON.stringify([2, 6]));
  walls.push(JSON.stringify([2, 7]));

  refGrid.childNodes[1].childNodes[3].classList.add('wall');
  refGrid.childNodes[2].childNodes[3].classList.add('wall');
  refGrid.childNodes[2].childNodes[4].classList.add('wall');
  refGrid.childNodes[2].childNodes[5].classList.add('wall');
  refGrid.childNodes[2].childNodes[6].classList.add('wall');
  refGrid.childNodes[2].childNodes[7].classList.add('wall');

}

// function generateWalls () {
//   for (let row = 0; row < n; row++) {
//     for (let col = 0; col < n; col++) {
//       if (Math.round(Math.random(0, 1) * 100) < saturation) {
//         if (start.row !== row || start.col !== col) {
//           if (end.row !== row || end.col !== col) {
//             refGrid.childNodes[row].childNodes[col].classList.add('wall');

//             walls.push(JSON.stringify([row, col]));
//           }
//         }
//       }
//     }
//   }
// }

function move () {
  for (let i = 0; i < 4; i++) {
    const rr = current.row + [-1, 0, 1, 0][i];
    const cc = current.col + [0, 1, 0, -1][i];

    if (rr < 0 || cc < 0 || rr >= n || cc >= n) {
      continue;
    }

    if (walls.includes(JSON.stringify([rr, cc]))) {
      continue;
    }

    if (! distances.hasOwnProperty(toIndex(rr, cc))) {
      distances[toIndex(rr, cc)] = calculateDistance(rr, cc);
    }
  }

  let min = Infinity;
  for (const [_, distance] of Object.entries(distances)) {
    if (! distance.v) {
      if (distance.f < min) {
        min = distance.f;
      }
    }
  }

  const arr = [];
  for (const [_, distance] of Object.entries(distances)) {
    if (! distance.v && distance.f === min) {
      arr.push({ _: distance });
    }
  }

  console.log(arr);
}

function calculateDistance (r, c, v = false) {
  const g = Math.abs(start.row - r) + Math.abs(start.col - c);
  const h = Math.abs(end.row - r) + Math.abs(end.col - c);

  return { g, h, f: g + h, v };
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