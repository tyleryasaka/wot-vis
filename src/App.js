import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Graph from 'react-graph-vis';
import graphLib from '@dagrejs/graphlib'

import graphConfig from './graph-config.json'
const { startGraph = 'a' } = graphConfig

const graph = require(`./lib/graphs/graph-${startGraph}`)

const graphToVis = (graphObj) => {
  const graphJson = graphLib.json.write(graphObj)
  const nodes = graphJson.nodes.map(node => {
    return { id: node.v, label: node.v }
  })
  const edges = graphJson.edges.map(edge => {
    return { from: edge.v, to: edge.w }
  })
  return { nodes, edges }
}

const options = {
  edges: {
    color: "#000000"
  }
}

const MODE_SELECT_FROM = 'select-from'
const MODE_SELECT_TO = 'select-to'

const MODE_STATUS = {}
MODE_STATUS[MODE_SELECT_FROM] = 'Select the observer node'
MODE_STATUS[MODE_SELECT_TO] = 'Select the observed node'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: null,
      measureTrust: { from: null, to: null }
    }
  }

  modeReset() {
    this.setState({ mode: null })
  }

  modeSelectFrom() {
    this.setState({ mode: MODE_SELECT_FROM })
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
    const { mode, measureTrust: { from, to } } = this.state
    const graphVis = graphToVis(graph)

    const events = {
      select: (event) => {
        const { nodes, edges } = event;
        this.onNodeSelect(nodes, edges)
      }
    }

    const status = MODE_STATUS[mode]

    return (
      <div className="App">
        <div className="container">
          <div className="controls section">
            <div className="section">
              <div>
                Trust from {from}, to {to}:
              </div>
              <button onClick={this.modeSelectFrom.bind(this)}>
                measure trust
              </button>
            </div>
            <div className="section">
              {status}
            </div>
          </div>
          <div className="display section">
            <Graph graph={graphVis} options={options} events={events} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
