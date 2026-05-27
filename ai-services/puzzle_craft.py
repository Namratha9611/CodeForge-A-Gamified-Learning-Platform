
import random
import uuid

class AdaptiveEngine:
    def get_difficulty(self, profile):
        """
        Determines the appropriate difficulty level based on user profile.
        """
        # Simple logic: start with 'medium' if unknown, else use user's level or similar
        level = profile.get("level", 1)
        if level < 5:
            return "easy"
        elif level < 15:
            return "medium"
        else:
            return "hard"

    def update_profile(self, profile, result, time_taken_ms):
        """
        Updates the user profile based on puzzle performance.
        """
        # Mock implementation: increment XP if success
        if result.get("success"):
            xp = profile.get("xp", 0) + 10
            profile["xp"] = xp
        return profile

class PuzzleValidator:
    def validate(self, puzzle_type, user_answer, correct_answer):
        """
        Validates the user's answer against the correct answer.
        """
        is_correct = str(user_answer).strip().lower() == str(correct_answer).strip().lower()
        return {
            "success": is_correct,
            "score": 100 if is_correct else 0,
            "feedback": "Correct!" if is_correct else "Incorrect, try again."
        }

class PuzzleGenerator:
    def generate(self, difficulty, thinking_style, exclude_ids):
        """
        Generates a new puzzle based on parameters.
        """
        # Mock puzzle generation
        puzzle_id = str(uuid.uuid4())
        
        # Simple logic puzzles for now
        puzzles = [
            {
                "type": "logic",
                "question": "What comes next in the sequence: 2, 4, 8, 16, ...?",
                "answer": "32",
                "options": ["24", "30", "32", "36"],
                "hint": "Powers of 2"
            },
            {
                "type": "code",
                "question": "What is the output of print(2 ** 3) in Python?",
                "answer": "8",
                "options": ["6", "8", "9", "12"],
                "hint": "Exponentiation"
            },
            {
                "type": "cipher",
                "question": "Decrypt this Caesar cipher (shift 1): CBU",
                "answer": "BAT",
                "options": ["CAT", "BAT", "MAT", "HAT"],
                "hint": "Shift each letter back by 1"
            }
        ]
        
        selected_puzzle = random.choice(puzzles)
        
        return {
            "id": puzzle_id,
            "difficulty": difficulty,
            "thinkingStyle": thinking_style,
            "content": selected_puzzle
        }
