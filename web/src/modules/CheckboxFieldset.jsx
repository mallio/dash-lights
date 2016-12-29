import React, {Component} from 'react';
import {CheckboxGroup, Checkbox} from 'react-checkbox-group';


class CheckboxFieldset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: []
    }
  }

  componentDidMount() {
    if (this.props.options instanceof Promise) {
      this.props.options.then(this.setOptions.bind(this));
    } else {
      this.setOptions(this.props.options);
    }
  }

  setOptions(options) {
    this.setState({options});
  }

  handleChange = (value)=> {
    var event = {
      target: {}
    }
    event.target.value = value;
    event.target.id = this.props.name;
    this.props.onChange(event);
  }

  render() {
    let id = (option)=>{
      return this.props.name + option.value;
    }
    return (
      <fieldset>
        {this.props.label && <legend>{this.props.label}</legend>}
        <CheckboxGroup name={this.props.name} value={this.props.value || []} onChange={this.handleChange}>
          {this.state.options.map(option =>
            <div key={option.value}>
              <Checkbox value={option.value} id={id(option)} />
              <label htmlFor={id(option)}>{option.label}</label>
            </div>
          )}
        </CheckboxGroup>
      </fieldset>
    )
  }
}

export default CheckboxFieldset;
