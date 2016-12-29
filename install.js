var fs = require('fs');
var execSync = require('child_process').execSync;

// Install submodules
console.log('Installing Backend');
execSync('npm install', {cwd: 'backend', env: process.env, stdio: 'inherit'});
console.log('Intalling Web');
execSync('npm install', {cwd: 'web', env: process.env, stdio: 'inherit'});

// Add config files
console.log('Checking config files...');
if (!fs.existsSync('config/api.json')) {
  console.log('Adding default api.json');
  var defaultApi = {
    backend: {
      server: "",
      port: ""
    },
    hue: {
      username: "",
      bridge: ""
    }
  };
  fs.writeFileSync('config/api.json', JSON.stringify(defaultApi, null, 4));
}

if (!fs.existsSync('config/buttons.json')) {
  console.log('Adding default buttons.json');
  var defaultButtons = {
  };
  fs.writeFileSync('config/buttons.json', JSON.stringify(defaultButtons, null, 4));
}

console.log('Finished. Remember to edit config.json with correct values');
