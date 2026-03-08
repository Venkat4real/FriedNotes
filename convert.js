const p2o = require('postman-to-openapi');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'collection.json');
const tempPath = path.join(__dirname, 'clean_collection.json');
const outputPath = path.join(__dirname, 'openapi.yaml');

try {
  const collectionData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const actualCollection = collectionData.collection || collectionData;
  
  fs.writeFileSync(tempPath, JSON.stringify(actualCollection, null, 2));

  p2o(tempPath, outputPath, { defaultTag: 'General' })
    .then(result => {
      console.log(`OpenAPI spec generated successfully at ${outputPath}`);
      fs.unlinkSync(tempPath); // Clean up
    })
    .catch(err => {
      console.error('Error during conversion:', err);
      process.exit(1);
    });
} catch (err) {
  console.error('Error reading collection.json:', err);
  process.exit(1);
}
