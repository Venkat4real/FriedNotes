# API documentation set up and automation guide

This guide provides an overview of the API documentation set up for the **FriedNotes** project. It includes the steps to implement a Redoc-based API reference, convert Postman collections to OpenAPI, and automate future updates.

## Table of contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Project structure changes](#project-structure-changes)
4. [Automation workflow](#automation-workflow)
5. [Code reference](#code-reference)
   - [API reference HTML](#api-reference-html)
   - [Conversion script](#conversion-script)
   - [Package configuration](#package-configuration)
6. [Troubleshooting](#troubleshooting)

---

## Overview
The goal was to create a modern, searchable API documentation page by using [Redoc](https://github.com/Redocly/redoc). Because the project uses a Postman `collection.json` file, we implemented an automated conversion process to generate a standard OpenAPI (Swagger) YAML file, which Redoc requires to render the documentation.

## Prerequisites
To update or manage the API documentation, ensure the following are installed on your system:
- **Node.js** (v18 or higher is recommended)
- **npm** (included with Node.js)

## Project structure changes
The following files were added or modified:
- `docs/api_reference.html`: The main API documentation page.
- `docs/index.html`: Updated to include a link to the API reference.
- `docs/openapi.yaml`: The generated OpenAPI specification (auto-generated).
- `convert.js`: A custom Node.js script that automates the conversion.
- `package.json`: Contains project metadata and the update script.
- `.gitignore`: Configured to ignore `node_modules` and temporary files.

## Automation workflow
Whenever you update the `collection.json` file, follow these steps to refresh the documentation:

1. Open your terminal or command prompt in the project root.
2. Run the following command:
   ```bash
   npm run convert
   ```
3. The script performs the following actions:
   - Reads `collection.json`.
   - Extracts the core Postman object.
   - Generates a new `openapi.yaml`.
   - Cleans up any temporary files.
4. The API documentation at `docs/api_reference.html` automatically reflects the changes.

## Code reference

### API reference HTML
**File:** `docs/api_reference.html`
This file uses the Redoc standalone bundle to render the documentation.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>API Reference | FriedNotes</title>
    <meta charset="utf-8"/>
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
  </head>
  <body>
    <!-- Pointing to the generated OpenAPI YAML -->
    <redoc spec-url="openapi.yaml" scroll-y-offset="0"></redoc>
    
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"> </script>
  </body>
</html>
```

### Conversion script
**File:** `convert.js`
This script ensures the `collection.json` structure is correctly parsed before conversion.

```javascript
const p2o = require('postman-to-openapi');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'collection.json');
const tempPath = path.join(__dirname, 'clean_collection.json');
const outputPath = path.join(__dirname, 'docs', 'openapi.yaml');

try {
  const collectionData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  // Extract the inner collection object if it exists (common in Postman exports)
  const actualCollection = collectionData.collection || collectionData;
  
  // Write a clean temporary file for the converter
  fs.writeFileSync(tempPath, JSON.stringify(actualCollection, null, 2));

  p2o(tempPath, outputPath)
    .then(result => {
      console.log(`OpenAPI spec generated successfully at ${outputPath}`);
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath); // Clean up temporary file
      }
    })
    .catch(err => {
      console.error('Error during conversion:', err);
      process.exit(1);
    });
} catch (err) {
  console.error('Error reading collection.json:', err);
  process.exit(1);
}
```

### Package configuration
**File:** `package.json`
Defines the `convert` command for easy execution.

```json
{
  "name": "friednotes-docs",
  "version": "1.0.0",
  "scripts": {
    "convert": "node convert.js"
  },
  "dependencies": {
    "postman-to-openapi": "^1.7.3"
  }
}
```

## Troubleshooting
- **Module not found:** If you see an error about `postman-to-openapi`, run `npm install` in the project root.
- **Path errors:** Ensure you run commands from the root directory of the `FriedNotes` folder.
- **Redoc not loading:** Check your browser console (F12) for any CORS or 404 errors related to the `openapi.yaml` file.
