let somePromise = new Promise((resolve, reject)=> {
    //resolve('This is what you asked.');
    reject('Failed to fulfil the promise.');
});

somePromise.then((message)=> {
    console.log('Success: ', message);
}, (fail)=> {
    console.log(fail);
});