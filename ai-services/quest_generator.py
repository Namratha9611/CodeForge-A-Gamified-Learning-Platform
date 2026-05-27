import random
import json

class QuestGenerator:
    def __init__(self):
        self.templates = {
            "arrays": [
                {
                    "title": "Reverse an Array",
                    "description": "Write a function that reverses an array in-place.",
                    "problemStatement": "<h3>Array Reversal</h3><p>Given an array of integers, reverse the array in-place. Do not use built-in reverse methods.</p>",
                    "difficulty": "easy",
                    "starterCode": {
                        "python": "def solve(arr):\n    # Your code here\n    pass",
                        "javascript": "function solve(arr) {\n    // Your code here\n}"
                    },
                    "testCases": [
                        {"input": {"arr": [1, 2, 3]}, "expectedOutput": [3, 2, 1]},
                        {"input": {"arr": [5, 4]}, "expectedOutput": [4, 5]}
                    ],
                    "hints": ["Use two pointers", "Swap elements at both ends"]
                },
                {
                    "title": "Maximum Subarray Sum",
                    "description": "Find the maximum sum of a contiguous subarray.",
                    "problemStatement": "<h3>Maximum Subarray (Kadane's)</h3><p>Find the contiguous subarray within an array (containing at least one number) which has the largest sum.</p>",
                    "difficulty": "medium",
                    "starterCode": {
                        "python": "def solve(arr):\n    # Your code here\n    pass"
                    },
                    "testCases": [
                        {"input": {"arr": [-2, 1, -3, 4, -1, 2, 1, -5, 4]}, "expectedOutput": 6}
                    ],
                    "hints": ["Use Kadane's algorithm", "Keep track of current sum and max sum"]
                }
            ],
            "strings": [
                {
                    "title": "Palindrome Check",
                    "description": "Determine if a string is a palindrome.",
                    "problemStatement": "<h3>Palindrome Check</h3><p>Given a string, return true if it is a palindrome, false otherwise. Ignore non-alphanumeric characters.</p>",
                    "difficulty": "easy",
                    "starterCode": {
                        "python": "def solve(s):\n    # Your code here\n    pass"
                    },
                    "testCases": [
                        {"input": {"s": "racecar"}, "expectedOutput": True},
                        {"input": {"s": "hello"}, "expectedOutput": False}
                    ],
                    "hints": ["Two pointer approach", "String cleanup first"]
                }
            ],
            "linked_lists": [
                {
                    "title": "Reverse Linked List",
                    "description": "Reverse a singly linked list.",
                    "problemStatement": "<h3>Reverse Linked List</h3><p>Given the head of a singly linked list, reverse the list and return its head.</p>",
                    "difficulty": "medium",
                    "starterCode": {
                        "python": "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef solve(head):\n    # Your code here\n    pass"
                    },
                    "testCases": [],
                    "hints": ["Use iterators", "Keep track of previous node"]
                }
            ],
            "trees": [
                {
                    "title": "Invert Binary Tree",
                    "description": "Flip a binary tree horizontally.",
                    "problemStatement": "<h3>Invert Binary Tree</h3><p>Given the root of a binary tree, invert the tree and return its root.</p>",
                    "difficulty": "medium",
                    "starterCode": {
                        "python": "def solve(root):\n    # Your code here\n    pass"
                    },
                    "testCases": [],
                    "hints": ["Recursive approach", "Swap left and right children"]
                },
                {
                    "title": "Binary Tree Max Depth",
                    "description": "Find the maximum depth of a binary tree.",
                    "problemStatement": "<h3>Binary Tree Depth</h3><p>Given the root of a binary tree, return its maximum depth (number of nodes along the longest path).</p>",
                    "difficulty": "easy",
                    "starterCode": {
                        "python": "def solve(root):\n    # Your code here\n    return 0"
                    },
                    "testCases": [],
                    "hints": ["Recursion is your friend", "Base case is null root"]
                }
            ],
            "dynamic_programming": [
                {
                    "title": "Climbing Stairs",
                    "description": "Find the number of ways to climb stairs.",
                    "problemStatement": "<h3>Climbing Stairs</h3><p>You are climbing a staircase. It takes <i>n</i> steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?</p>",
                    "difficulty": "easy",
                    "starterCode": {
                        "python": "def solve(n):\n    # Your code here\n    pass"
                    },
                    "testCases": [
                        {"input": {"n": 2}, "expectedOutput": 2},
                        {"input": {"n": 3}, "expectedOutput": 3}
                    ],
                    "hints": ["Fibonacci relationship", "Think about the last step taken"]
                }
            ],
            "recursion": [
                {
                    "title": "N-Queens",
                    "description": "Solve the N-Queens puzzle.",
                    "problemStatement": "<h3>N-Queens</h3><p>Place n queens on an n×n chessboard such that no two queens attack each other.</p>",
                    "difficulty": "hard",
                    "starterCode": {
                        "python": "def solve(n):\n    # Your code here\n    pass"
                    },
                    "testCases": [],
                    "hints": ["Backtracking", "Verify row/column/diagonal constraints"]
                }
            ],
            "hash_map": [
                {
                    "title": "Two Sum (HashMap)",
                    "description": "Find indices of two numbers that sum to target.",
                    "problemStatement": "<h3>Two Sum</h3><p>Given an array and a target, return indices of two numbers that add up to target. Use a hash map for O(n) complexity.</p>",
                    "difficulty": "easy",
                    "starterCode": {
                        "python": "def solve(nums, target):\n    # Your code here\n    pass"
                    },
                    "testCases": [
                        {"input": {"nums": [2, 7, 11, 15], "target": 9}, "expectedOutput": [0, 1]}
                    ],
                    "hints": ["Store value:index in a dictionary", "Check for complement (target - num)"]
                }
            ],
            "graphs": [
                {
                    "title": "Number of Islands",
                    "description": "Count islands in a 2D grid.",
                    "problemStatement": "<h3>Number of Islands</h3><p>Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.</p>",
                    "difficulty": "medium",
                    "starterCode": {
                        "python": "def solve(grid):\n    # Your code here\n    pass"
                    },
                    "testCases": [],
                    "hints": ["DFS or BFS", "Mark visited cells"]
                }
            ]
        }

    def _generate_with_llm(self, domain, difficulty, topic):
        """
        Uses an LLM (like Groq, OpenAI, or Gemini) to dynamically generate
        a completely new coding problem.
        """
        prompt = f"""
        You are an intelligent personalized coding tutor (acting like an AI mentor similar to LeetCode and Duolingo).
        
        Generate a completely unique coding challenge for a student.
        Domain: {domain}
        Specific Topic: {topic}
        Difficulty: {difficulty} (easy/medium/hard)
        
        Requirements:
        1. Create an engaging, gamified problem title.
        2. Provide a clear, story-driven description.
        3. Write a precise problem statement with HTML tags (<h3>, <p>).
        4. Provide python starter code.
        5. Provide 2-3 test cases in JSON format.
        6. Provide 2 hints for the student.
        
        Output EXACTLY as valid JSON with the following schema:
        {{
            "title": "string",
            "description": "string",
            "problemStatement": "string",
            "starterCode": {{"python": "string"}},
            "testCases": [{{"input": {{"var": "value"}}, "expectedOutput": "value"}}],
            "hints": ["string"]
        }}
        """
        
        # NOTE: In a production environment with an API key, you would call your LLM here.
        # Example using Groq:
        # client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
        # response = client.chat.completions.create(
        #     model="llama3-8b-8192",
        #     messages=[{"role": "system", "content": prompt}]
        # )
        # return json.loads(response.choices[0].message.content)
        
        return None

    def generate(self, domain="dsa", difficulty="medium"):
        # Normalize domain
        domain = domain.lower().replace(" ", "_")
        
        if domain == "dsa":
            topic = random.choice(list(self.templates.keys()))
        else:
            topic = domain
            
        # Try to generate using LLM if configured
        try:
            llm_quest = self._generate_with_llm(domain, difficulty, topic)
            if llm_quest:
                llm_quest["domain"] = domain
                llm_quest["difficulty"] = difficulty
                llm_quest["xpReward"] = 50 if difficulty == "hard" else (30 if difficulty == "medium" else 15)
                llm_quest["tags"] = [domain, difficulty, "llm-generated"]
                llm_quest["isActive"] = True
                return llm_quest
        except Exception as e:
            print(f"LLM generation failed, falling back to templates: {e}")
            
        # Fallback to predefined templates
        options = self.templates.get(topic, self.templates["arrays"])
        
        # Try to find matching difficulty
        matching = [t for t in options if t["difficulty"] == difficulty]
        if not matching:
            matching = options # Fallback
            
        variant = random.choice(matching)
        
        quest = {
            "title": variant["title"],
            "description": variant["description"],
            "problemStatement": variant["problemStatement"],
            "domain": domain,
            "difficulty": variant["difficulty"],
            "xpReward": 50 if variant["difficulty"] == "hard" else (30 if variant["difficulty"] == "medium" else 15),
            "starterCode": variant["starterCode"],
            "testCases": variant.get("testCases", []),
            "hints": variant.get("hints", []),
            "tags": [domain, variant["difficulty"], "ai-generated"],
            "isActive": True
        }
        
        return quest
