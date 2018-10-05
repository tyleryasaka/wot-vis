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
  const doubts = successors.map((successor) => {
    const successorTrust = (1 - discount) * getTrust(graph, successor, target, newVisited)
    return 1 - successorTrust
  })
  const totalDoubt = doubts.reduce((acc, cur) => acc * cur, 1)
  return 1 - totalDoubt
}

export default getTrust
