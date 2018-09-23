import _ from 'underscore'

// returns array
function getConnectionsHelp(graph, source, target, current, distance, visited) {
  if (current === source) {
    return []
  } else if (current === target) {
    return [ distance ]
  } else {
    let connectionArrs = graph.successors(current).map((successor) => {
      if (!_.includes(visited, successor)) {
        let newVisited = visited.slice(0) // clone array
        newVisited.push(successor)
        return getConnectionsHelp(graph, source, target, successor, distance + 1, newVisited)
      } else {
        return []
      }
    })
    return flatten(connectionArrs)
  }
}

// returns array
function getConnections(graph, source, target) {
  let results = graph.successors(source).map((successor) => {
    return getConnectionsHelp(graph, source, target, successor, 1, [])
  })
  return flatten(results)
}

function flatten(arrays) {
  return [].concat.apply([], arrays)
}

function gravityWeight(e) {
  return 1 / Math.pow(2, e-1)
}

function getTrust(graph, source, target, weightFn = gravityWeight) {
  let connections = getConnections(graph, source, target)
  return connections.reduce((acc, cur) => acc + weightFn(cur), 0)
}

export default getTrust
