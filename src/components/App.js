import React, { Component } from 'react';
// import Messages from '../components/Messages'
import './App.css';

class App extends Component {
  // make constructor
  constructor(props) {
    super(props)
    this.state = { messages: props.messages }
    console.log('this.state from App.js: ', this.state);
  }

  // toggle property function
  toggleProperty(message, property) {
    console.log('message from app js: ', message);
    console.log('property from app js: ', property);
    this.setState(prevState => {
      const index = prevState.messages.indexOf(message)
      return {
        messages: [
          ...prevState.messages.slice(0, index),
          { ...message, [property]: !message[property] },
          ...prevState.messages.slice(index + 1)
        ]
      }
    })
  }

  // toggle select function
  toggleSelect(message) {
    this.toggleProperty(message, 'selected')
  }

  // toggle star function
  toggleStar(message) {
    this.toggleProperty(message, 'starred')
  }

  // mark as read function
  markAsRead() {
    this.setState(prevState => {
      return {
        messages: prevState.messages.map(message => (
          message.selected ? { ...message, read: true } : message
        ))
      }
    })
  }

  // mark as unread function
  markAsUnread() {
    this.setState(prevState => {
      return {
        messages: prevState.messages.map(message => (
          message.selected ? { ...message, read: false } : message
        ))
      }
    })
  }

  // delete messages
  deleteMessages() {
    this.setState(prevState => {
      const messages = prevState.messages.filter(message => !message.selected)
      return { messages }
    })
  }

  // toggle select all

  // apply label

  // remove label

  // render DOM stuff
  render() {
    return (
      <div className="container">
        <h3>Hello</h3>
      </div>
    );
  }
  
}

export default App;
