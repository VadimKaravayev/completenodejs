console.log('Notes.js starting');

const fs = require('fs');

let fetchNotes = ()=> {
    try {
        let notesString = fs.readFileSync('notes-data.json');
        return JSON.parse(notesString);
    } catch(error) {
        return [];
    }
};

let saveNotes = (notes)=> {
    fs.writeFileSync('notes-data.json', JSON.stringify(notes));
};

let addNote = (title, body)=> {
    let notes = fetchNotes();
    let note = {
        title,
        body
    };
    
    let duplicateNotes = notes.filter(note=> note.title === title);
    
    if (duplicateNotes.length === 0) {
        notes.push(note);
        saveNotes(notes);
        console.log("NOTE SUCCESSFULLY SAVED");
    } else {
        console.log("FAIL TO SAVE");
    }
};

let updateNote = (title, updates)=> {
    let notes = fetchNotes();
    let index = notes.findIndex(n=> Object.is(n.title, title));
    notes[index].title = updates.title || notes[index].title;
    notes[index].body = updates.body || notes[index].body;
    saveNotes(notes);
    console.log('UPDATED');
};

let getNote = (title)=> {
    let notes = fetchNotes();
    let found = notes.find(n=> Object.is(n.title, title));
    if (found) {
        console.log(`Read {title: ${found.title}, body: ${found.body}`);    
    } else {
        console.log("ITEM NOT FOUND");
    }
    return found;
};

let getAll = ()=> {
    return fetchNotes();
};

let removeNote = (title)=> {
    let notes = fetchNotes();
    let index = notes.findIndex(n=> Object.is(n.title, title));
    if (index === -1) {
        console.log("FAIL TO REMOVE");
    } else {
        const removed = notes.splice(index, 1);
        console.log(`REMOVED {title: ${removed[0].title}, body: ${removed[0].body}`);
        saveNotes(notes);
        console.log('Saving notes');
    }
};

module.exports = {
    addNote,
    updateNote,
    getNote,
    getAll,
    removeNote
};
