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
MODE_STATUS[MODE_SELECT_FROM] = 'select the observer node'
MODE_STATUS[MODE_SELECT_TO] = 'select the target node'

const NODE_GOOD = 'good'
const NODE_BAD = 'bad'
const NODE_CONFUSED = 'confused'

const NODE_COLORS = {}
NODE_COLORS[NODE_GOOD] = '#39ff7b'
NODE_COLORS[NODE_BAD] = '#ff3aa9'
NODE_COLORS[NODE_CONFUSED] = '#37c3ff'

const OBSERVER_NODE_COLOR = '#fff'
const TARGET_NODE_COLOR = '#fff'

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

  onNodeSelect(node) {
    const { mode } = this.state
    if (mode === MODE_SELECT_FROM) {
      this.setFrom(node)
      this.modeSelectTo()
    } else if (mode === MODE_SELECT_TO) {
      this.setTo(node)
      this.modeReset()
    }
  }

  graphToVis(graphObj) {
    const { from, to } = this.state.measureTrust
    const graphJson = graphLib.json.write(graphObj)
    const nodes = graphJson.nodes.map(node => {
      const value = node.value || 'good'
      const id = node.v
      let color = NODE_COLORS[value]
      if (id === from) {
        color = OBSERVER_NODE_COLOR
      } else if (id === to) {
        color = TARGET_NODE_COLOR
      }
      return {
        id,
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

  render() {
    const { mode, measureTrust: { from, to }, graph, algorithm, visOptions } = this.state
    const graphVis = this.graphToVis(graph)
    const trust = (from && to) ? algorithm(graph, from, to) : null

    const events = {
      select: (event) => {
        const { nodes, edges } = event;
        if (nodes.length) {
          this.onNodeSelect(nodes[0])
        }
      }
    }

    let buttonText, helpText
    if (mode === MODE_DEFAULT) {
      buttonText = 'measure trust'
      helpText = (from && to) ? (`trust = ${trust}`) : ''
    } else if ((mode === MODE_SELECT_FROM) || (mode === MODE_SELECT_TO)) {
      buttonText = 'restart'
      helpText = MODE_STATUS[mode]
    }

    return (
      <div className="App">
        <div className="container">
          <div className="legend">
            <div className="legend-item good">
              good nodes
            </div>
            <div className="legend-item bad">
              bad nodes
            </div>
            <div className="legend-item confused">
              confused nodes
            </div>
          </div>
          <div className="controls section">
            <div className="trust-score">
              {helpText}
            </div>
            <div onClick={this.modeSelectFrom.bind(this)} className="button">
              {buttonText}
            </div>
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
