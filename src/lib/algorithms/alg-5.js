import _ from 'underscore'

import graphConfig from '../../graph-config.json'
const { discount, iterations } = graphConfig

/*
  This is a probability based approach.
  The probability that a the target is trustworthy is the probability
  that at least one of the paths to the target does not contain an erroneous
  trust, or one minus the probability that all of the paths contain an
  erroneous trust.
  The probability that a path contains an error is one minus the confidence
  of that path.
  So we calculate the "doubt" for each path (the probability that it contains
  an error), and then multiply these together (the probability that each of
  these independent events is true). We then subtract this number from one
  to get the final confidence.
*/

class TrustTable {
  constructor() {
    this.table = {}
  }

  get(a, b) {
    return (this.table[a] && this.table[a][b]) || 0
  }

  set(a, b, value) {
    if (!this.table[a]) {
      this.table[a] = {}
    }
    this.table[a][b] = value
  }
}

// The implementation of this algorithm is inspired by the iterative technique
// used by pagerank to handle cyclic dependencies, hence the name trustRank.
function trustRank(graph, source, target, trustTable) {
  if (source === target) {
    return 1
  }
  const successors = graph.successors(source)
  if (successors.length === 0) {
    return 0
  }
  const doubts = successors.map((successor) => {
    const successorTrust = (1 - discount) * trustTable.get(successor, target)
    return 1 - successorTrust
  })
  const totalDoubt = doubts.reduce((acc, cur) => acc * cur, 1)
  return 1 - totalDoubt
}

function getTrust(graph, source, target, visited = []) {
  const trustTable = new TrustTable()
  _.range(0, iterations).forEach(() => {
    graph.nodes().forEach((a) => {
      graph.nodes().forEach((b) => {
        trustTable.set(a, b, trustRank(graph, a, b, trustTable))
      })
    })
  })
  return trustTable.get(source, target)
}

export default getTrust
