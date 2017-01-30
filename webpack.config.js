'use strict';
var webpack = require('webpack')
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {
    servers: [
        {
            url: "http://date.jsontest.com/",
            field: "milliseconds_since_epoch",
            tzoffset: 0,
        },
        {
            url: "https://h1-atom-watch.herokuapp.com/",
            field: "TimeStamp",
            tzoffset: 0,
        },
        {
            url: "https://az0-atom-watch.azurewebsites.net/",
            field: "TimeStamp",
            tzoffset: 0,
        },
    ],
    sync_count: 5
};

// Hack for Ubuntu on Windows: interface enumeration fails with EINVAL, so return empty.
try {
  require('os').networkInterfaces();
} catch (e) {
  require('os').networkInterfaces = () => ({});
}

module.exports = {
    entry: ['./index.js'],
    output: {
        path: path.join(__dirname, 'dist/'),
        publicPath: '/dist/',
        filename: 'bundle.js'
    },
    module: {
        // avoid webpack trying to shim process
        noParse: /es6-promise\.js$/,
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                // excluding some local linked packages.
                // for normal use cases only node_modules is needed.
                exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
                loader: 'babel'
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader?importLoaders=1"
            }
        ]
    },
    plugins: [],
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    }
};

var NODE_ENV;
if (process.env.NODE_ENV === 'production-browser' || process.env.NODE_ENV === 'production-server') {
    NODE_ENV = 'production';
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    );
}

if (process.env.NODE_ENV === 'debug') {
    module.exports.devtool = '#source-map'
}

if (process.env.NODE_ENV === 'debug' || process.env.NODE_ENV === 'production-server') {
    
    config.servers.push({
        url: "/time",
        field: "TimeStamp",
    });
}

module.exports.plugins.push(
    new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(NODE_ENV),
                config: JSON.stringify(config)
            }
    }),
    new CopyWebpackPlugin([
        { from: 'index.html' },
        { from: 'fonts', to: 'fonts' }
    ])
);
