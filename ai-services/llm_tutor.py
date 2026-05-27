from typing import Optional

class LLMTutor:
    def __init__(self):
        # In a real implementation, you would load a local LLM model here
        # For now, we'll use rule-based explanations
        self.explanations = {
            "python": {
                "syntax_error": "Check for missing colons, parentheses, or indentation errors.",
                "name_error": "You're using a variable or function that hasn't been defined.",
                "type_error": "You're trying to perform an operation on incompatible types.",
                "index_error": "You're trying to access an index that doesn't exist in the list/array.",
            },
            "java": {
                "compilation_error": "Check for missing semicolons, braces, or incorrect method signatures.",
                "null_pointer": "You're trying to access a method or property on a null object.",
                "array_index": "Array index is out of bounds.",
            },
            "cpp": {
                "compilation_error": "Check syntax, missing headers, or type mismatches.",
                "segmentation_fault": "You're accessing memory that doesn't belong to your program.",
            },
            "javascript": {
                "syntax_error": "Check for missing brackets, parentheses, or semicolons.",
                "reference_error": "Variable is not defined.",
                "type_error": "Cannot read property of undefined or null.",
            }
        }
    
    def explain(self, query: str, context: Optional[str] = None) -> str:
        """Provide explanation for a concept or question"""
        # Simple rule-based explanation system
        # In production, this would use a local LLM like TinyLlama
        
        query_lower = query.lower()
        
        if "time complexity" in query_lower or "big o" in query_lower:
            return "Time complexity describes how the runtime of an algorithm grows with input size. O(1) is constant, O(n) is linear, O(log n) is logarithmic, O(n²) is quadratic."
        
        if "space complexity" in query_lower:
            return "Space complexity measures how much memory an algorithm uses relative to input size. It's similar to time complexity but focuses on memory usage."
        
        if "binary search" in query_lower:
            return "Binary search works by repeatedly dividing the search space in half. It requires a sorted array and has O(log n) time complexity."
        
        if "hash" in query_lower or "hashmap" in query_lower:
            return "A hash map stores key-value pairs. It provides O(1) average time for insert, delete, and lookup operations using a hash function."
        
        if "recursion" in query_lower:
            return "Recursion is when a function calls itself. It needs a base case to stop and a recursive case that moves toward the base case."
        
        if "sql" in query_lower or "database" in query_lower:
            return "SQL (Structured Query Language) is used to manage relational databases. Common operations include SELECT (read), INSERT (create), UPDATE (modify), and DELETE (remove)."
        
        if "react" in query_lower:
            return "React is a JavaScript library for building user interfaces. It uses components, state, and props to create interactive UIs."
        
        # Default explanation
        return f"Here's an explanation: {query}. This is a fundamental concept that you can master with practice. Try working through examples step by step."
    
    def explain_error(self, code: str, language: str, error: str) -> str:
        """Explain a code error"""
        error_lower = error.lower()
        
        # Check for common error patterns
        for error_type, explanation in self.explanations.get(language, {}).items():
            if error_type.replace("_", " ") in error_lower:
                return explanation
        
        # Generic error explanation
        return f"Your code has an error: {error[:100]}. Review your code logic and check for common mistakes like typos, missing brackets, or incorrect variable names."
    
    def provide_hint(self, quest_domain: str, difficulty: str) -> str:
        """Provide a hint for a quest"""
        hints = {
            "dsa": {
                "easy": "Think about the basic data structures: arrays, lists, and simple loops.",
                "medium": "Consider using hash maps or two-pointer techniques.",
                "hard": "Try dynamic programming or advanced tree/graph algorithms."
            },
            "dbms": {
                "easy": "Start with basic SELECT queries and WHERE clauses.",
                "medium": "Use JOINs to combine data from multiple tables.",
                "hard": "Consider subqueries, window functions, or optimization techniques."
            },
            "os": {
                "easy": "Think about basic process scheduling concepts.",
                "medium": "Consider memory management and synchronization.",
                "hard": "Explore advanced topics like virtual memory or distributed systems."
            }
        }
        
        return hints.get(quest_domain, {}).get(difficulty, "Break the problem into smaller steps and solve them one by one.")

