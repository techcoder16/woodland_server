#!/bin/bash

echo "Waiting for MongoDB to start..."
sleep 10

echo "Initiating replica set..."
mongosh --host mongo:27017 --username admin --password password --authenticationDatabase admin --eval "
try {
  rs.status()
  print('Replica set already initiated')
} catch(e) {
  print('Initiating replica set...')
  rs.initiate({
    _id: 'rs0',
    members: [
      { _id: 0, host: 'mongo:27017' }
    ]
  })
  print('Replica set initiated')
}
"

echo "Replica set setup complete"
