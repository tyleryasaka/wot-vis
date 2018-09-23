import _ from 'underscore'

function getHops(graph, source, target, hops = 0, visited = []) {
  if (source === target) {
    return hops
  }
  if (_.includes(visited, source)) {
    return null
  }
  let newVisited = visited.slice(0) // clone array
  newVisited.push(source)
  const hopsList = graph.successors(source).map((successor) => {
    return getHops(graph, successor, target, hops + 1, newVisited)
  })
  return hopsList.length
    ? _.min(hopsList.filter(hops => hops !== null))
    : null
}

function getTrust(graph, source, target) {
  const hops  = getHops(graph, source, target)
  return hops === null
    ? 0
    : 1 / (1 + hops)
}

export default getTrust
