# SOLOMO CAPSTONE PROJECT - 12CTT

## Install

1. First, install Node.js. Then, install the latest Cordova and Ionic command-line tools.

    `$ npm install -g cordova ionic`

2. Then and Android platform

    `$ ionic platform add android`

3. Install Plugins and Dependencies based on package.json file

    `$ ionic state restore`

    `$ bower install ngCordova`

    `$ cordova -d plugin add https://github.com/Wizcorp/phonegap-facebook-plugin.git --variable APP_ID="537496736415112" --variable APP_NAME="solomo"`

    `$ cordova plugin add org.apache.cordova.camera`

4. Finally, plug-in a android device that have debugging mode turned on

    `$ ionic run android`
