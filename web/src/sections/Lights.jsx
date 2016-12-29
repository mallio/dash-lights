import React, { Component } from 'react';
import HueCollection from '../modules/HueCollection';
import HueObject from '../modules/HueObject';

class Lights extends Component {
  render() {
    return (
      <HueCollection title="Lights" resource="lights" parent={this.props} />
    );
  }
}

class Light extends Component {
  render() {
    return (
      <HueObject title="Light" resource="light" id={this.props.params.id} />
    );
  }
}

export {Lights, Light};
