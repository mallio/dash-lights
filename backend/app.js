/*jslint node:true*/
'use strict';

var dashButton = require('node-dash-button');
var HueApi = require('node-hue-api').HueApi;
var fs = require('fs');
var http = require('http');
var HttpDispatcher = require('httpdispatcher');

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
var api = new HueApi(config.api.hue.bridge, config.api.hue.username);

// Add listeners for buttons in ids list
function initButtons(ids) {
  var dash = dashButton(ids, null, null, 'udp');
  dash.on('detected', handleButtonClick);
}

function handleButtonClick(id) {
  var button = config.buttons[id];

  button.lights && button.lights.forEach(function(light) {
    api.lightStatus(light, function(err, status) {
      api.setLightState(light, {'on': !status.state.on});
    });
  });

  button.groups && button.groups.forEach(function(group) {
    api.getGroup(group, function(err, status) {
      api.setGroupLightState(group, {'on': !status.lastAction.on});
    });
  });
}

// Initial buttons
var buttonIds = Object.keys(config.buttons);
initButtons(buttonIds);

/**
 * Backend server
 */
var dispatcher = new HttpDispatcher();
var server = http.createServer(function(req, res) {

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
  if ( req.method === 'OPTIONS' ) {
    res.writeHead(200);
    res.end();
    return;
  }

  dispatcher.dispatch(req, res);
});

// Get buttons config
dispatcher.onGet('/buttons', function(req, res) {
  finish(res, JSON.stringify(config.buttons));
});

// Add new button (needed because there doesn't appear to be a way to stop the
//  old button listeners, so a new one needs to be created)
dispatcher.onPost('/buttons/new', function(req, res) {
  var button = JSON.parse(req.body);
  var id = button.id;
  delete button.id;
  config.buttons[id] = button;
  writeConfig('buttons');

  initButtons([id]);

  finish(res);
});

// Save button config (for changes to buttons, no need to reinitialize because
//  no new listeners need to be attached, the current one will just use the new
//  stored config)
dispatcher.onPost('/buttons', function(req, res) {
  var buttons = JSON.parse(req.body);
  config.buttons = buttons;
  writeConfig('buttons');

  finish(res);
});


dispatcher.onGet('/findbutton', function(req, res) {
  var spawn = require('child_process').spawn;
  var fb = spawn('./node_modules/node-dash-button/bin/findbutton');
  var mac = "";

  var timeout = setTimeout(function(){
    fb.kill();
  }, 10000);

  fb.stdout.on('data', function(data) {
    var match = data.toString().match(/((?:(?:[0-9a-f]{2}):){5}(?:[0-9a-f]{2})).*Amazon/);
    if (match) {
      mac = match[1];
      fb.kill();
    }
  });


  fb.on('close', function() {
    clearTimeout(timeout);
    if (mac) {
      finish(res, mac);
    } else {
      finish(res, "No dash button found", 404);
    }
  });
});

function finish(res, data, status) {
  res.writeHead(status || 200);
  res.end(data);
}

server.listen(config.api.backend.port);
