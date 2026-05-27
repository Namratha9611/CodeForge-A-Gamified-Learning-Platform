/**
 * Dynamic XP Calculation Service
 * XP is NOT fixed — it adapts based on difficulty, speed, streak, and attempt quality.
 */

const BASE_XP = { easy: 10, medium: 25, hard: 50 }

/**
 * Calculate final XP earned for a submission.
 * @param {object} params
 * @param {string} params.difficulty - 'easy' | 'medium' | 'hard'
 * @param {number} params.timeTakenSeconds - how long the student spent
 * @param {number} params.streak - current student streak
 * @param {number} params.attempts - number of attempts on this quest
 * @param {boolean} params.usedHints - whether the student used hints
 * @param {number} params.hintsUsed - number of hints used
 * @param {boolean} params.isFirstAttemptSolve - solved on very first try
 * @returns {object} breakdown of XP earned
 */
export function calculateXP({
  difficulty = 'easy',
  timeTakenSeconds = 0,
  streak = 0,
  attempts = 1,
  hintsUsed = 0,
  isFirstAttemptSolve = false,
}) {
  const base = BASE_XP[difficulty] ?? 10

  // ── Speed Bonus ────────────────────────────────────────────────────────────
  // Full speed bonus if solved in under 2 min, partial if under 5 min
  let speedBonus = 0
  if (timeTakenSeconds > 0) {
    if (timeTakenSeconds < 120) speedBonus = Math.round(base * 0.5)   // +50%
    else if (timeTakenSeconds < 300) speedBonus = Math.round(base * 0.2) // +20%
  }

  // ── Streak Bonus ───────────────────────────────────────────────────────────
  let streakBonus = 0
  if (streak >= 10) streakBonus = Math.round(base * 0.5)
  else if (streak >= 5) streakBonus = Math.round(base * 0.3)
  else if (streak >= 3) streakBonus = Math.round(base * 0.15)

  // ── First Attempt Bonus ────────────────────────────────────────────────────
  const firstAttemptBonus = isFirstAttemptSolve ? Math.round(base * 0.5) : 0

  // ── Hint Penalty ───────────────────────────────────────────────────────────
  // Each hint used costs 2 XP (defined on the hint itself too)
  const hintPenalty = hintsUsed * 2

  // ── Multiple Attempt Penalty ───────────────────────────────────────────────
  const attemptPenalty = Math.max(0, (attempts - 1) * 3) // -3 XP per extra attempt

  const total = Math.max(1, base + speedBonus + streakBonus + firstAttemptBonus - hintPenalty - attemptPenalty)

  return {
    base,
    speedBonus,
    streakBonus,
    firstAttemptBonus,
    hintPenalty: -hintPenalty,
    attemptPenalty: -attemptPenalty,
    total,
    breakdown: [
      { label: 'Base XP', value: `+${base}` },
      speedBonus > 0         ? { label: '⚡ Speed Bonus', value: `+${speedBonus}` } : null,
      streakBonus > 0        ? { label: '🔥 Streak Bonus', value: `+${streakBonus}` } : null,
      firstAttemptBonus > 0  ? { label: '⭐ First Attempt', value: `+${firstAttemptBonus}` } : null,
      hintPenalty > 0        ? { label: '💡 Hints Used', value: `-${hintPenalty}` } : null,
      attemptPenalty > 0     ? { label: '🔄 Extra Attempts', value: `-${attemptPenalty}` } : null,
    ].filter(Boolean),
  }
}
