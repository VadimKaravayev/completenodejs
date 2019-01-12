class Users {
    constructor() {
        this.users = [];
    }
    addUser(id, name, room) {
        let user = {id, name, room};
        this.users.push(user);
        return user;
    }
    
    removeUser(id) {
        if (typeof id === 'string') {
            let index = this.users.findIndex(user=> user.id === id);
            return this.users.splice(index, 1)[0];
        }
    }
    
    // removeUser (id) {
    //     var user = this.getUser(id);
    
    //     if (user) {
    //       this.users = this.users.filter((user) => user.id !== id);
    //     }
    
    //     return user;
    //   }
    
    getUser(id) {
        if (typeof id === 'string') {
            return this.users.find(user=> user.id === id);
        }
    }
    
    getUserList(room) {
        return this.users
            .filter(user=> user.room === room)
            .map(user=> user.name);
    }
}

module.exports = {Users};