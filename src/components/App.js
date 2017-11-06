import React, { Component } from 'react';
import Toolbar from '../components/Toolbar'
import Messages from '../components/Messages'
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
    console.log('toggleProperty: message from app js: ', message);
    console.log('toggleProperty: property from app js: ', property);
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
    console.log('toggleSelect: message from app.js: ', message);
    this.toggleProperty(message, 'selected')
  }

  // toggle star function
  toggleStar(message) {
    console.log('toggleSelect: message from app.js: ', message);
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
    const messages = this.state.messages.filter(message => !message.selected)
    this.setState({ messages })
  }

  // toggle select all
  toggleSelectAll() {
    const selectedMessages = this.state.messages.filter(message => message.selected)
    const selected = selectedMessages.length !== this.state.messages.length
    this.setState({
      messages: this.state.messages.map(message => (
        message.selected !== selected ? { ...message, selected } : message
      ))
    })
  }

  // apply label
  applyLabel(label) {
    const messages = this.state.messages.map(message => (
      message.selected && !message.labels.includes(label) ?
        { ...message, labels: [...message.labels, label].sort() } :
        message
    ))
    this.setState({ messages })
  }

  // remove label
  removeLabel(label) {
    const messages = this.state.messages.map(message => {
      const index = message.labels.indexOf(label)
      if (message.selected && index > -1) {
        return {
          ...message,
          labels: [
            ...message.labels.slice(0, index),
            ...message.labels.slice(index + 1)
          ]
        }
      }
      return message
    })
    this.setState({ messages })
  }

  // render DOM stuff
  render() {
    return (
      <div>
        <div className="navbar navbar-default" role="navigation">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="/">React Inbox</a>
            </div>
          </div>
        </div>

        <div className="container">
          <Toolbar
            messages={this.state.messages}
            markAsRead={this.markAsRead.bind(this)}
            markAsUnread={this.markAsUnread.bind(this)}
            deleteMessages={this.deleteMessages.bind(this)}
            toggleSelectAll={this.toggleSelectAll.bind(this)}
            applyLabel={this.applyLabel.bind(this)}
            removeLabel={this.removeLabel.bind(this)}
            />
          <Messages
            messages={this.state.messages}
            toggleSelect={this.toggleSelect.bind(this)}
            toggleStar={this.toggleStar.bind(this)}
            />
        </div>
      </div>
    );
  }

}

export default App;
