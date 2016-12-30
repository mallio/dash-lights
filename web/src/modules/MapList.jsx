import React from 'react';
import { Link } from 'react-router';

function MapList(props) {
  const items = Object.keys(props.items).map(id => {
    const item = props.items[id];
    const link = `/${props.resource}/${id}`;
    return (
      <li key={id} className={className(props, id)}><Link className="pure-menu-link" to={link}>{item.name}</Link></li>
    )
  });

  return (
    <div className="pure-menu pure-menu-vertical"><ul className="pure-menu-list">{items}</ul></div>
  );
}

function className(props, id) {
  let names = ["pure-menu-item"];
  if (id === props.selected) {
    names.push('pure-menu-selected');
  }
  return names.join(' ');
}

export default MapList;
