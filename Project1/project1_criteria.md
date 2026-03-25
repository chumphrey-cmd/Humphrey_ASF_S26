**Guidelines and Expectations**

* Due 28 March

1. Function Requirements
   The `isPalindrome` function must exist and accept exactly one argument.
2. Valid Input Types
   The function should only accept strings.
   Any non-string input (numbers, arrays, booleans, objects, null, or undefined) should return false.
3. Basic Cases
   Simple lowercase words like "bob" and "racecar" should return true.
   Non-palindromes like "apple" should return false.
4. Outlier Handling
   Palindromes should not be case-sensitive. For example, "Racecar" should return true.
   Phrases with spaces and punctuation should still count if they form a palindrome when cleaned (e.g., "Madam I'm Adam." or "Red rum, sir, is murder.").
   Your solution should remove spaces, punctuation, and ignore letter case before checking.
5. Testing Structure
   Group your tests with describe() blocks.
   As you design and test your isPalindrome function, you may encounter unusual cases. Use [this list of English palindromic](https://en.wikipedia.org/wiki/List_of_English_palindromic_phrases) phrases as a resource for exploring potential outliers.