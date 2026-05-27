import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Quest from '../models/Quest.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const quests = [
    // ========== EASY QUESTIONS (10) ==========
    {
        title: "Find Maximum Element in Array",
        description: "Find the largest number in an array",
        problemStatement: "<p>Given an array of integers, find and return the maximum element.</p>",
        domain: "dsa",
        difficulty: "easy",
        xpReward: 10,
        starterCode: {
            python: "def find_max(arr):\n    # Your code here\n    pass",
            javascript: "function findMax(arr) {\n    // Your code here\n}",
            java: "public int findMax(int[] arr) {\n    // Your code here\n}",
            cpp: "int findMax(vector<int>& arr) {\n    // Your code here\n}"
        },
        testCases: [
            { input: { arr: [1, 5, 3, 9, 2] }, expectedOutput: 9 },
            { input: { arr: [-1, -5, -3] }, expectedOutput: -1 }
        ],
        hints: ["Loop through the array", "Keep track of the maximum value seen so far"],
        tags: ["arrays", "easy"],
        isActive: true
    },
    {
        title: "Reverse a String",
        description: "Reverse the given string",
        problemStatement: "<p>Given a string, return it reversed.</p>",
        domain: "dsa",
        difficulty: "easy",
        xpReward: 10,
        starterCode: {
            python: "def reverse_string(s):\n    # Your code here\n    pass",
            javascript: "function reverseString(s) {\n    // Your code here\n}"
        },
        testCases: [
            { input: { s: "hello" }, expectedOutput: "olleh" },
            { input: { s: "world" }, expectedOutput: "dlrow" }
        ],
        hints: ["Use slicing or two pointers"],
        tags: ["strings", "easy"],
        isActive: true
    },
    {
        title: "Check Palindrome",
        description: "Check if a string is a palindrome",
        problemStatement: "<p>Return true if the string reads the same forwards and backwards.</p>",
        domain: "dsa",
        difficulty: "easy",
        xpReward: 10,
        starterCode: {
            python: "def is_palindrome(s):\n    # Your code here\n    pass",
            javascript: "function isPalindrome(s) {\n    // Your code here\n}",
            java: "public boolean isPalindrome(String s) {\n    // Your code here\n}",
            cpp: "bool isPalindrome(string s) {\n    // Your code here\n}"
        },
        testCases: [
            { input: { s: "racecar" }, expectedOutput: true },
            { input: { s: "hello" }, expectedOutput: false }
        ],
        hints: ["Compare string with its reverse"],
        tags: ["strings", "easy"],
        isActive: true
    },
    {
        title: "Sum of Array",
        description: "Calculate sum of all elements",
        problemStatement: "<p>Given an array of integers, return the sum of all elements.</p>",
        domain: "dsa",
        difficulty: "easy",
        xpReward: 10,
        starterCode: {
            python: "def array_sum(arr):\n    # Your code here\n    pass",
            javascript: "function arraySum(arr) {\n    // Your code here\n}",
            java: "public int arraySum(int[] arr) {\n    // Your code here\n}",
            cpp: "int arraySum(vector<int>& arr) {\n    // Your code here\n}"
        },
        testCases: [
            { input: { arr: [1, 2, 3, 4, 5] }, expectedOutput: 15 }
        ],
        hints: ["Use a loop or built-in sum function"],
        tags: ["arrays", "easy"],
        isActive: true
    },
    {
        title: "Find Missing Number",
        description: "Find the missing number from 1 to N",
        problemStatement: "<p>Given an array containing n-1 numbers from 1 to n, find the missing number.</p>",
        domain: "dsa",
        difficulty: "easy",
        xpReward: 15,
        starterCode: {
            python: "def find_missing(arr, n):\n    # Your code here\n    pass",
            javascript: "function findMissing(arr, n) {\n    // Your code here\n}",
            java: "public int findMissing(int[] arr, int n) {\n    // Your code here\n}",
            cpp: "int findMissing(vector<int>& arr, int n) {\n    // Your code here\n}"
        },
        testCases: [
            { input: { arr: [1, 2, 4, 5], n: 5 }, expectedOutput: 3 }
        ],
        hints: ["Use sum formula: n*(n+1)/2"],
        tags: ["arrays", "math", "easy"],
        isActive: true
    },
    {
        title: "Factorial",
        description: "Calculate factorial of a number",
        problemStatement: "<p>Calculate n! (factorial of n).</p>",
        domain: "dsa",
        difficulty: "easy",
        xpReward: 10,
        starterCode: {
            python: "def factorial(n):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { n: 5 }, expectedOutput: 120 }
        ],
        hints: ["Use recursion or loop"],
        tags: ["recursion", "easy"],
        isActive: true
    },
    {
        title: "Fibonacci Number",
        description: "Find nth Fibonacci number",
        problemStatement: "<p>Return the nth number in the Fibonacci sequence.</p>",
        domain: "dsa",
        difficulty: "easy",
        xpReward: 15,
        starterCode: {
            python: "def fibonacci(n):\n    # Your code here\n    pass",
            javascript: "function fibonacci(n) {\n    // Your code here\n}",
            java: "public int fibonacci(int n) {\n    // Your code here\n}",
            cpp: "int fibonacci(int n) {\n    // Your code here\n}"
        },
        testCases: [
            { input: { n: 6 }, expectedOutput: 8 }
        ],
        hints: ["F(n) = F(n-1) + F(n-2)"],
        tags: ["recursion", "easy"],
        isActive: true
    },
    {
        title: "Check Sorted Array",
        description: "Check if array is sorted",
        problemStatement: "<p>Return true if the array is sorted in ascending order.</p>",
        domain: "dsa",
        difficulty: "easy",
        xpReward: 10,
        starterCode: {
            python: "def is_sorted(arr):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { arr: [1, 2, 3, 4] }, expectedOutput: true },
            { input: { arr: [1, 3, 2] }, expectedOutput: false }
        ],
        hints: ["Compare adjacent elements"],
        tags: ["arrays", "easy"],
        isActive: true
    },
    {
        title: "Check Anagram",
        description: "Check if two strings are anagrams",
        problemStatement: "<p>Return true if two strings are anagrams of each other.</p>",
        domain: "dsa",
        difficulty: "easy",
        xpReward: 15,
        starterCode: {
            python: "def is_anagram(s1, s2):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { s1: "listen", s2: "silent" }, expectedOutput: true }
        ],
        hints: ["Sort both strings or use frequency count"],
        tags: ["strings", "easy"],
        isActive: true
    },
    {
        title: "Binary Search",
        description: "Implement binary search",
        problemStatement: "<p>Find the index of target in a sorted array using binary search.</p>",
        domain: "dsa",
        difficulty: "easy",
        xpReward: 15,
        starterCode: {
            python: "def binary_search(arr, target):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { arr: [1, 2, 3, 4, 5], target: 3 }, expectedOutput: 2 }
        ],
        hints: ["Use left and right pointers"],
        tags: ["arrays", "searching", "easy"],
        isActive: true
    },

    // ========== MEDIUM QUESTIONS (10) ==========
    {
        title: "Two Sum",
        description: "Find two numbers that add up to target",
        problemStatement: "<p>Given an array of integers and a target, return indices of two numbers that add up to target.</p>",
        domain: "dsa",
        difficulty: "medium",
        xpReward: 20,
        starterCode: {
            python: "def two_sum(nums, target):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1] }
        ],
        hints: ["Use a hash map to store complements"],
        tags: ["arrays", "hash-map", "medium"],
        isActive: true
    },
    {
        title: "Longest Substring Without Repeating Characters",
        description: "Find length of longest substring without repeating characters",
        problemStatement: "<p>Given a string, find the length of the longest substring without repeating characters.</p>",
        domain: "dsa",
        difficulty: "medium",
        xpReward: 25,
        starterCode: {
            python: "def length_of_longest_substring(s):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { s: "abcabcbb" }, expectedOutput: 3 }
        ],
        hints: ["Use sliding window technique"],
        tags: ["strings", "sliding-window", "medium"],
        isActive: true
    },
    {
        title: "Valid Parentheses",
        description: "Check if parentheses are balanced",
        problemStatement: "<p>Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.</p>",
        domain: "dsa",
        difficulty: "medium",
        xpReward: 20,
        starterCode: {
            python: "def is_valid(s):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { s: "()[]{}" }, expectedOutput: true },
            { input: { s: "(]" }, expectedOutput: false }
        ],
        hints: ["Use a stack"],
        tags: ["strings", "stack", "medium"],
        isActive: true
    },
    {
        title: "Merge Intervals",
        description: "Merge overlapping intervals",
        problemStatement: "<p>Given an array of intervals, merge all overlapping intervals.</p>",
        domain: "dsa",
        difficulty: "medium",
        xpReward: 25,
        starterCode: {
            python: "def merge(intervals):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }, expectedOutput: [[1, 6], [8, 10], [15, 18]] }
        ],
        hints: ["Sort intervals first"],
        tags: ["arrays", "sorting", "medium"],
        isActive: true
    },
    {
        title: "Group Anagrams",
        description: "Group strings that are anagrams",
        problemStatement: "<p>Given an array of strings, group anagrams together.</p>",
        domain: "dsa",
        difficulty: "medium",
        xpReward: 25,
        starterCode: {
            python: "def group_anagrams(strs):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { strs: ["eat", "tea", "tan", "ate", "nat", "bat"] }, expectedOutput: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]] }
        ],
        hints: ["Use sorted string as key in hash map"],
        tags: ["strings", "hash-map", "medium"],
        isActive: true
    },
    {
        title: "Product of Array Except Self",
        description: "Calculate product of all elements except current",
        problemStatement: "<p>Given an array, return an array where each element is the product of all other elements.</p>",
        domain: "dsa",
        difficulty: "medium",
        xpReward: 25,
        starterCode: {
            python: "def product_except_self(nums):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { nums: [1, 2, 3, 4] }, expectedOutput: [24, 12, 8, 6] }
        ],
        hints: ["Use prefix and suffix products"],
        tags: ["arrays", "medium"],
        isActive: true
    },
    {
        title: "3Sum",
        description: "Find all triplets that sum to zero",
        problemStatement: "<p>Given an array, find all unique triplets that sum to zero.</p>",
        domain: "dsa",
        difficulty: "medium",
        xpReward: 30,
        starterCode: {
            python: "def three_sum(nums):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { nums: [-1, 0, 1, 2, -1, -4] }, expectedOutput: [[-1, -1, 2], [-1, 0, 1]] }
        ],
        hints: ["Sort array first, use two pointers"],
        tags: ["arrays", "two-pointers", "medium"],
        isActive: true
    },
    {
        title: "Container With Most Water",
        description: "Find container that holds most water",
        problemStatement: "<p>Given an array of heights, find two lines that together with x-axis forms a container that holds the most water.</p>",
        domain: "dsa",
        difficulty: "medium",
        xpReward: 25,
        starterCode: {
            python: "def max_area(height):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, expectedOutput: 49 }
        ],
        hints: ["Use two pointers from both ends"],
        tags: ["arrays", "two-pointers", "medium"],
        isActive: true
    },
    {
        title: "Longest Palindromic Substring",
        description: "Find the longest palindromic substring",
        problemStatement: "<p>Given a string, return the longest palindromic substring.</p>",
        domain: "dsa",
        difficulty: "medium",
        xpReward: 30,
        starterCode: {
            python: "def longest_palindrome(s):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { s: "babad" }, expectedOutput: "bab" }
        ],
        hints: ["Expand around center"],
        tags: ["strings", "medium"],
        isActive: true
    },
    {
        title: "Rotate Array",
        description: "Rotate array k steps to the right",
        problemStatement: "<p>Given an array, rotate it to the right by k steps.</p>",
        domain: "dsa",
        difficulty: "medium",
        xpReward: 20,
        starterCode: {
            python: "def rotate(nums, k):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { nums: [1, 2, 3, 4, 5, 6, 7], k: 3 }, expectedOutput: [5, 6, 7, 1, 2, 3, 4] }
        ],
        hints: ["Reverse the array in parts"],
        tags: ["arrays", "medium"],
        isActive: true
    },

    // ========== HARD QUESTIONS (10) ==========
    {
        title: "Trapping Rain Water",
        description: "Calculate how much rain water can be trapped",
        problemStatement: "<p>Given an array representing elevation map, compute how much water it can trap after raining.</p>",
        domain: "dsa",
        difficulty: "hard",
        xpReward: 50,
        starterCode: {
            python: "def trap(height):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }, expectedOutput: 6 }
        ],
        hints: ["Use two pointers or dynamic programming"],
        tags: ["arrays", "two-pointers", "hard"],
        isActive: true
    },
    {
        title: "Median of Two Sorted Arrays",
        description: "Find median of two sorted arrays",
        problemStatement: "<p>Given two sorted arrays, find the median of the two sorted arrays.</p>",
        domain: "dsa",
        difficulty: "hard",
        xpReward: 50,
        starterCode: {
            python: "def find_median_sorted_arrays(nums1, nums2):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { nums1: [1, 3], nums2: [2] }, expectedOutput: 2.0 }
        ],
        hints: ["Use binary search"],
        tags: ["arrays", "binary-search", "hard"],
        isActive: true
    },
    {
        title: "Longest Valid Parentheses",
        description: "Find length of longest valid parentheses substring",
        problemStatement: "<p>Given a string containing just '(' and ')', find the length of the longest valid parentheses substring.</p>",
        domain: "dsa",
        difficulty: "hard",
        xpReward: 50,
        starterCode: {
            python: "def longest_valid_parentheses(s):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { s: "(()" }, expectedOutput: 2 },
            { input: { s: ")()())" }, expectedOutput: 4 }
        ],
        hints: ["Use stack or dynamic programming"],
        tags: ["strings", "stack", "hard"],
        isActive: true
    },
    {
        title: "Word Ladder",
        description: "Find shortest transformation sequence",
        problemStatement: "<p>Given two words and a dictionary, find the length of shortest transformation sequence from start to end word.</p>",
        domain: "dsa",
        difficulty: "hard",
        xpReward: 50,
        starterCode: {
            python: "def ladder_length(begin_word, end_word, word_list):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { begin_word: "hit", end_word: "cog", word_list: ["hot", "dot", "dog", "lot", "log", "cog"] }, expectedOutput: 5 }
        ],
        hints: ["Use BFS"],
        tags: ["graphs", "bfs", "hard"],
        isActive: true
    },
    {
        title: "Regular Expression Matching",
        description: "Implement regex matching with . and *",
        problemStatement: "<p>Implement regular expression matching with support for '.' and '*'.</p>",
        domain: "dsa",
        difficulty: "hard",
        xpReward: 50,
        starterCode: {
            python: "def is_match(s, p):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { s: "aa", p: "a*" }, expectedOutput: true }
        ],
        hints: ["Use dynamic programming"],
        tags: ["strings", "dp", "hard"],
        isActive: true
    },
    {
        title: "Merge K Sorted Lists",
        description: "Merge k sorted linked lists",
        problemStatement: "<p>Merge k sorted linked lists and return it as one sorted list.</p>",
        domain: "dsa",
        difficulty: "hard",
        xpReward: 50,
        starterCode: {
            python: "def merge_k_lists(lists):\n    # Your code here\n    pass"
        },
        testCases: [],
        hints: ["Use min heap or divide and conquer"],
        tags: ["linked-list", "heap", "hard"],
        isActive: true
    },
    {
        title: "Minimum Window Substring",
        description: "Find minimum window containing all characters",
        problemStatement: "<p>Given strings s and t, find the minimum window in s which contains all characters of t.</p>",
        domain: "dsa",
        difficulty: "hard",
        xpReward: 50,
        starterCode: {
            python: "def min_window(s, t):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { s: "ADOBECODEBANC", t: "ABC" }, expectedOutput: "BANC" }
        ],
        hints: ["Use sliding window"],
        tags: ["strings", "sliding-window", "hard"],
        isActive: true
    },
    {
        title: "Longest Consecutive Sequence",
        description: "Find length of longest consecutive sequence",
        problemStatement: "<p>Given an unsorted array, find the length of the longest consecutive elements sequence.</p>",
        domain: "dsa",
        difficulty: "hard",
        xpReward: 40,
        starterCode: {
            python: "def longest_consecutive(nums):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { nums: [100, 4, 200, 1, 3, 2] }, expectedOutput: 4 }
        ],
        hints: ["Use hash set"],
        tags: ["arrays", "hash-map", "hard"],
        isActive: true
    },
    {
        title: "Edit Distance",
        description: "Find minimum edit distance between two strings",
        problemStatement: "<p>Given two strings, find the minimum number of operations to convert one to another.</p>",
        domain: "dsa",
        difficulty: "hard",
        xpReward: 50,
        starterCode: {
            python: "def min_distance(word1, word2):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { word1: "horse", word2: "ros" }, expectedOutput: 3 }
        ],
        hints: ["Use dynamic programming"],
        tags: ["strings", "dp", "hard"],
        isActive: true
    },
    {
        title: "Sliding Window Maximum",
        description: "Find maximum in each sliding window",
        problemStatement: "<p>Given an array and window size k, find the maximum in each sliding window.</p>",
        domain: "dsa",
        difficulty: "hard",
        xpReward: 50,
        starterCode: {
            python: "def max_sliding_window(nums, k):\n    # Your code here\n    pass"
        },
        testCases: [
            { input: { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 }, expectedOutput: [3, 3, 5, 5, 6, 7] }
        ],
        hints: ["Use deque"],
        tags: ["arrays", "sliding-window", "hard"],
        isActive: true
    }
]

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB')

        // Clear existing quests
        await Quest.deleteMany({})
        console.log('Cleared existing quests')

        // Insert new quests
        await Quest.insertMany(quests)
        console.log(`Inserted ${quests.length} quests (10 Easy, 10 Medium, 10 Hard)`)

        process.exit(0)
    })
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
