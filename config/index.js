var deploy = require('../app') // main seneca-deply module
var resources = require('./resources') // docker functions
var express = require('express')
var seneca = require('seneca')()
var conf = require('rc')('deploy')

/* TODO: more sensible/intelligent defaults? */
if(!conf.host) { conf.host = '127.0.0.1' }
if(!conf.port) { conf.port = '4342' }

var res = resources(conf) // produce docker methods for given config

module.exports = config;
function config(app) {

  app.set('resources', res)

  seneca.use(deploy(res))

  seneca.ready(function(err) {

    if(err) { throw err }
    console.log('Seneca is ready!')
    var web = seneca.export('web')

    app
      .use(express.bodyParser())
      .use(express.cookieParser())
      .use(express.methodOverride())
      .use(web)
    ;

    app.listen(3000)
  })

  return app
}
