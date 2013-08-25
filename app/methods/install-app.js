/**
 * Install a new docker app
 */

var request = require('request')

module.exports = install;

/* receive resources from config */
function install(res) {

  return function(args, cb) {

    var args = args || { }

    // args.unit = args.unit || { }
    // var app = args.unit.app
    // var account = args.unit.acc
    // var version = args.unit.ver

    // var repo = args.req$.query.user + '/' + args.req$.query.app

    // no care for query/req stuff; assume args.user/app
    console.log(args)
    // request({

    //   url : 'https://api.github.com/repos/' + repo + '/tarball'
    //   , auth : {
    //     'user' : 'nexxy'
    //     , 'pass' : '313fa0324bf255d14603aec48cd9c4d0cf88348f'
    //   }

    // }).pipe(process.stdout)

    // console.log(app, user)

    // TODO: validate container count perms
    // TODO: validate repo


    // TODO: unpack & add to image
    // return image id

    cb(null, true)
  }
}
