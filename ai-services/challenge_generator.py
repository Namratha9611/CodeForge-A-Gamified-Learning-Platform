import random
import json
from datetime import datetime

class AdaptiveChallengeGenerator:
    def __init__(self):
        # Expanded question repository with multiple topics
        self.questions_repo = {
            "arrays": {
                "easy": [
                    "Find the missing number in an array of 1 to N",
                    "Find the maximum element in an array",
                    "Reverse an array in-place",
                    "Check if array is sorted",
                    "Find second largest element in array",
                    "Remove duplicates from sorted array",
                    "Merge two sorted arrays"
                ],
                "medium": [
                    "Rotate an array K times to the right",
                    "Find the maximum subarray sum (Kadane's Algorithm)",
                    "Find all pairs with given sum",
                    "Move all zeros to end of array",
                    "Find the majority element (Boyer-Moore)",
                    "Product of array except self"
                ],
                "hard": [
                    "Trapping Rain Water problem",
                    "Find all triplets that sum to zero",
                    "Sliding Window Maximum",
                    "Longest consecutive sequence",
                    "Median of two sorted arrays"
                ]
            },
            "strings": {
                "easy": [
                    "Reverse a string",
                    "Check if string is palindrome",
                    "Count vowels and consonants",
                    "Remove spaces from string",
                    "Check if two strings are anagrams"
                ],
                "medium": [
                    "Longest Palindromic Substring",
                    "Implement strStr() / indexOf()",
                    "Group Anagrams together",
                    "Longest Substring Without Repeating Characters",
                    "Valid Parentheses checker"
                ],
                "hard": [
                    "Minimum Window Substring",
                    "Edit Distance (Levenshtein)",
                    "Regular Expression Matching",
                    "Wildcard Pattern Matching"
                ]
            },
            "hash_map": {
                "easy": [
                    "Two Sum problem",
                    "Count frequency of elements",
                    "First unique character in a string",
                    "Check if array contains duplicates"
                ],
                "medium": [
                    "Subarray Sum Equals K",
                    "Longest Consecutive Sequence",
                    "Group Anagrams",
                    "Top K Frequent Elements"
                ],
                "hard": [
                    "LRU Cache implementation",
                    "Design HashMap from scratch",
                    "Alien Dictionary problem"
                ]
            },
            "two_pointers": {
                "easy": [
                    "Remove duplicates from sorted array",
                    "Valid Palindrome check",
                    "Merge two sorted arrays"
                ],
                "medium": [
                    "Container With Most Water",
                    "3Sum problem",
                    "Sort Colors (Dutch National Flag)"
                ],
                "hard": [
                    "Trapping Rain Water",
                    "Minimum Window Substring"
                ]
            },
            "sliding_window": {
                "medium": [
                    "Maximum Sum Subarray of Size K",
                    "Longest Substring with K Unique Characters",
                    "Minimum Size Subarray Sum"
                ],
                "hard": [
                    "Sliding Window Maximum",
                    "Minimum Window Substring",
                    "Longest Substring with At Most K Distinct Characters"
                ]
            },
            "recursion": {
                "easy": [
                    "Calculate Factorial recursively",
                    "Fibonacci Sequence using recursion",
                    "Sum of digits using recursion",
                    "Reverse a string using recursion"
                ],
                "medium": [
                    "Generate all subsets of a set",
                    "Permutations of a string",
                    "Tower of Hanoi implementation",
                    "Generate all valid parentheses combinations"
                ],
                "hard": [
                    "N-Queens problem",
                    "Sudoku Solver",
                    "Word Search in grid"
                ]
            },
            "dynamic_programming": {
                "easy": [
                    "Climbing Stairs problem",
                    "House Robber (non-adjacent sum)",
                    "Min Cost Climbing Stairs"
                ],
                "medium": [
                    "Longest Increasing Subsequence",
                    "Coin Change problem",
                    "0/1 Knapsack problem",
                    "Longest Common Subsequence",
                    "Partition Equal Subset Sum"
                ],
                "hard": [
                    "Edit Distance",
                    "Longest Palindromic Subsequence",
                    "Burst Balloons",
                    "Regular Expression Matching"
                ]
            },
            "linked_lists": {
                "easy": [
                    "Reverse a linked list",
                    "Find middle of linked list",
                    "Detect cycle in linked list",
                    "Merge two sorted linked lists"
                ],
                "medium": [
                    "Remove Nth node from end",
                    "Add two numbers represented as linked lists",
                    "Reorder linked list",
                    "Copy list with random pointer"
                ],
                "hard": [
                    "Merge K sorted linked lists",
                    "Reverse nodes in K-group"
                ]
            },
            "trees": {
                "easy": [
                    "Maximum depth of binary tree",
                    "Invert a binary tree",
                    "Check if two trees are identical",
                    "Binary tree level order traversal"
                ],
                "medium": [
                    "Validate Binary Search Tree",
                    "Lowest Common Ancestor",
                    "Binary Tree Zigzag Level Order Traversal",
                    "Construct Binary Tree from Preorder and Inorder"
                ],
                "hard": [
                    "Serialize and Deserialize Binary Tree",
                    "Binary Tree Maximum Path Sum",
                    "Recover Binary Search Tree"
                ]
            },
            "graphs": {
                "medium": [
                    "Number of Islands (DFS/BFS)",
                    "Clone Graph",
                    "Course Schedule (Topological Sort)",
                    "Word Ladder"
                ],
                "hard": [
                    "Alien Dictionary",
                    "Shortest Path in Weighted Graph (Dijkstra)",
                    "Minimum Spanning Tree (Kruskal/Prim)",
                    "Detect cycle in directed graph"
                ]
            }
        }

    def _analyze_user(self, profile):
        """Analyze user thinking style based on stats"""
        avg_time = profile.get("average_time", 300)
        accuracy = profile.get("accuracy", 0.7)
        level = profile.get("level", 1)
        
        # Determine challenge style
        if avg_time > 600 and accuracy > 0.8:
            style = "concept_builder"
            reason = "You take your time to get things right. This pack focuses on fundamental concepts with gradual difficulty increase to strengthen your foundation."
            focus_topics = ["arrays", "strings", "hash_map"]
            num_questions = random.randint(8, 12)
            
        elif avg_time < 200 and accuracy < 0.6:
            style = "precision_training"
            reason = "You're fast but accuracy needs work. This pack includes edge-case heavy problems to improve precision and attention to detail."
            focus_topics = ["two_pointers", "arrays", "strings"]
            num_questions = random.randint(6, 10)
            
        elif level > 10 or (avg_time < 300 and accuracy > 0.9):
            style = "optimization_master"
            reason = "You're solving problems quickly and accurately! Time to focus on advanced optimization and complex algorithms."
            focus_topics = ["dynamic_programming", "graphs", "sliding_window"]
            num_questions = random.randint(10, 15)
            
        elif accuracy < 0.5:
            style = "fundamentals_refresh"
            reason = "Let's rebuild your confidence with core concepts. This pack covers essential patterns you'll use everywhere."
            focus_topics = ["arrays", "strings", "hash_map"]
            num_questions = random.randint(5, 8)
            
        else:
            style = "balanced_growth"
            reason = "You're making steady progress! This balanced pack covers multiple topics to expand your problem-solving toolkit."
            focus_topics = ["arrays", "strings", "hash_map", "two_pointers", "recursion"]
            num_questions = random.randint(10, 15)
        
        return style, reason, focus_topics, num_questions

    def generate(self, profile):
        requested_topic = profile.get("topic", "").lower().replace(" ", "_")
        style, reason, focus_topics, _ = self._analyze_user(profile)
        
        # Override style reason if a specific topic is requested
        if requested_topic and requested_topic in self.questions_repo:
            reason = f"This custom pack focuses specifically on your requested topic: {requested_topic.replace('_', ' ').title()}. It's designed to provide deep practice in this specific area."
            focus_topics = [requested_topic]

        # STRICT RULES: Exactly 10 questions, 3 Easy / 4 Medium / 3 Hard
        num_questions = 10
        num_easy = 3
        num_medium = 4
        num_hard = 3
        
        questions = []
        used_topics = []
        
        # MANDATORY TOPICS (only if no specific topic is requested)
        if not requested_topic:
            mandatory_topics = {
                "arrays": 2,      # At least 2 arrays questions
                "dynamic_programming": 1,  # At least 1 DP
                "graphs": 1,      # At least 1 Graph
            }
        else:
            mandatory_topics = {requested_topic: 4} # Focus heavily on requested topic

        # RESTRICTED TOPICS (prevent repetition)
        max_recursion = 1  # Maximum 1 recursion question
        
        # Helper function to pick a question
        def pick_question(difficulty, required_topic=None):
            attempts = 0
            while attempts < 100:  # Prevent infinite loop
                if required_topic:
                    topic = required_topic
                else:
                    # Pick from available topics, prioritizing focus topics
                    if random.random() < 0.7: # 70% chance to pick from focus topics
                        topic = random.choice(focus_topics)
                    else:
                        available_topics = [t for t in self.questions_repo.keys() 
                                           if t != "recursion" or used_topics.count("recursion") < max_recursion]
                        if not available_topics:
                            available_topics = list(self.questions_repo.keys())
                        topic = random.choice(available_topics)
                
                if topic in self.questions_repo and difficulty in self.questions_repo[topic]:
                    available = self.questions_repo[topic][difficulty]
                    if available:
                        # Shuffle to ensure variety
                        random.shuffle(available)
                        question_text = available[0]
                        # Don't pick the same question twice in one pack
                        if not any(q['text'] == question_text for q in questions):
                            used_topics.append(topic)
                            return {
                                "text": question_text,
                                "difficulty": difficulty.capitalize(),
                                "topic": topic.replace("_", " ").title()
                            }
                attempts += 1
            return None
        
        # Step 1: Add MANDATORY/Focus questions first
        for topic, count in mandatory_topics.items():
            for _ in range(count):
                # Try to distribute across difficulties
                diffs = ["easy", "medium", "hard"]
                random.shuffle(diffs)
                for diff in diffs:
                    if diff == "easy" and num_easy > 0:
                        q = pick_question("easy", topic)
                        if q:
                            questions.append(q)
                            num_easy -= 1
                            break
                    if diff == "medium" and num_medium > 0:
                        q = pick_question("medium", topic)
                        if q:
                            questions.append(q)
                            num_medium -= 1
                            break
                    if diff == "hard" and num_hard > 0:
                        q = pick_question("hard", topic)
                        if q:
                            questions.append(q)
                            num_hard -= 1
                            break
        
        # Step 2: Fill remaining slots with variety
        while len(questions) < num_questions:
            if num_easy > 0:
                q = pick_question("easy")
                if q:
                    questions.append(q)
                    num_easy -= 1
                else: num_easy = 0 # Break if no more easy
            elif num_medium > 0:
                q = pick_question("medium")
                if q:
                    questions.append(q)
                    num_medium -= 1
                else: num_medium = 0
            elif num_hard > 0:
                q = pick_question("hard")
                if q:
                    questions.append(q)
                    num_hard -= 1
                else: num_hard = 0
            else:
                break
        
        # Final Randomization attempt if still not 10
        if len(questions) < 10:
            for diff in ["medium", "easy", "hard"]:
                while len(questions) < 10:
                    q = pick_question(diff)
                    if q: questions.append(q)
                    else: break

        # Sort by difficulty for progression
        difficulty_order = {"Easy": 1, "Medium": 2, "Hard": 3}
        questions.sort(key=lambda x: difficulty_order[x["difficulty"]])
        
        # Ensure we have exactly 10
        questions = questions[:10]
        
        # Generate title
        if requested_topic:
            title = f"{requested_topic.replace('_', ' ').title()} Mastery Pack"
        else:
            title = f"{style.replace('_', ' ').title()} Challenge Pack"
        
        # Generate HTML Output
        html_output = f"""<h1 class="text-3xl font-bold mb-4">{title} (AI-Generated)</h1>

<h2 class="text-xl font-bold mt-6 mb-2">Why This Challenge?</h2>
<p class="mb-4 text-gray-700">{reason}</p>

<h2 class="text-xl font-bold mt-6 mb-2">Difficulty Progression</h2>
<div class="flex gap-2 mb-6">
    <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-semibold">Easy</span>
    <span class="text-gray-400">→</span>
    <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-semibold">Medium</span>
    <span class="text-gray-400">→</span>
    <span class="px-2 py-1 bg-red-100 text-red-800 rounded text-sm font-semibold">Hard</span>
</div>

<h3 class="text-lg font-bold mt-8 mb-4">Your Challenge Roadmap (10 Questions):</h3>
<ol class="list-decimal space-y-4 ml-5">
"""
        for i, q in enumerate(questions, 1):
            badge_color = {
                "Easy": "bg-green-100 text-green-800",
                "Medium": "bg-yellow-100 text-yellow-800",
                "Hard": "bg-red-100 text-red-800"
            }[q['difficulty']]
            
            html_output += f"""    <li class="pl-2">
        <span class="inline-block px-2 py-0.5 rounded text-xs font-bold {badge_color} mr-2">{q['difficulty']}</span>
        <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 mr-2">{q['topic']}</span>
        <span class="font-medium">{q['text']}</span>
    </li>
"""
        html_output += "</ol>"
        
        return {
            "markdown": html_output,
            "title": title,
            "meta": {
                "style": style,
                "question_count": len(questions),
                "topics": list(set([q['topic'] for q in questions]))
            }
        }
