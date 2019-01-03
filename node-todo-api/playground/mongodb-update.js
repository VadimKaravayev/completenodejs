const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client)=> {
    if (error) {
        return console.log('Unable to connect to Mongodb');
    }
    console.log('Connected to MongoDB');
    const db = client.db('TodoApp');
    
   db.collection('Todos').findOneAndUpdate({
       _id: new ObjectID('5c2a50dea49ad974eb7d8a93')
   }, {
       $set: {
           completed: true
       }
   }, {
       returnOriginal: false
   }).then((result)=> {
       console.log(result);
   });
    
    client.close();
});