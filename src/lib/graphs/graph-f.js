const _ = require('underscore')
const graphlib = require("@dagrejs/graphlib")

function graphF() {
  let graph = new graphlib.Graph()
  const edges = [
    ['A', 1],
    ['A', 2],
    [1, 'B'],
    [2, 'B'],
    ['B', 'C'],
  ]
  edges.forEach(([a, b]) => {
    graph.setEdge(String(a), String(b))
  })
  return graph
}

module.exports = graphF()
