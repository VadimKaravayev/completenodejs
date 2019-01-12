const expect = require('expect');
const {isRealString} = require('./validation');

describe('isRealString', ()=> {
    it('Should reject non-string value', ()=> {
        [1, true, false, null, undefined, {}].forEach(v=> {
            expect(isRealString(v)).toBeFalsy();
        });
    });
    it('Should reject strings with only spaces', ()=> {
        ['', '  ', '      '].forEach(v=> {
            expect(isRealString(v)).toBeFalsy();
        });
    });
    it('Should allow strings with non-space characters', ()=> {
        ['test', '  test', '   test  '].forEach(v=> {
            expect(isRealString(v)).toBeTruthy();
        });
    });
});