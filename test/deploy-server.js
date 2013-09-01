
var port = parseInt(process.argv[2]) || 3001

require('seneca')()
  .use('level-store', {folder:'db'})
  .use('..')
  .listen( port )
