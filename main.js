window.onload = () => init();

function init () {
  const m = 10;
  const grid = generateGrid(m);
  const ref = document.getElementById('grid');

  for (const [i, row] of Object.entries(grid)) {
    const el = ref.appendChild(createEl('div', { className: 'row' }, ''));

    for (const col of row) {
      el.appendChild(createEl('div', { className: 'node' }, ''));
      // el.appendChild(createEl('div', { className: 'node' }, `${i},${col}`));
    }
  }

  const start = getRandomStartPoint(m);
  const end = getRandomEndPoint(m);
  console.log(start, end);
  const walls = generateWalls(m);

  paint(ref, start, end, walls);
}

function generateGrid (m) {
  const grid = [];

  for (let row = 0; row < m; row++) {
    grid.push([]);

    for (let col = 0; col < m; col++) {
      grid[row].push(col);
    }
  }

  return grid;
}

function getRandomStartPoint (m) {
  return [0, Math.round(Math.random(0, 1) * m)];
}

function getRandomEndPoint (m) {
  return [9, Math.round(Math.random(0, 1) * m)];
}

function generateWalls (m) {
  const grid = [];

  for (let row = 0; row < m; row++) {
    grid.push([]);

    for (let col = 0; col < m; col++) {
      grid[row].push(Math.round(Math.random(0, 1) * 100) > 75);
    }
  }

  return grid;
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

  for (const [iRow, row] of Object.entries(walls)) {
    for (const [iCol, col] of Object.entries(row)) {
      if (col) {
        ref.childNodes[iRow].childNodes[iCol].classList.add('wall');
      }
    }
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