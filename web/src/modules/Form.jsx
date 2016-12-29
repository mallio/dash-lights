import React, {Component} from 'react';
import CheckboxFieldset from './CheckboxFieldset';

class Form extends Component {
  constructor(props) {
    super(props);
    const state = {};
    props.fields.forEach((field)=>{
      state[field.name] = this.fieldDefault(field);
    });
    this.state = state;
  }

  fieldDefault(field) {
    return field.type === 'check' ? [] : "";
  }

  componentDidMount() {
    const state = {};
    this.props.fields.forEach((field)=>{
      state[field.name] = this.props.value[field.name] || this.fieldDefault(field);
    });
    this.setState(state);
  }

  handleChange = (event)=>{
    this.setState({[event.target.id]: event.target.value});
  }

  handleSubmit = (event)=>{
    event.preventDefault();
    this.props.onSubmit(this.state);
  }

  renderField = (field)=>{
    if (field.type === 'check') {
      return (
        <CheckboxFieldset key={field.name} name={field.name} label={field.label} options={field.options}
            value={this.state[field.name]} onChange={this.handleChange} />
      );
    } else {
      return (
        <div key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          <input type="text" id={field.name} value={this.state[field.name]}  onChange={this.handleChange} />
        </div>
      );
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.props.fields.map(this.renderField)}
        <input type="submit" value="Save" />
      </form>
    )
  }
}

export default Form;
