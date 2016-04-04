'use strict';

let urlLib    = require('url');
let gotDelegate = require('got');
let tunnel = require('tunnel-agent');
let fs = require('fs');
let path = require('path');
let hush = require('./console').hush;

function findProxy(urlParsed) {
  let httpProxy = process.env.HTTP_PROXY   || process.env.http_proxy;
  let httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy;

  if (urlParsed.protocol === 'https:') {
    return httpsProxy || httpProxy;
  } else {
    return httpProxy;
  }
}

function findTunnel(urlParsed) {
  if (urlParsed.protocol === 'https:') {
    return tunnel.httpsOverHttp;
  } else {
    return tunnel.httpOverHttp;
  }
}

function agent(urlParsed, proxyParsed, certs) {
  let tunnelMethod = findTunnel(urlParsed);
  let opts = { 
    proxy: {
      host: proxyParsed.hostname,
      port: proxyParsed.port || '8080'
    }
  };

  if (proxyParsed.auth) {
    opts.proxy.proxyAuth = proxyParsed.auth;
  }

  if (certs.length > 0) {
    opts.ca = certs;
  }

  let tunnelAgent = tunnelMethod(opts);
  if (urlParsed.protocol === 'https:') {
    tunnelAgent.defaultPort = 443;
  }
  return tunnelAgent;
}

function sslCertFile() {
  return process.env.SSL_CERT_FILE ? [process.env.SSL_CERT_FILE] : [];
}

function sslCertDir() {
  let cert_dir = process.env.SSL_CERT_DIR;
  if (cert_dir) {
    return fs.readdirSync(cert_dir).map(f => path.join(cert_dir, f));
  } else {
    return [];
  }
}

function getCerts() {
  let filenames = sslCertFile().concat(sslCertDir());

  if (filenames.length > 0) {
    hush('Adding the following trusted certificate authorities');
  }

  return filenames.map(function(filename) {
    hush('  ' + filename);
    return fs.readFileSync(filename);
  });
}

function addToOpts(url, opts) {
  let urlParsed = urlLib.parse(url);
  let proxy = findProxy(urlParsed);

  let certs = getCerts();

  if (proxy) {
    let proxyParsed = urlLib.parse(proxy);
    opts = Object.assign({}, opts, {agent: agent(urlParsed, proxyParsed, certs)});
  }

  if (certs.length > 0) {
    opts = Object.assign({}, opts, {ca: certs});
  }

  return opts;
}

function got(url, opts) {
  return gotDelegate(url, addToOpts(url, opts));
}

got.stream = function (url, opts) {
  return gotDelegate.stream(url, addToOpts(url, opts));
};

const helpers = [
  'get',
  'post',
  'put',
  'patch',
  'head',
  'delete'
];

helpers.forEach(el => {
  got[el] = (url, opts) => got(url, Object.assign({}, opts, {method: el}));
});

helpers.forEach(el => {
  got.stream[el] = function (url, opts) {
    return got.stream(url, Object.assign({}, opts, {method: el}));
  };
});

const errors = [
  "HTTPError",
  "MaxRedirectsError",
  "ParseError",
  "ReadError",
  "RequestError"
];

errors.forEach(el => {
  got[el] = gotDelegate[el];
});

module.exports = got;
