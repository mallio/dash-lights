/*jslint node:true*/
'use strict';

var dashButton = require('node-dash-button');
var HueApi = require('node-hue-api').HueApi;
var fs = require('fs');

/**
 * Configuration
 */
var config = {};

function readConfig(type) {
  var json = fs.readFileSync('../config/' + type + '.json');
  config[type] = JSON.parse(json);
}

function writeConfig(type) {
  if (config[type]) {
    fs.writeFileSync('../config/' + type + '.json', JSON.stringify(config[type], null, 4));
  }
}

// TODO - detect bridge automatically (nupnpSearch)?
readConfig('api');
readConfig('buttons');


/**
 * Dash Button setup
 */
var buttonIds = Object.keys(config.buttons);

var api = new HueApi(config.api.hue.bridge, config.api.hue.username);

var dash = dashButton(buttonIds, null, null, 'udp');
dash.on('detected', function(id) {
  var button = config.buttons[id];

  button.lights && button.lights.forEach(function(light) {
    api.lightStatus(light, function(err, status) {
      api.setLightState(light, {'on': !status.state.on});
    });
  });

  button.groups && button.groups.forEach(function(group) {
    api.getGroup(group, function(err, status) {
      api.setGroupState(group, {'on': !status.state.all_on});
    });
  });

});
