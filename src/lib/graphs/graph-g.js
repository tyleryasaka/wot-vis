const _ = require('underscore')
const graphlib = require("@dagrejs/graphlib")

function graphF() {
  let graph = new graphlib.Graph()
  const edges = [
    ['A', 1],
    ['A', 2],
    [1, 11],
    [1, 12],
    [2, 13],
    [2, 14],
    [2, 15],
    [2, 'C']
  ]
  edges.forEach(([a, b]) => {
    graph.setEdge(String(a), String(b))
  })
  return graph
}

module.exports = graphF
