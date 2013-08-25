var deploy = require('../app')
var express = require('express')
var seneca = require('seneca')()
var argv = require('rc')('deploy')
var res = require('./resources')(argv)

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
