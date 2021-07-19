# salesforce-server

## Add configurations from commerce-sdk
Create a file config/sfcc.js
Copy the sample-sfcc.js file content into this file
Update the values of the parameters with configurations from Rupa

## Run the server locally
npm run start:localhost

## Build zip resources for dev deployment
1. Run nvm use
2. Run build script sh build.sh (build script modifies the package.json file, you can discard the changes)
3. From AWS EB console, click Upload and deploy and select the dev.zip asset

## Build zip resources for production deployment
1. Run nvm use
2. run build script sh build-prod.sh (build script modifies the package.json file, you can discard the changes)
3. from AWS EB console, click Upload and deploy and select the prod.zip asset
