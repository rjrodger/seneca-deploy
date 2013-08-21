
var request = require('request')
var util = require('util')

module.exports = tarball;

/**
 * Stream github tarball contents
 * @param {String} opts.ref commit ref (defaults to 'master')
 * @param {String} opts.user github username to fetch tarball from
 * @param {String} opts.repo github repository to fetch tarball from
 * @param {Object} [opts.auth] Auth object for basic auth to private repo
 * @param {String} [opts.token] OAuth token for access to private repos
 * @param {Object} [opts.headers] Additional headers for request
 */
function tarball(opts) {

  var opts = opts || { }
  if(!opts.ref) { opts.ref = 'master' }
  if(!opts.user) { throw new Error("Requires github user.") }
  if(!opts.repo) { throw new Error("Requires github repo.") }
  if(!opts.headers) { opts.headers = { } }
  if(!opts.token) {

    if(!opts.auth) {

      throw new Error('Reqires OAuth token or auth object {user, pass}.')
    }
    if(typeof opts.auth == 'object') {

      if(!opts.auth.user && !opts.auth.username) {

        throw new Error('Must specify user when using auth.')
      }
      if(!opts.auth.pass && !opts.auth.password) {

        throw new Error('Must specify pass when using auth.')
      }
      opts.auth = (opts.auth.user || opts.auth.username) +
        ':' + (opts.auth.pass || opts.auth.password)
      ;
    }
  }
  else {

    opts.headers['Authorization'] = 'token ' + opts.token
  }
  var req = request(tarballUrl(opts), {

    headers : opts.headers
    , auth : opts.auth

  })

  return req
}

/**
 * Compose github tarball URL from parameters
 */
function tarballUrl(opts) {

  var user = opts.user
  var repo = opts.repo
  var ref = opts.ref

  if(!repo || !user) {

    throw new Error("Cannot construct URL without repo and user params.")
  }
  return util.format(

    'https://api.github.com/repos/%s/%s/tarball/%s'
    , user
    , repo
    , ref
  )
}