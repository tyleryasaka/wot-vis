const graphlib = require("@dagrejs/graphlib")

function graphA() {
  let graph = new graphlib.Graph()
  graph.setEdge('0', '1')
  graph.setEdge('1', '2')
  graph.setEdge('0', '6')
  graph.setEdge('6', '5')
  graph.setEdge('5', '4')
  graph.setEdge('4', '3')
  graph.setEdge('3', '2')
  return graph
}

module.exports = graphA()
