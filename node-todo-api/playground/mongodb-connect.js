const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client)=> {
    if (error) {
        return console.log('Unable to connect to Mongodb');
    }
    console.log('Connected to MongoDB');
    const db = client.db('TodoApp');
    
   //Deletion
   //find one and delete
   db.collection('Todos').findOneAndDelete({text: 'Eat lunch'}).then((result)=> {
       console.log(result);
   });
    
    client.close();
});