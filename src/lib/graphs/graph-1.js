const _ = require('underscore')
const graphlib = require('@dagrejs/graphlib')

function graphE() {
  let graph = new graphlib.Graph()
  const confusedNodes = [10]
  const badNodes = [14]
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
    ['B', 13],

    [10, 8],
    [8, 11],
    [9, 11],
    ['B', 11],
    [13, 11],

    [4, 11]
  ]
  const edges = [
    [10, 14]
  ]
  doubleEdges.forEach(([a, b]) => {
    graph.setEdge(String(a), String(b))
    graph.setEdge(String(b), String(a))
  })
  edges.forEach(([a, b]) => {
    graph.setEdge(String(a), String(b))
  })
  confusedNodes.forEach(node => {
    graph.setNode(node, 'confused')
  })
  badNodes.forEach(node => {
    graph.setNode(node, 'bad')
  })
  return graph
}

module.exports = graphE()
