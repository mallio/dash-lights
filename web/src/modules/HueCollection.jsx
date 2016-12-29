import React, {Component} from 'react';
import MapList from './MapList';
import hue from './hue';

class HueCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
  }

  componentDidMount() {
    hue[this.props.resource]().then(res => this.setState({items: res.data}))
  }

  render() {
    return (
      <div>
        <h2>{this.props.title}</h2>
        <MapList items={this.state.items} resource={this.props.resource} />
        <div key={this.props.parent.params.id}>
          {this.props.parent.children}
        </div>
      </div>
    );
  }
}

export default HueCollection;
