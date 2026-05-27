"""
Adaptive AI Engine: Hint Generator, Code Analyzer, Similar Problem Generator
"""
from typing import Dict, List, Optional
import random

class HintEngine:
    """Smart progressive hint system that analyzes the problem statement to give specific hints."""

    def get_hint(self, topic: str, hint_index: int, problem_statement: Optional[str] = None) -> Dict:
        hints = []
        stmt = (problem_statement or "").lower()

        # ── Smart Context-Aware Hint Generation ──
        if "max" in stmt or "largest" in stmt:
            hints = [
                "Start by assuming the first element is the maximum.",
                "Traverse the array using a loop and compare each value.",
                "Update your maximum variable whenever you find a larger number."
            ]
        elif "sum" in stmt and ("two" in stmt or "pair" in stmt):
            hints = [
                "A brute force approach uses two nested loops, but it's too slow (O(n²)).",
                "Try using a HashMap (dictionary) to store values you've already seen.",
                "For each number, check if (target - number) exists in your HashMap."
            ]
        elif "palindrome" in stmt:
            hints = [
                "A palindrome reads the same forwards and backwards.",
                "Try the two-pointer technique: one pointer at the start, one at the end.",
                "Compare the characters at both pointers and move them towards the center."
            ]
        elif "sort" in stmt:
            hints = [
                "Think about the time complexity requirement for sorting.",
                "Can you use an in-place sorting algorithm like QuickSort to save memory?",
                "If the range of numbers is small, consider Counting Sort for O(n) time."
            ]
        elif "tree" in stmt or "node" in stmt:
            hints = [
                "Think recursively: what should the function do for a single node?",
                "Identify your base case (e.g., when the node is null).",
                "Combine the results from the left and right subtrees."
            ]
        elif "reverse" in stmt:
            hints = [
                "If it's a string or array, two pointers swapping elements works well.",
                "If it's a linked list, you'll need to keep track of previous, current, and next nodes.",
                "Update the pointers step by step in a while loop."
            ]
        else:
            # Fallback based on domain
            fallbacks = {
                "arrays": [
                    "Try iterating through the array carefully.",
                    "Look for patterns: can two pointers or a sliding window help?",
                    "Consider if you need to keep track of a running sum or max value."
                ],
                "hash_map": [
                    "Use a dictionary to store elements for O(1) lookup.",
                    "Build the dictionary in a single pass as you iterate.",
                    "Think about what needs to be the key and what needs to be the value."
                ]
            }
            hints = fallbacks.get(topic, [
                "Read the constraints carefully to decide on the best approach.",
                "Try working out a small example on paper step-by-step.",
                "Break the logic into smaller chunks and solve one at a time."
            ])

        total = len(hints)
        idx = min(hint_index, total - 1)
        
        return {
            "hint": hints[idx],
            "hintNumber": idx + 1,
            "totalHints": total,
            "isLast": idx >= total - 1,
            "xpPenalty": (idx + 1) * 2,
        }



class CodeQualityAnalyzer:
    """Analyzes submitted code for complexity and quality hints."""

    BRUTE_PATTERNS = [
        ("nested for", ["for", "for"]),
        ("bubble sort style", ["for i", "for j"]),
    ]

    def analyze(self, code: str, language: str, passed: bool, time_ms: int = 0) -> Dict:
        code_lower = code.lower()
        lines = [l.strip() for l in code.split("\n") if l.strip()]
        line_count = len(lines)

        # Detect complexity clues
        nested_loops = code_lower.count("for") >= 2 or code_lower.count("while") >= 2
        uses_hashmap = any(kw in code_lower for kw in ["dict", "map", "hashmap", "{}", "defaultdict", "counter"])
        uses_sort = "sort" in code_lower
        uses_recursion = any(fn in code_lower for fn in ["def solve", "function solve", "return solve", "self("])

        # Code quality score (0-100)
        quality_score = 60
        if uses_hashmap: quality_score += 15
        if not nested_loops: quality_score += 10
        if line_count < 20: quality_score += 10
        
        # Specific checks
        if "max(" in code_lower and language == "python":
            quality_score -= 10
            suggestion = "Your solution uses Python's built-in max() function. Try implementing manual traversal to better understand arrays and algorithms."
        elif nested_loops and not uses_hashmap:
            complexity = "O(n²)"
            suggestion = "Try using a HashMap to reduce nested loops to O(n)."
        elif uses_sort:
            complexity = "O(n log n)"
            suggestion = "Good use of sorting! If you need O(n), consider a counting approach."
        elif uses_hashmap:
            complexity = "O(n)"
            suggestion = "Excellent! HashMap gives you O(n) time complexity. Clean code and great optimization."
        elif uses_recursion:
            complexity = "O(2ⁿ) or O(n) depending on memoization"
            suggestion = "If using recursion, add memoization (@lru_cache or a dp dict) to optimize."
        else:
            complexity = "O(n)"
            suggestion = "Looks efficient! Make sure edge cases are handled."

        if passed: quality_score += 5
        quality_score = min(quality_score, 100)

        feedback_lines = []
        if passed:
            feedback_lines.append(f"✅ Your solution is correct!")
        else:
            feedback_lines.append("❌ Solution did not pass all test cases.")

        feedback_lines.append(f"⏱️ Estimated complexity: **{complexity}**")
        feedback_lines.append(f"💡 Optimization & Code Review: {suggestion}")

        if time_ms and time_ms > 3000:
            feedback_lines.append("⚠️ Your solution was a bit slow — consider an alternative approach that avoids redundant calculations.")

        return {
            "complexity": complexity,
            "qualityScore": quality_score,
            "feedbackLines": feedback_lines,
            "suggestion": suggestion,
            "isOptimized": quality_score >= 80,
            "usesHashMap": uses_hashmap,
            "hasNestedLoops": nested_loops,
        }


class SimilarProblemGenerator:
    """Generates follow-up problems after solving a quest."""

    FOLLOW_UPS = {
        "arrays": [
            {"title": "Three Sum", "description": "Find all triplets that sum to zero.", "difficulty": "medium"},
            {"title": "Sliding Window Maximum", "description": "Find max in every window of size k.", "difficulty": "hard"},
            {"title": "Product of Array Except Self", "description": "Output array where each element is the product of all others.", "difficulty": "medium"},
        ],
        "hash_map": [
            {"title": "Group Anagrams", "description": "Group strings that are anagrams of each other.", "difficulty": "medium"},
            {"title": "Top K Frequent Elements", "description": "Find k most frequent elements.", "difficulty": "medium"},
            {"title": "Subarray Sum Equals K", "description": "Count subarrays with sum equal to k.", "difficulty": "hard"},
        ],
        "trees": [
            {"title": "Level Order Traversal", "description": "Print tree level by level.", "difficulty": "medium"},
            {"title": "Lowest Common Ancestor", "description": "Find LCA of two nodes.", "difficulty": "medium"},
            {"title": "Serialize and Deserialize BST", "description": "Convert BST to string and back.", "difficulty": "hard"},
        ],
        "strings": [
            {"title": "Longest Palindromic Substring", "description": "Find the longest palindrome in a string.", "difficulty": "medium"},
            {"title": "Word Break", "description": "Check if string can be segmented into dictionary words.", "difficulty": "hard"},
            {"title": "Minimum Window Substring", "description": "Find smallest window containing all characters of T.", "difficulty": "hard"},
        ],
        "dynamic_programming": [
            {"title": "Coin Change", "description": "Find fewest coins to make amount.", "difficulty": "medium"},
            {"title": "Longest Increasing Subsequence", "description": "Find the LIS length.", "difficulty": "medium"},
            {"title": "Edit Distance", "description": "Find min operations to convert one string to another.", "difficulty": "hard"},
        ],
        "graphs": [
            {"title": "Course Schedule", "description": "Detect cycles in a directed graph.", "difficulty": "medium"},
            {"title": "Word Ladder", "description": "Transform one word to another changing one letter at a time.", "difficulty": "hard"},
            {"title": "Number of Connected Components", "description": "Count connected components using union-find.", "difficulty": "medium"},
        ],
        "default": [
            {"title": "Binary Search", "description": "Search in a sorted array in O(log n).", "difficulty": "easy"},
            {"title": "Merge Intervals", "description": "Merge overlapping intervals.", "difficulty": "medium"},
            {"title": "Find Peak Element", "description": "Find an element greater than its neighbors.", "difficulty": "medium"},
        ],
    }

    def generate(self, topic: str, current_difficulty: str) -> List[Dict]:
        pool = self.FOLLOW_UPS.get(topic, self.FOLLOW_UPS["default"])

        # Filter by next difficulty (progressive)
        difficulty_order = ["easy", "medium", "hard"]
        current_idx = difficulty_order.index(current_difficulty) if current_difficulty in difficulty_order else 0
        next_difficulty = difficulty_order[min(current_idx + 1, 2)]

        # Return up to 3: 1 similar, 1 harder, 1 interview variant
        similar = [p for p in pool if p["difficulty"] == current_difficulty]
        harder  = [p for p in pool if p["difficulty"] == next_difficulty]

        result = []
        if similar:  result.append({**random.choice(similar), "type": "similar"})
        if harder:   result.append({**random.choice(harder),  "type": "harder"})

        # Add a timed challenge variant
        if pool:
            base = random.choice(pool)
            result.append({
                "title": f"⏱️ Timed: {base['title']}",
                "description": f"{base['description']} (Complete in under 5 minutes!)",
                "difficulty": "hard",
                "type": "timed",
            })

        return result[:3]


# Export instances
hint_engine = HintEngine()
code_analyzer = CodeQualityAnalyzer()
similar_generator = SimilarProblemGenerator()
