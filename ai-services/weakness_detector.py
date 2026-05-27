from typing import Dict, List
import numpy as np

class WeaknessDetector:
    def __init__(self):
        self.threshold_low = 60
        self.threshold_medium = 80
        
    def analyze(self, skill_scores: Dict[str, int]) -> Dict[str, any]:
        """Analyze skill scores and identify weaknesses"""
        weak_areas = []
        strong_areas = []
        recommendations = []
        
        for domain, score in skill_scores.items():
            if score < self.threshold_low:
                weak_areas.append(domain)
                recommendations.append({
                    "domain": domain,
                    "priority": "high",
                    "action": f"Focus on {domain.upper()} fundamentals. Start with easy quests."
                })
            elif score < self.threshold_medium:
                weak_areas.append(domain)
                recommendations.append({
                    "domain": domain,
                    "priority": "medium",
                    "action": f"Practice more {domain.upper()} problems to improve."
                })
            else:
                strong_areas.append(domain)
        
        # Calculate overall skill level
        avg_score = np.mean(list(skill_scores.values()))
        if avg_score < 50:
            skill_level = "beginner"
        elif avg_score < 70:
            skill_level = "intermediate"
        else:
            skill_level = "advanced"
        
        return {
            "weakAreas": weak_areas,
            "strongAreas": strong_areas,
            "overallSkillLevel": skill_level,
            "averageScore": float(avg_score),
            "recommendations": recommendations,
            "focusDomains": [r["domain"] for r in recommendations[:3]]  # Top 3 domains to focus on
        }

