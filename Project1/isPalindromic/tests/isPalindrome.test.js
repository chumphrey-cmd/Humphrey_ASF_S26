// test('Jest is working', () => { expect(1 + 1).toBe(2); });

const isPalindrome = require('../src/isPalindrome');

describe('isPalindrome Testing...', () => {

    describe('2. Valid Input Types', () => {

        it('should be False for non-string, bool, null, object, or undefined inputs', () => {

            // Number
            expect((isPalindrome(123))).toBe(false);

            // Boolean
            expect((isPalindrome(true))).toBe(false);

            // Null
            expect((isPalindrome(null))).toBe(false);

            // Object
            expect((isPalindrome(['str']))).toBe(false);

            // Undefined
            expect((isPalindrome([undefined]))).toBe(false);

        })
    })

    describe('3. Basic Cases', () => {

        it('should convert handle all of the standard cases', () => {

            expect((isPalindrome("racecar"))).toBe(true);
        })
    })

    describe('4. Outlier Handling', () => {

        it('should convert any uppercase Palindromic characters to lower case (case-insensitive)', () => {

            expect((isPalindrome("Racecar"))).toBe(true);
        })

        it('should handle punctuation, remove spaces, ignore letter case, etc.', () => {

            expect((isPalindrome("Madam I'm Adam."))).toBe(true);
            expect((isPalindrome("Re/////**    /d rum, s_+_)ir, is murder."))).toBe(true);
        })
    })
});