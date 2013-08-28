/**
 * seneca-deploy plugin
 */

var methods = {

  'install' : require('./methods/install-app')
}

module.exports = function deploy(conf) {

  return function(opts) {

    var name = 'deploy'
    var seneca = this
    var containers = this.make('containers')
    var users = this.make('sys/user')
    var apps = this.make('apps')

    seneca.add({ init : name }, init)
    Object.keys(methods).map(function(method) {

      console.log('Adding %s to methods.', method)
      seneca.add({

        role : name
        , cmd : method

      }, methods[method](conf))

    })

    /**
     * Map entities
     */
    seneca.act({

      role : 'util'
      , cmd : 'ensure_entity'
      , pin : { role : 'deploy', cmd : '*' }
      , entmap : {

        user : users
        , cont : containers
        , app : apps
      }
    })


    /**
     * Export web functionality
     */
    seneca.act({

      role : 'web'
      , use : {

        name : name
        , prefix : '/deploy/'
        , pin : { role : name, cmd : '*' }
        , map : {

          install : { GET : context }
          , start : { GET : context }
        }
      }

    })

    /**
     * Web API context gathering
     */
    function context(req, res, args, act, cb) {

      act(args, cb)
    }

    /**
     * Plugin Initialization
     */
    function init(args, cb) {

      // TODO: something
      cb(null, true)
    }

    return {

      name : name
    }
  }
}
