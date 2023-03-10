/**
 * Simple http server to serve remote bundles
 * Run it with `node serve-remote-bundles.js`
 *
 * Credits: https://stackoverflow.com/a/29046869/5430788
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const appConfigs = require('./app.json');

const port = process.argv[2] || appConfigs.remoteChunkPort || 4999;

http
  .createServer(function (req, res) {
    console.log(`${req.method} ${req.url}`);

    // parse URL
    const parsedUrl = url.parse(req.url);
    // extract URL path
    let pathname = `.${parsedUrl.pathname}`;
    // based on the URL path, extract the file extension. e.g. .js, .doc, ...
    const ext = path.parse(pathname).ext;
    // maps file extension to MIME typere
    const map = {
      '.ico': 'image/x-icon',
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.wav': 'audio/wav',
      '.mp3': 'audio/mpeg',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
    };

    console.log('pathname', pathname);

    fs.exists(pathname, function (exist) {
      if (!exist) {
        // if the file is not found, return 404
        res.statusCode = 404;
        res.end(`File ${pathname} not found!`);
        return;
      }

      // if is a directory search for index file matching the extension
      if (fs.statSync(pathname).isDirectory()) {
        pathname += '/index' + ext;
      }

      // read file from file system
      fs.readFile(pathname, function (err, data) {
        if (err) {
          res.statusCode = 500;
          res.end(`Error getting the file: ${err}.`);
        } else {
          // if the file is found, set Content-type and send data
          // Website you wish to allow to connect
          res.setHeader('Access-Control-Allow-Origin', '*');

          // Request methods you wish to allow
          res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

          // Request headers you wish to allow
          res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

          res.setHeader('Content-type', map[ext] || 'text/plain');
          res.end(data);
        }
      });
    });
  })
  .listen(parseInt(port, 10));

console.log(`Server listening on port ${port}`);
