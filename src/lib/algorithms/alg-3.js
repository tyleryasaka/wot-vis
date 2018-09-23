import _ from 'underscore'

import graphConfig from '../../graph-config.json'
const { discount } = graphConfig

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
  const confidence = (1 - discount) / successors.length
  const doubts = successors.map((successor) => {
    const successorTrust = getTrust(graph, successor, target, newVisited)
    if (successor === target) {
      return 1 - confidence
    }
    return 1 - (successorTrust * confidence)
  })
  if (doubts.length === 0) {
    return 0
  } else {
    const totalDoubt = doubts.reduce((acc, cur) => acc * cur, 1)
    return 1 - totalDoubt
  }
}

export default getTrust
