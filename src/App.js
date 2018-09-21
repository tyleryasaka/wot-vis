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

const graphVis = graphToVis(graph)

const options = {
  edges: {
    color: "#000000"
  }
}

const events = {
  select: function(event) {
    var { nodes, edges } = event;
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
          <Graph graph={graphVis} options={options} events={events} />
        </div>
      </div>
    );
  }
}

export default App;
