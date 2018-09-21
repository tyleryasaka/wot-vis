const graphlib = require("@dagrejs/graphlib")

function graphB() {
  let graph = new graphlib.Graph()
  graph.setEdge('0', '1')
  graph.setEdge('1', '2')
  graph.setEdge('2', '3')
  graph.setEdge('3', '1')
  return graph
}

module.exports = graphB()
