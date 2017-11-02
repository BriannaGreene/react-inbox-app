import React, { Component } from 'react';
import Messages from '../components/Messages'
import './App.css';

class App extends Component {
  // make constructor
  constructor(props) {
    super(props)
    this.state = { messages: props.messages }
  }

  // toggle property function

  // toggle select function

  // toggle star function

  // mark as read function

  // mark as unread function

  // delete messages

  // toggle select all

  // apply label

  // remove label

  // render DOM stuff
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
