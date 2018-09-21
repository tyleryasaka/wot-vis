const _ = require('underscore')
const graphlib = require("@dagrejs/graphlib")

function graphF() {
  let graph = new graphlib.Graph()
  _.range(1, 14).forEach((i) => {
    graph.setNode(String(i), { type: 1 })
  })
  _.range(15, 21).forEach((i) => {
    graph.setNode(String(i), { type: 0 })
  })
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

module.exports = graphF
