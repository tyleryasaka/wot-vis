import _ from 'underscore'

function getTrust(graph, source, target, visited = []) {
  if (source === target) {
    return 1
  }
  if (_.includes(visited, source)) {
    return 0
  }
  let newVisited = visited.slice(0) // clone array
  newVisited.push(source)
  const successors = graph.successors(source)
  const subScores = successors.map((successor) => {
    return getTrust(graph, successor, target, newVisited) / (2 * successors.length)
  })
  return subScores.reduce((acc, cur) => acc + cur, 0)
}

export default getTrust
