const _ = require('underscore')
const graphlib = require('@dagrejs/graphlib')

function graphE() {
  let graph = new graphlib.Graph()
  const confusedNodes = [10, 11]
  const badNodes = _.range(14, 27).concat('C')
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
    [10, 14],
    [11, 14],

    [14, 15],
    [14, 16],
    [14, 17],
    [14, 18],
    [14, 19],
    [14, 20],
    [14, 21],
    [14, 22],
    [14, 23],
    [14, 24],
    [14, 25],
    [14, 26],

    [15, 'C'],
    [16, 'C'],
    [17, 'C'],
    [18, 'C'],
    [19, 'C'],
    [20, 'C'],
    [21, 'C'],
    [22, 'C'],
    [23, 'C'],
    [24, 'C'],
    [25, 'C'],
    [26, 'C']
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
