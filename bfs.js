let graph = {
  a: ['b', 'c'],
  b: ['a', 'd'],
  c: ['a', 'e'],
  d: ['b', 'e', 'f'],
  e: ['c', 'd', 'f'],
  f: ['d', 'e']
};

let node = 'a';
let visited = new Set();
visited.add(node);

let queue = [];
queue.push(node);

while (queue.length > 0) {
  node = queue.shift();

  console.log(node);

  for (let neigh of graph[node]) {
    if (! visited.has(neigh)) {
      visited.add(neigh);
      queue.push(neigh);
    }
  }
}
