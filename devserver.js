const path = require('path');
const WebpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");

const port = process.env.PORT || 8080;


var config = require("./webpack.config.js");
config.entry.unshift("webpack-dev-server/client?http://localhost:"+port+"/");
var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
	hot: true,
	stats: { colors: true }
});

server.app.get('/time', function response(req, res) {
  res.end('{"TimeStamp": ' + new Date(Date.now()+(new Date().getTimezoneOffset()*60000)).getTime() + '}');
});

server.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
