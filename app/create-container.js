var argv = require('rc')('control')
var request = require('request')

module.exports = createContainer

/**
 * Create a new (clean) container
 * @param {String} opts.image Image id/tag to base container from
 */
function createContainer(opts) {

  var opts = opts || { }
  var base = opts.image || 'base'
  var params = {

    Hostname : ""
    , User : "app"
    , Memory : 0
    , MemorySwap : 0
    , AttachStdin : false
    , AttachStdout : true
    , AttachStderr : true
    , PortSpecs : null
    , Tty : false
    , OpenStdin : false
    , StdinOnce : false
    , Env : null
    , Cmd : [
      "date"
    ]
    , Dns : null
    , Image : base
    , Volumes : {}
    , VolumesFrom : ""
    , WorkingDir : ""
  }

  var req = request.post({

    url : 'http://127.0.0.1:4243/containers/create'
    , json : params

  }).pipe(process.stdout)
}
