import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Graph from 'react-graph-vis';
import graphA from './lib/graphs/graph-a'
import graphLib from '@dagrejs/graphlib'

const graphAJson = graphLib.json.write(graphA())

const graph = {
  nodes: [
    {id: 1, label: 'Node 1'},
    {id: 2, label: 'Node 2'},
    {id: 3, label: 'Node 3'},
    {id: 4, label: 'Node 4'},
    {id: 5, label: 'Node 5'}
  ],
  edges: [
    {from: 1, to: 2},
    {from: 1, to: 3},
    {from: 2, to: 4},
    {from: 2, to: 5}
  ]
}

const options = {
  layout: {
    hierarchical: true
  },
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
          <Graph graph={graph} options={options} events={events} />
        </div>
      </div>
    );
  }
}

export default App;
