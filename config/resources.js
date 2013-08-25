var util = require('util')
module.exports = resources;

/**
 * Return an object containing functions for
 * producing Docker endpoints for a given Docker task.
 * @param {Object} config configuration object to use for URL definitions
 * @param {String} config.host Required hostname of docker daemon
 * @param {String} config.port Required port of docker daemon
 */
function resources(config) {

  var config = config || { }
  if(!config.host || !config.port) {

    throw new Error("config/resources: Invalid config object")
  }

  var root = util.format('http://%s:%s', config.host, config.port)
  function url(type, id, cmd) {

    /* Mash all the props together with slashes, filter undefined/null values */
    return [ root, type, id, cmd ].filter(function(v) { return v }).join('/')
  }
  return {

    listContainers : function() {

      return url('containers', null, 'list')
    }
    , createContainer : function() {

      return url('containers', null, 'create')
    }
    , inspectContainer : function(id) {

      return url('containers', id, 'json')
    }
    , startContainer : function(id) {

      return url('containers', id, 'start')
    }
    , restartContainer : function(id) {

      return url('containers', id, 'restart')
    }
    , stopContainer : function(id) {

      return url('containers', id, 'stop')
    }
    , removeContainer : function(id) {

      return url('containers', id, 'remove')
    }
  }
}