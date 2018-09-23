import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Graph from 'react-graph-vis'
import graphLib from '@dagrejs/graphlib'
import githubLogo from './github-logo.svg'

import algorithm1Fn from './lib/algorithms/alg-1'
import algorithm2Fn from './lib/algorithms/alg-2'
import algorithm3Fn from './lib/algorithms/alg-3'

import graphObj1 from './lib/graphs/graph-e'
import graphObj2 from './lib/graphs/graph-c'
import graphObj3 from './lib/graphs/graph-b'
import graphObj4 from './lib/graphs/graph-a'
import graphObj5 from './lib/graphs/graph-f'
import graphObj6 from './lib/graphs/graph-g'

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

const MODAL_ALGORITHM = 'algorithm'
const MODAL_GRAPH = 'graph'

const ALGORITHMS = [
  { name: '#1', fn: algorithm1Fn },
  { name: '#2', fn: algorithm2Fn },
  { name: '#3', fn: algorithm3Fn }
]

const GRAPHS = [
  { name: '#1', obj: graphObj1 },
  { name: '#2', obj: graphObj2 },
  { name: '#3', obj: graphObj3 },
  { name: '#4', obj: graphObj4 },
  { name: '#5', obj: graphObj5 },
  { name: '#6', obj: graphObj6 }
]

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentModal: null,
      algorithm: ALGORITHMS[0],
      mode: MODE_DEFAULT,
      measureTrust: { from: null, to: null },
      graph: GRAPHS[0],
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

  openModalAlgorithm() {
    this.setState({ currentModal: MODAL_ALGORITHM })
  }

  onAlgorithmSelect(index) {
    this.setState({ algorithm: ALGORITHMS[index], currentModal: null })
  }

  openModalGraph() {
    this.setState({ currentModal: MODAL_GRAPH })
  }

  onGraphSelect(index) {
    this.setState({
      graph: GRAPHS[index],
      measureTrust: { from: null, to: null },
      currentModal: null
    })
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
    const {
      mode,
      measureTrust: { from, to },
      graph,
      algorithm,
      visOptions,
      currentModal
    } = this.state
    const graphVis = this.graphToVis(graph.obj)
    const trust = (from && to) ? algorithm.fn(graph.obj, from, to) : null

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

    const modalBackdrop = (currentModal) && (
      <div className="modal-backdrop">
        hi
      </div>
    )

    const modalAlgorithm = (currentModal === MODAL_ALGORITHM) && (
      <div className="modal algorithm">
        select algorithm
        {
          ALGORITHMS.map((algorithm, index) =>
            <div className="selection-option" onClick={this.onAlgorithmSelect.bind(this, index)}>
              {algorithm.name}
            </div>
          )
        }
      </div>
    )

    const modalGraph = (currentModal === MODAL_GRAPH) && (
      <div className="modal graph">
        select graph
        {
          GRAPHS.map((graph, index) =>
            <div className="selection-option" onClick={this.onGraphSelect.bind(this, index)}>
              {graph.name}
            </div>
          )
        }
      </div>
    )

    return (
      <div className="App">
        <div className="container">
        {modalBackdrop}
        {modalAlgorithm}
        {modalGraph}
        <div className="panel">
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
            <div className="selection graph" onClick={this.openModalGraph.bind(this)}>
              graph: {graph.name}
            </div>
            <div className="selection algorithm" onClick={this.openModalAlgorithm.bind(this)}>
              algorithm: {algorithm.name}
            </div>
          </div>
          <div className="links">
            <a href="https://github.com/tyleryasaka/wot-vis" target="_blank">
              <img src={githubLogo} className="github" />
            </a>
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
