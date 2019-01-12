const expect = require('expect');
const {Users} = require('./users');

describe('Users', ()=> {
    
    let users;
    
    beforeEach(()=> {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Mike',
            room: 'Node course'
        }, {
            id: '2',
            name: 'Jen',
            room: 'React course'
        }, {
            id: '3',
            name: 'Julie',
            room: 'Node course'
        }];
    });
    
    it('should add a new user', ()=> {
        let users = new Users();
        let user = {id: 123, name: 'Vadym', room: 'Java'};
        let resUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    });
    
    it('should return names for node course', ()=> {
        let userList = users.getUserList('Node course');
        expect(userList).toEqual(['Mike', 'Julie']);
    });
    
    it('should remove a user', ()=> {
        let obj = users.users[0];
        let lengthBefore = users.users.length;
        let removed = users.removeUser('1');
        let lengthAfter = users.users.length;
        expect(removed).toEqual(obj);
        expect(lengthBefore - lengthAfter).toBe(1);
    });
    
    it('should not remove a user', ()=> {
        expect(users.removeUser(1111)).toBeFalsy();
    });
    
    it('should find a user', ()=> {
        let expected = users.users[0];
        let found = users.getUser('1');
        expect(found).toEqual(expected);
    });
    
    it('should not find a user', ()=> {
        expect(users.getUser('1111')).toBeFalsy();
        expect(users.getUser(1111)).toBeFalsy();
    });
});