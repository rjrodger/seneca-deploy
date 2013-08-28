/**
 * Install an app
 */

var fs = require('fs')
var mkdirp = require('mkdirp')
var tarStream = require('../tarball-stream')
var spawn = require('child_process').spawn
var exec = require('child_process').exec
var path = require('path')
var uuid = require('node-uuid')
var conf = require('rc')('deploy')

module.exports = install
/**
 * Create a docker image from the tarball of the specified repository
 * @param {Object} args Arguments object
 * @param {String} args.repo Github repo name of application to install
 * @param {String} args.user Github username of application to install
 * @param {String} args.token Github OAuth token to use for private repos
 * @param {Function} cb Callback, called with id of image created for app
 */
function install(args, cb) {

  var cwd = process.cwd()
  var args = args || { }
  var repo = args.repo
  var user = args.user
  var ref = args.ref
  var token = args.token
  var dirname = uuid.v4()
  var appStream = tarStream({

    user : user
    , repo : repo
    , ref : ref // default 'master'
    , token : token

  })

  var done = false

  mkdirp(path.join(cwd, conf.TMP_DIR, dirname, 'app'), pipe)

  /**
   * Pipe gzip data to tar extract command as stdin
   */
  function pipe(err) {

    if(err) { throw err }
    var untar = spawn(
        'tar'
        , [
          '-xzf'
          , '-'
          , '-C'
          , path.join(cwd, conf.TMP_DIR, dirname, 'app')
          , '--strip-components=1'
        ]
    )
    appStream.pipe(untar.stdin)
    untar.on('close', extracted)
  }

  /**
   * tar stream has been extracted to directory,
   * create the Dockerfile to go along with the files
   */
  function extracted(err, stdout, stderr) {

    if(err) { throw err }

  }

  // TODO: add to image
  // return image id
  done = true
  cb(null, true)
}
