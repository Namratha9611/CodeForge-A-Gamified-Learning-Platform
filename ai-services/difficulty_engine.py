from typing import Dict, List
import numpy as np

class DifficultyEngine:
    def __init__(self):
        self.difficulty_map = {
            "easy": {"min_score": 0, "max_score": 60},
            "medium": {"min_score": 50, "max_score": 80},
            "hard": {"min_score": 70, "max_score": 100}
        }
    
    def recommend(self, skill_scores: Dict[str, int], weak_areas: List[str], persona: str = "Novice") -> Dict[str, any]:
        """Recommend quest difficulty and domains based on knowledge level"""
        # Calculate average skill score
        avg_score = np.mean(list(skill_scores.values())) if skill_scores else 0
        
        # Determine suggested difficulty based on persona and score (user request: <40 Easy, 40-70 Medium, >70 Hard)
        if persona == "Novice" or avg_score < 40:
            suggested_difficulty = "easy"
        elif persona == "Intermediate" or avg_score <= 70:
            suggested_difficulty = "medium"
        else:
            suggested_difficulty = "hard"
        
        # Prioritize weak areas
        focus_domains = weak_areas if weak_areas else list(skill_scores.keys())
        
        # If no weak areas, suggest domains with medium scores
        if not weak_areas and skill_scores:
            focus_domains = [
                domain for domain, score in skill_scores.items()
                if 50 <= score < 80
            ]
            if not focus_domains:
                focus_domains = list(skill_scores.keys())
        
        if not focus_domains:
            focus_domains = ["dsa", "web"]
            
        return {
            "suggested_difficulty": suggested_difficulty,
            "focus_domains": focus_domains[:3],  # Top 3 domains
            "quest_ids": [],  # Will be populated by backend
            "reason": f"As a {persona} with an average score of {avg_score:.1f}, we recommend {suggested_difficulty} difficulty quests focusing on {', '.join(focus_domains[:3])}."
        }
    
    def adjust_difficulty(self, performance_history: List[Dict]) -> str:
        """Adjust difficulty based on performance history"""
        if not performance_history:
            return "easy"
        
        recent_performance = performance_history[-5:]  # Last 5 attempts
        success_rate = sum(1 for p in recent_performance if p.get("success", False)) / len(recent_performance)
        
        if success_rate >= 0.8:
            return "hard"  # Increase difficulty
        elif success_rate >= 0.5:
            return "medium"  # Maintain
        else:
            return "easy"  # Decrease difficulty

