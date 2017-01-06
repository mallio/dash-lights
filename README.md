Personal project for using dash buttons to toggle hue lights, and a web interface for associating dash buttons to lights or groups.

## Setup

### Step 1 - Dependencies

```
npm install
```
This will install both the backend project and the web project and initialize the shared config files.

### Step 2 - Get Hue Config

Go to https://www.developers.meethue.com/documentation/getting-started and follow the instructions for finding the IP address of your hue bridge and creating a username

Use these values to fill in the appropriate fields in `config/api.json`.


### Step 3 - Run servers
Fill in `config/api.json` with a port and IP (or `localhost`) for the server.

Run the backend server
```
node backend/app.js
```
Run the frontend
```
cd web
npm start
```
Go to the url shown in your browser.

### Step 4 - Connect Dash Button

Follow the instructions on the dash button to connect it to wifi, but stop before selecting a product.


### Step 5 - Associate lights to buttons

Once the button is setup, use the button finder to get the MAC Address
```
sudo backend/node_modules/node-dash-button/bin/findbutton
```
In your browser from step 3, go to Dash Buttons and click "New". Fill in a name and the MAC Address and pick whatever lights and/or groups you want it to control. Click save, and you're done!

If you want to change the lights that are controlled by a dash button, just come back and it will be listed on the side, just click it and change the values.
