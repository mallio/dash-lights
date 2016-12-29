import React, { Component } from 'react';
import HueCollection from '../modules/HueCollection';
import HueObject from '../modules/HueObject';

class Groups extends Component {
  render() {
    return (
      <HueCollection title="Groups" resource="groups" parent={this.props} />
    );
  }
}

class Group extends Component {
  fields() {
    return [
      {name: 'name', label: "Name"},
      {name: 'type', label: "Type"}
    ]
  }

  render() {
    return (
      <HueObject title="Group" resource="group" id={this.props.params.id} fields={this.fields()} />
    );
  }
}

export {Groups, Group};
