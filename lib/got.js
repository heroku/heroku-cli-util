'use strict';

let url_lib    = require('url');
let got_delegate = require('got');
let tunnel = require('tunnel-agent');

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

function agent(urlParsed, proxyParsed) {
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

  return tunnelMethod(opts);
}

function addProxyToOpts(url, opts) {
  let urlParsed = url_lib.parse(url);
  let proxy = findProxy(urlParsed);
  if (proxy) {
    let proxyParsed = url_lib.parse(proxy);
    opts = Object.assign({}, opts, {agent: agent(urlParsed, proxyParsed)});
  }
  return opts;
}

function got(url, opts) {
  return got_delegate(url, addProxyToOpts(url, opts));
}

got.stream = function (url, opts) {
  return got_delegate.stream(url, addProxyToOpts(url, opts));
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
  got[el] = got_delegate[el];
});

module.exports = got;
