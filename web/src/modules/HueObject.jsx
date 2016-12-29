import React, {Component} from 'react';
import hue from './hue';
import Form from './Form';


class HueObject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: {}
    };
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    const id = this.props.id;
    hue[this.props.resource](id).then(res => {
      this.setState({item: res.data})
    });
  }

  handleSubmit = (data)=>{
    hue[this.props.resource](this.props.id, data).then(()=>window.location.reload());
  }

  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        {!this.props.fields ? "" : (
          <Form key={this.state.item.name} fields={this.props.fields} value={this.state.item} onSubmit={this.handleSubmit} />
        )}
        <pre>
          {JSON.stringify(this.state.item, null, 4)}
        </pre>
      </div>
    );
  }
}

export default HueObject;
