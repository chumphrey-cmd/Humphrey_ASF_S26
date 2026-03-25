function isPalindrome(str) {

    if (typeof str != "string" || str === ""){
        return false;
    }

    let cleanedStr = removeSpecialCharacter(str.toLowerCase());

    let j = cleanedStr.length - 1
    for (let i = 0; i < cleanedStr.length / 2; i++) {
        if (cleanedStr[i] !== cleanedStr[j]) {
            return false;
        }
        j--;
    }
    return true;
}

// Function adapted from Geek for Geeks...
function removeSpecialCharacter(str) {
    // Initialize an empty string
    let ans = "";
    for (let i = 0; i < str.length; i++) {

        // if the current character is an alphabet
        if (/[a-zA-Z]/.test(str[i])) {
            ans += str[i];
        }
    }
    return(ans);
}

// Need to export so isPalindrome is accessible by my isPalindrome.test.js!
module.exports = isPalindrome;

// Sanity Check Area

// Boolean Test Case
let i = true;
// console.log(isPalindrome(i));

// Basic Test Case
let j = "bob";
// console.log(isPalindrome(j));

// Cleaned
let k = "Red rum, sir, is murder.";
// console.log(isPalindrome(removeSpecialCharacter(k.toLowerCase())))

// Lowercase Test Case
let l = "Racecar";
let l_lower = l.toLowerCase()
// console.log(isPalindrome(l_lower));

// Empty String Test Case
let m = "";
// console.log(isPalindrome(m));

