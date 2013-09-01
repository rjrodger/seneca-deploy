"use strict";


var _     = require('underscore')
var async = require('async')



module.exports = function( options ) {
  var seneca = this
  var name = "deploy"


  options = seneca.util.deepextend({
    foo:1
  },options)
  

  var machine_ent = seneca.make$( 'farm/machine' )


  var machines = {}


  seneca.add( {role:name, cmd:'hello'},     
              function( args, done ) { done( null, {foo:options.foo}) }  )


  seneca.add( {role:name, cmd:'add-machine' }, cmd_add_machine )
  seneca.add( {role:name, cmd:'list-machines' }, cmd_list_machines )


  seneca.add( {init:name }, init )


  function cmd_add_machine( args, done ) {
    var id   = args.id
    var spec = args.spec
    var save = void 0 == args.save ? true : args.save

    var machine = machine_ent.make$({spec:spec})

    if( save ) {
      machine.id$ = id
      machine.save$(function( err, machine ){
        if( err ) return done(err);
        add_machine(machine)
      })
    }
    else {
      machine.id = id
      add_machine( machine )
    }

    function add_machine( machine ) {
      // maintain machines in-memory during normal operation
      machines[machine.id] = machine

      done(null,{ok:true,machine:machine})
    }
  }


  function cmd_list_machines( args, done ) {
    machine_ent.list$( function( err, list ){
      if( err ) return done(err);

      done(null,{ok:true,machines:list})
    })
  }


  function init( args, done ) {
    seneca.act('role:util, cmd:define_sys_entity', {list:['farm/machine']})

    // reload from leveldb store
    machine_ent.list$( function(err,list) {
      if( err ) return done(err);

      async.mapSeries( list, function( machine, next ) {
        seneca.act( {role:name,cmd:'add-machine',id:machine.id,spec:machine.data$(false),save:false}, next)

      }, function(err) {
        if( err ) return done(err);
        return done();
      })
    })
  }


  return {
    name:name
  }
}


