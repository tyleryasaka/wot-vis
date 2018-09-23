import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Graph from 'react-graph-vis';
import graphLib from '@dagrejs/graphlib'

import graphConfig from './graph-config.json'
const {
  initialGraph: initialGraphName,
  initialAlgorithm: initialAlgorithmName
} = graphConfig

const initialGraph = require(`./lib/graphs/graph-${initialGraphName}`)
const initialAlgorithm = require(`./lib/algorithms/alg-${initialAlgorithmName}`)

const MODE_SELECT_FROM = 'select-from'
const MODE_SELECT_TO = 'select-to'
const MODE_DEFAULT = 'default'

const MODE_STATUS = {}
MODE_STATUS[MODE_SELECT_FROM] = 'Select the observer node'
MODE_STATUS[MODE_SELECT_TO] = 'Select the observed node'

const NODE_GOOD = 'good'
const NODE_BAD = 'bad'
const NODE_CONFUSED = 'confused'

const NODE_COLORS = {}
NODE_COLORS[NODE_GOOD] = '#39ff7b'
NODE_COLORS[NODE_BAD] = '#ff3aa9'
NODE_COLORS[NODE_CONFUSED] = '#37c3ff'

const graphToVis = (graphObj) => {
  const graphJson = graphLib.json.write(graphObj)
  const nodes = graphJson.nodes.map(node => {
    const value = node.value || 'good'
    const color = NODE_COLORS[value]
    return {
      id: node.v,
      // label: node.v,
      borderWidth: 0,
      color
    }
  })
  const edges = graphJson.edges.map(edge => {
    return {
      id: `${edge.v}-${edge.w}`,
      from: edge.v,
      to: edge.w
    }
  })
  return { nodes, edges }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: MODE_DEFAULT,
      measureTrust: { from: null, to: null },
      graph: initialGraph,
      algorithm: initialAlgorithm,
      visOptions: {
        edges: {
          smooth: {
            enabled: true
          },
          chosen: {
            edge: (values => {
              values.opacity = 0.9
            })
          },
          color: {
            opacity: 0.25
          },
          width: 3
        }
      }
    }
  }

  modeReset() {
    this.setState({ mode: MODE_DEFAULT })
  }

  modeSelectFrom() {
    this.setState({
      mode: MODE_SELECT_FROM,
      measureTrust: { from: null, to: null }
    })
  }

  modeSelectTo() {
    this.setState({ mode: MODE_SELECT_TO })
  }

  setFrom(from) {
    this.setState({ measureTrust: { ...this.state.measureTrust, from } })
  }

  setTo(to) {
    this.setState({ measureTrust: { ...this.state.measureTrust, to } })
  }

  onNodeSelect(nodes, edges) {
    const { mode } = this.state
    if (mode === MODE_SELECT_FROM) {
      this.setFrom(nodes[0])
      this.modeSelectTo()
    } else if (mode === MODE_SELECT_TO) {
      this.setTo(nodes[0])
      this.modeReset()
    }
  }

  render() {
    const { mode, measureTrust: { from, to }, graph, algorithm, visOptions } = this.state
    const graphVis = graphToVis(graph)
    const trust = (from && to) ? algorithm(graph, from, to) : null

    const events = {
      select: (event) => {
        const { nodes, edges } = event;
        this.onNodeSelect(nodes, edges)
      }
    }

    const status = MODE_STATUS[mode]
    let dashView
    if (mode === MODE_DEFAULT) {
      dashView = (
        <div>
          { from && to && (
            <div>
              Trust from {from} to {to}: {trust}
            </div>
          ) }
          <button onClick={this.modeSelectFrom.bind(this)}>
            measure trust
          </button>
        </div>
      )
    } else if ((mode === MODE_SELECT_FROM) || (mode === MODE_SELECT_TO)) {
      dashView = (
        <div>
          {status}
        </div>
      )
    }

    return (
      <div className="App">
        <div className="container">
          <div className="controls section">
            {dashView}
          </div>
          <div className="display section">
            <Graph graph={graphVis} options={visOptions} events={events} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
