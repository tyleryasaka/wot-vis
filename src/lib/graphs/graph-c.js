const graphlib = require("@dagrejs/graphlib")

function graphC() {
  let graph = new graphlib.Graph()
  const doubleEdges = [
    [1, 2],
    [2, 'A'],
    ['A', 7],
    [7, 6],
    [6, 3],
    [3, 1],
    [1, 4],
    [2, 4],
    ['A', 4],
    [7, 4],
    [6, 4],
    [3, 4],

    [8, 9],
    [9, 'B'],
    ['B', 14],

    [10, 8],
    [8, 11],
    [9, 11],
    ['B', 11],
    [10, 11],

    [4, 11]
  ]
  const edges = [
    [10, 13],
    [14, 13],

    [13, 15],
    [13, 16],
    [13, 17],
    [13, 18],
    [13, 19],
    [13, 20],
    [13, 21],
    [13, 22],
    [13, 23],

    [15, 'C'],
    [16, 'C'],
    [17, 'C'],
    [18, 'C'],
    [19, 'C'],
    [20, 'C'],
    [21, 'C'],
    [22, 'C'],
    [23, 'C'],
  ]
  doubleEdges.forEach(([a, b]) => {
    graph.setEdge(String(a), String(b))
    graph.setEdge(String(b), String(a))
  })
  edges.forEach(([a, b]) => {
    graph.setEdge(String(a), String(b))
  })
  return graph
}

module.exports = graphC()
