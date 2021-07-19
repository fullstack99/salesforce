sed -i '' 's/run start:prod/run start:dev/g' package.json
zip -r dev.zip .ebextensions api config node_modules .nvmrc index.js package.json
npm version patch