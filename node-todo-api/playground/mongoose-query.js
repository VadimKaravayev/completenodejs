const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

let id = '5c2e732a78d6c32f8b7dbe53';

// Todo.find({
//     _id: id
// }).then((result)=> {
//     console.log(typeof result);
//     console.log(result.length);
//     console.log(result);
// });

// Todo.findOne({
//     _id: id
// }).then((result)=> {
//     console.log(typeof result);
//     console.log(result.length);
//     console.log(`Result: ${result}`);
// });

//Todo.findById(id).then(console.log).catch(console.log);


Todo.findById(id, function(err, doc) {
    console.log('This is what you get ', doc);
});