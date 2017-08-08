var AWS = require('aws-sdk')
var endpoint = new AWS.Endpoint('http://localhost:5000')
var db = process.env.NODE_ENV === 'testing'? new AWS.DynamoDB({endpoint}) : new AWS.DynamoDB
var doc = process.env.NODE_ENV === 'testing'? new AWS.DynamoDB.DocumentClient({endpoint}) : new AWS.DynamoDB.DocumentClient()

var test = require('tape')
var arc = require('@architect/workflows')

var client
test('arc.sandbox.db.start', t=>{
  t.plan(1)
  client = arc.sandbox.db.start(xxx=> t.ok(true, 'started'))
})

test('db', t=> {
  t.plan(1)
  // note: we do not need to create the tables the
  // sandbox detected the .arc and did that above
  db.listTables({}, function _list(err, result) {
    if (err) throw err
    t.ok(result, 'got result')
    console.log(result) 
  })
})

/**
 * usually you'll want to use the documentclient to interact with dynamo
 *
 * examples below show the usual crud business on one table
 *
 */

var TableName = 'testbox-staging-cats' // you probably want to write something that sorts that name out based on NODE_ENV in your app data layer logic

test('doc.put', t=> {
  t.plan(1)
  doc.put({
    TableName, 
    Item: {
      pplID: 'brian', 
      catID: 'fluffyface', 
      name: 'sutr0'
    }
  }, 
  function _create(err, result) {
    if (err) throw err
    t.ok(result, 'got result')
    console.log(result) 
  })
})

test('doc.get', t=> {
  t.plan(1)
  doc.get({
    TableName, 
    Key: {
      pplID: 'brian', 
      catID: 'fluffyface', 
    }
  }, 
  function _create(err, result) {
    if (err) throw err
    t.ok(result, 'got result')
    console.log(result) 
  })
})

test('doc.del', t=> {
  t.plan(1)
  doc.delete({
    TableName, 
    Key: {
      pplID: 'brian', 
      catID: 'fluffyface', 
    }
  }, 
  function _create(err, result) {
    if (err) throw err
    t.ok(result, 'got result')
    console.log(result) 
  })
})

test('doc.query', t=> {
  t.plan(1)
  doc.query({
    TableName,
    KeyConditionExpression: "#pplID = :pplID",
    ExpressionAttributeNames: {
      '#pplID': 'pplID'
    },
    ExpressionAttributeValues: {
      ':pplID': 'brian'
    }
  }, 
  function _create(err, result) {
    if (err) throw err
    t.ok(result, 'got result')
    console.log(result) 
  })
})

// update does a 'put' if the value doesn't already exist..
test('doc.update', t=> {
  t.plan(1)
  doc.update({
    TableName,
    Key: {
      pplID: 'brian',
      catID: 'fluffyface'
    },
    UpdateExpression: 'set #name = :name',
    ExpressionAttributeNames: {
      '#name': 'name',
    },
    ExpressionAttributeValues: {
      ':name': 'sutr0',
    }
  }, 
  function _create(err, result) {
    if (err) throw err
    t.ok(result, 'got result')
    console.log(result) 
  })
})

test('doc.get (again, just to demo)', t=> {
  t.plan(1)
  doc.get({
    TableName, 
    Key: {
      pplID: 'brian', 
      catID: 'fluffyface', 
    }
  }, 
  function _create(err, result) {
    if (err) throw err
    t.ok(result, 'got result')
    console.log(result) 
  })
})


/**
 * finally we'll use that client reference from above to close the sandbox
 */
test('arc.sandbox.db.close', t=>{
  t.plan(1)
  client.close()
  t.ok(true, 'closed')
})
