from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import json
from sklearn.ensemble import RandomForestClassifier
import numpy as np
from code_evaluator import CodeEvaluator
from weakness_detector import WeaknessDetector
from difficulty_engine import DifficultyEngine
from llm_tutor import LLMTutor
from quest_generator import QuestGenerator
from challenge_generator import AdaptiveChallengeGenerator
from adaptive_engine import hint_engine, code_analyzer, similar_generator

app = FastAPI(title="AI Learning Platform Services")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI components
code_evaluator = CodeEvaluator()
weakness_detector = WeaknessDetector()
difficulty_engine = DifficultyEngine()
llm_tutor = LLMTutor()
quest_generator = QuestGenerator()
challenge_gen = AdaptiveChallengeGenerator()

# ─── Pydantic Models ──────────────────────────────────────────────────────────

class CodeEvaluationRequest(BaseModel):
    code: str
    language: str
    testCases: List[Dict[str, Any]]
    questId: Optional[str] = None

class WeaknessAnalysisRequest(BaseModel):
    skillScores: Dict[str, int]

class RecommendationRequest(BaseModel):
    userId: str
    skillScores: Dict[str, int]
    weakAreas: List[str]
    persona: str = "Novice"

class QuestGenerationRequest(BaseModel):
    domain: str = "dsa"
    difficulty: str = "medium"

class ChallengeRequest(BaseModel):
    average_time: int = 300
    accuracy: float = 0.7
    level: int = 1
    topic: str = "arrays"

class AdaptiveGenerateRequest(BaseModel):
    persona: str = "Novice"
    difficulty: str = "easy"
    domain: str = "dsa"
    weakTopics: List[str] = []
    strongTopics: List[str] = []
    skillScores: Dict[str, int] = {}

class HintRequest(BaseModel):
    topic: str = "dsa"
    hintIndex: int = 0
    problemStatement: Optional[str] = None

class GenerateSpecificRequest(BaseModel):
    title: str
    domain: str = "dsa"
    difficulty: str = "medium"

class AnalysisRequest(BaseModel):
    code: str
    language: str = "python"
    passed: bool = False
    timeTakenMs: int = 0

class SimilarRequest(BaseModel):
    topic: str = "arrays"
    difficulty: str = "easy"

# ─── Core Endpoints ───────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {"message": "AI Learning Platform Services", "status": "running"}

@app.post("/api/evaluate-code")
async def evaluate_code(request: CodeEvaluationRequest):
    try:
        result = code_evaluator.evaluate(
            code=request.code,
            language=request.language,
            test_cases=request.testCases
        )
        if not result["success"] and result.get("error"):
            result["explanation"] = llm_tutor.explain_error(
                code=request.code, language=request.language, error=result["error"]
            )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-weakness")
async def analyze_weakness(request: WeaknessAnalysisRequest):
    try:
        return weakness_detector.analyze(request.skillScores)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recommend")
async def recommend_quests(request: RecommendationRequest):
    try:
        recommendations = difficulty_engine.recommend(
            skill_scores=request.skillScores,
            weak_areas=request.weakAreas,
            persona=request.persona
        )
        return {
            "recommendedQuests": recommendations.get("quest_ids", []),
            "difficulty": recommendations.get("suggested_difficulty", "easy"),
            "focusDomains": recommendations.get("focus_domains", ["dsa"]),
            "reason": recommendations.get("reason", "")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/explain")
async def explain_code(request: Dict[str, Any]):
    try:
        explanation = llm_tutor.explain(
            query=request.get("query", ""),
            context=request.get("context", "")
        )
        return {"explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-quest")
async def generate_quest(request: QuestGenerationRequest):
    try:
        return quest_generator.generate(request.domain, request.difficulty)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-challenge")
async def generate_challenge(request: ChallengeRequest):
    try:
        profile = {
            "average_time": request.average_time,
            "accuracy": request.accuracy,
            "level": request.level,
            "topic": request.topic
        }
        return challenge_gen.generate(profile)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── Puzzle Endpoints ─────────────────────────────────────────────────────────

from puzzle_craft import PuzzleGenerator, PuzzleValidator, AdaptiveEngine

puzzle_gen = PuzzleGenerator()
puzzle_validator = PuzzleValidator()
adaptive_engine_puzzle = AdaptiveEngine()

class PuzzleGenerateRequest(BaseModel):
    profile: Dict[str, Any]
    excludeIds: List[str] = []

class PuzzleValidateRequest(BaseModel):
    puzzleType: str
    userAnswer: str
    correctAnswer: str
    profile: Dict[str, Any]
    timeTakenMs: int

@app.post("/api/puzzle/generate")
async def generate_puzzle(request: PuzzleGenerateRequest):
    try:
        diff = adaptive_engine_puzzle.get_difficulty(request.profile)
        puzzle = puzzle_gen.generate(diff, request.profile.get("thinkingStyle"), request.excludeIds)
        return puzzle
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/puzzle/validate")
async def validate_puzzle(request: PuzzleValidateRequest):
    try:
        result = puzzle_validator.validate(request.puzzleType, request.userAnswer, request.correctAnswer)
        updated_profile = adaptive_engine_puzzle.update_profile(request.profile, result, request.timeTakenMs)
        return {"result": result, "updatedProfile": updated_profile}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── Adaptive / Personalization Endpoints ────────────────────────────────────

@app.post("/api/adaptive/generate")
async def adaptive_generate(request: AdaptiveGenerateRequest):
    """Generates a personalized coding problem tailored to the student's level."""
    try:
        target_topic = request.weakTopics[0] if request.weakTopics else request.domain
        quest = quest_generator.generate(domain=target_topic, difficulty=request.difficulty)
        persona_hints = {
            "Novice":       "Focus on understanding the problem before coding.",
            "Intermediate": "Think about time complexity before you start.",
            "Advanced":     "Aim for an optimal solution with edge-case handling.",
            "Master":       "Challenge yourself with the most efficient approach possible.",
        }
        quest["personaHint"] = persona_hints.get(request.persona, "")
        quest["generatedForPersona"] = request.persona
        quest["targetTopic"] = target_topic
        return quest
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/adaptive/generate-specific")
async def generate_specific(request: GenerateSpecificRequest):
    """Generates a specific requested problem based on title."""
    try:
        # Since we don't have an LLM connected, we map common specific follow-ups
        # or fall back to a clean specific description.
        quest = quest_generator.generate(domain=request.domain, difficulty=request.difficulty)
        quest["title"] = request.title
        quest["problemStatement"] = f"<h3>{request.title}</h3><p>This is an AI-generated follow-up challenge specifically created based on your recent performance.</p><p>Please implement an optimal solution for <strong>{request.title}</strong> using the concepts you've just learned.</p>"
        
        # Override examples to be generic placeholders for the UI if it's a mock
        quest["examples"] = [
            {"input": "[1, 2, 3, 4]", "output": "...", "explanation": "Expected optimal output."}
        ]
        
        return quest
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/hint")
async def get_hint(request: HintRequest):
    """Return a progressive hint for the given topic and problem."""
    try:
        return hint_engine.get_hint(request.topic, request.hintIndex, request.problemStatement)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-code")
async def analyze_code(request: AnalysisRequest):
    """Analyze code quality and return smart feedback."""
    try:
        return code_analyzer.analyze(
            code=request.code,
            language=request.language,
            passed=request.passed,
            time_ms=request.timeTakenMs,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/similar-questions")
async def get_similar_questions(request: SimilarRequest):
    """Generate similar follow-up problems after solving a quest."""
    try:
        questions = similar_generator.generate(request.topic, request.difficulty)
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
