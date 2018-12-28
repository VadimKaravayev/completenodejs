console.log('Starting app.js');

const fs = require('fs');
const _ = require('lodash');
const yargs = require('yargs').argv;

const notes = require('./notes.js');

var commands = new Map();
console.log(yargs);
let command = yargs._[0];
if (command === 'add') {
    notes.addNote(yargs.title, yargs.body);
} else if (command === 'remove') {
    notes.removeNote(yargs.title);
} else if (command === 'read') {
    notes.getNote(yargs.title);
} else if (command === 'list') {
    let allNotes = notes.getAll();
    allNotes.forEach((note)=> {
        console.log(`Title: ${note.title}, body: ${note.body}`);
    });
} else if (command === 'update') {
    notes.updateNote(yargs.title, yargs.updates);
} else {
    console.log('Unkown command');
} 
