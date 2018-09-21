const _ = require('underscore')
const graphlib = require("@dagrejs/graphlib")

function graphB() {
  let graph = new graphlib.Graph()
  _.range(0, 10).forEach((i) => {
    graph.setNode(String(i), { type: 1 })
  })
  graph.setEdge('0', '1')
  graph.setEdge('1', '2')
  graph.setEdge('2', '3')
  graph.setEdge('3', '1')
  return graph
}

module.exports = graphB
