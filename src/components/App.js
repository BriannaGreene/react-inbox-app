import React, { Component } from 'react';
import Toolbar from '../components/Toolbar'
import Compose from '../components/Compose'
import Messages from '../components/Messages'
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = { messages: [] }
  }

  async componentDidMount() {
    const response = await this.request(`/api/messages`)
    const json = await response.json()
    console.log('messages from componentDidMount: ', json._embedded.messages);
    this.setState({messages: json._embedded.messages})
  }

  async request(path, method = 'GET', body = null) {
    if (body) body = JSON.stringify(body)
    console.log('body from request: ', body)
    return await fetch(`${process.env.REACT_APP_API_URL}${path}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: body
    })
  }

  async updateMessages(payload) {
    console.log('payload from updateMessages: ', payload);
    await this.request('/api/messages', 'PATCH', payload)
  }

  // toggle property function
  toggleProperty(message, property) {
    console.log('property from toggle: ', property);
    const index = this.state.messages.indexOf(message)
    this.setState({
      messages: [
        ...this.state.messages.slice(0, index),
        // WHAT IS THIS LINE DOING?
        { ...message, [property]: !message.property },
        ...this.state.messages.slice(index + 1)
      ]
    })
  }

  // toggle select function
  async toggleSelect(message) {
    this.toggleProperty(message, 'selected')
  }

  // toggle star function
  async toggleStar(message) {
    await this.updateMessages({
      "messageIds": [ message.id ],
      "command": "star",
      "star": message.starred
    })
    this.toggleProperty(message, 'starred')
    console.log('updated messages from togglestar: ', this.state.messages);
  }

  // mark as read function
  async markAsRead() {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "read",
      "read": true
    })
    this.setState({
      messages: this.state.messages.map(message => (
        message.selected ? { ...message, read: true } : message
      ))
    })
  }

  // mark as unread function
  async markAsUnread() {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "read",
      "read": false
    })
    this.setState({
      messages: this.state.messages.map(message => (
        message.selected ? { ...message, read: false } : message
      ))
    })
  }

  // delete messages
  async deleteMessages() {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "delete"
    })
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

  toggleCompose() {
    this.setState({ composing: !this.state.composing })
  }

  // apply label
  async applyLabel(label) {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "addLabel",
      "label": label
    })
    const messages = this.state.messages.map(message => (
      message.selected && !message.labels.includes(label) ?
        { ...message, labels: [...message.labels, label].sort() } :
        message
    ))
    this.setState({ messages })
  }

  // remove label
  async removeLabel(label) {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "removeLabel",
      "label": label
    })
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

  async sendMessage(message) {
    const response = await this.request('/api/messages', 'POST', {
      subject: message.subject,
      body: message.body,
    })
    const newMessage = await response.json()
    const messages = [...this.state.messages, newMessage]
    this.setState({
      messages,
      composing: false,
    })
  }

  // render DOM stuff
  render() {
    return (
      <div>
        <div className="navbar navbar-default" role="navigation">
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand" href="/">Bri's Magic React Inbox with API integration and Redux</a>
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
            toggleCompose={this.toggleCompose.bind(this)}
            applyLabel={this.applyLabel.bind(this)}
            removeLabel={this.removeLabel.bind(this)}
            />
          {
            this.state.composing ?
              <Compose sendMessage={this.sendMessage.bind(this)} /> :
              null
          }
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
