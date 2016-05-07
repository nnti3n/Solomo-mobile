# SOLOMO CAPSTONE PROJECT - 12CTT

## Install

1. First, install Node.js. Then, install the latest Cordova and Ionic command-line tools.

    `$ npm install -g cordova ionic`

2. Then and Android platform

    `$ ionic platform add android`

3. Install Plugins and Dependencies based on package.json file

    `$ ionic state restore`

    `$ bower install ngCordova`
    
    `$ bower install waypoints`
    
    `$ bower install ng-tags-input#3.0.0 --save`

    `$ cordova -d plugin add https://github.com/Wizcorp/phonegap-facebook-plugin.git --variable APP_ID="537496736415112" --variable APP_NAME="solomo"`

    `$ cordova plugin add org.apache.cordova.camera`
    
4. Install IonicMaterial

    `$ bower install ionic-material`
    
    `$ bower install robotodraft`

5. Finally, plug-in a android device that have debugging mode turned on

    `$ ionic run android`
