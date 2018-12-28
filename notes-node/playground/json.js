const fs = require('fs');

var originalNote = {
  title: 'Products to buy',
  body: 'Potato, tomato, bread, butter, oil'
};

var originalNoteString = JSON.stringify(originalNote);
fs.writeFileSync('notes.json', originalNoteString);

var noteFromFileString = fs.readFileSync('notes.json');
var noteFromFileObj = JSON.parse(noteFromFileString);
console.log('noteFromFileObj: ', typeof noteFromFileObj);
console.log(noteFromFileObj);