var DashButton = require('node-dash-button');
var HueApi = require('node-hue-api').HueApi;

// TODO - detect automatically (nupnpSearch)
var bridge = "10.0.0.8";
var username = "z-O9t2G3TrmUWqwY3TMWpcdzjw-E35nYWPrMgucU";
var buttons = [
  "ac:63:be:70:d2:e6" /* Phillips 1 */
];

var api = new HueApi(bridge, username); 

var dash = DashButton(buttons, null, null, 'udp');
dash.on('detected', function() {
  console.log('button clicked');
  api.lightStatus(1, function(err, status){
    console.log('Turning light ' + (status.state.on ? 'off' : 'on'));
    api.setLightState(1, {'on': !status.state.on});
  });
});
