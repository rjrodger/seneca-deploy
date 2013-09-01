
var port = parseInt(process.argv[2]) || 3001

function print( next ) {
  return function( err, out ) {
    if( err ) return console.log(err);
    if( out ) console.dir(out)
    next && next(out)
  }
}

var client = require('seneca')().client( port )

client.act({role:'deploy',cmd:'hello'}, print(function(){

  client.act({role:'deploy',cmd:'add-machine',id:'123',spec:{ip:'127.0.0.1'}}, print())
}))



