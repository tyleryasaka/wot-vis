const _ = require('underscore')
const graphlib = require('@dagrejs/graphlib')

function graph() {
  let graph = new graphlib.Graph()
  const edges = [
    [1, 2],
    [1, 3],
    [2, 4],
    [3, 4]
  ]
  edges.forEach(([a, b]) => {
    graph.setEdge(String(a), String(b))
  })
  return graph
}

module.exports = graph()
