import React, { Component } from 'react';
import {Link} from 'react-router';
import Form from '../modules/Form';
import MapList from '../modules/MapList';
import backend from '../modules/backend';
import hue from '../modules/hue';

class DashButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
  }

  componentDidMount() {
    backend.buttons().then(res => this.setState({items: res.data}))
  }

  render() {
    return (
      <div>
        <div className="sidebar">
          <h2>Dash Buttons</h2>
          <MapList items={this.state.items} resource="dash-buttons" selected={this.props.params.id} />
          <Link className="pure-button pure-button-primary add-button" to="/dash-buttons/new">New</Link>
        </div>
        <div className="main" key={this.props.params.id}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

class DashButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: {}
    };
  }

  componentDidMount() {
    const id = this.props.params.id;
    backend.buttons().then(res => {
      this.setState({item: res.data[id]})
    });
  }

  fields() {
    return [
      {name: 'name', label: 'Name'},
      {name: 'lights', label: 'Lights', type: 'check', options: this.options('lights')},
      {name: 'groups', label: 'Groups', type: 'check', options: this.options('groups')}
    ]
  }

  options(type) {
    return new Promise((resolve)=>{
      hue[type]().then(response => {
        resolve(Object.keys(response.data).map(id => {
          return {value: id, label: response.data[id].name};
        }));
      });
    });
  }

  handleSubmit = (data)=>{
    const id = this.props.params.id;
    backend.buttons().then(res => {
      const buttons = res.data;
      buttons[id] = data;
      backend.buttons(buttons);
    });
  }

  render() {
    return (
      <div>
        <h3>Dash Button</h3>
        <Form key={this.state.item.name} fields={this.fields()} value={this.state.item} onSubmit={this.handleSubmit} />
      </div>
    );
  }
}

class NewDashButton extends Component {

  fields() {
    return [
      {name: 'id', label: 'Mac Address'},
      {name: 'name', label: 'Name'},
      {name: 'lights', label: 'Lights', type: 'check', options: this.options('lights')},
      {name: 'groups', label: 'Groups', type: 'check', options: this.options('groups')}
    ]
  }

  options(type) {
    return new Promise((resolve)=>{
      hue[type]().then(response => {
        resolve(Object.keys(response.data).map(id => {
          return {value: id, label: response.data[id].name};
        }));
      });
    });
  }

  handleSubmit = (data)=>{
    backend.newButton(data).then(()=>window.location.reload());
  }

  render() {
    return (
      <div>
        <h3>New Dash Button</h3>
        <Form fields={this.fields()} value={{}} onSubmit={this.handleSubmit} />
      </div>
    );
  }
}

export {DashButtons, DashButton, NewDashButton};
