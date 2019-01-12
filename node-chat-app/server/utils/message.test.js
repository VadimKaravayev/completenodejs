const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', function() {
    
    it('should generate correct message object', function() {
        let from = 'Jen';
        let text = 'Some message';
        let message = generateMessage(from, text);
        
        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({from, text});
        
    });
});

describe('generateLocationMessage', ()=> {
    it('should generate correct location object', ()=> {
        let from = 'Vadym';
        let url = 'https://google.com/maps?q=1,1';
        let obj = generateLocationMessage('Vadym', 1, 1);
        expect(obj.from).toBe(from);
        expect(obj.url).toBe(url);
        expect(typeof obj.createdAt).toBe('number');
    });
});
