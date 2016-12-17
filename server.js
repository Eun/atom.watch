const path = require('path');
const express = require('express');
const fs = require('fs');
const port = process.env.PORT || 8080;
const app = express();

app.get('/', function response(req, res) {
  res.write(fs.readFileSync(path.join(__dirname, 'dist/index.html')));
  res.end();
});

app.get('/time', function response(req, res) {
  res.end('{"TimeStamp": ' + new Date(Date.now()+(new Date().getTimezoneOffset()*60000)).getTime() + '}');
});

app.use(express.static('dist'));

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
