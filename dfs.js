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

let stack = [];
stack.push(node);

while (stack.length > 0) {
  node = stack.pop();

  console.log(node);

  for (let neigh of graph[node]) {
    if (! visited.has(neigh)) {
      visited.add(neigh);
      stack.push(neigh);
    }
  }
}
