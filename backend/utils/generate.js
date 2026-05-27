import { bugTemplates } from './templates.js';
import { calculateDifficulty, getXPReward } from './difficultyEngine.js';

export function generateChallenge(zoneId, order, userXP) {
    // 1. Determine Difficulty
    const difficultyKey = calculateDifficulty(userXP);

    // 2. Filter Templates suitable for difficulty (simple check)
    // For now we pick random, but in future filter by template.difficulty <= difficultyKey
    const template = bugTemplates[Math.floor(Math.random() * bugTemplates.length)];

    // 3. Generate Content
    const content = template.generate();

    // 4. Construct Object
    return {
        zoneId: zoneId,
        title: `Infinite: ${content.title}`,
        description: content.description,
        brokenCode: content.brokenCode,
        correctCode: content.correctCode,
        hints: content.hints || [],
        canUseHint: true,
        xpReward: getXPReward(difficultyKey),
        order: order,
        boss: false, // Infinite challenges aren't bosses usually
        generatedAutomatically: true,
        difficultyLevel: difficultyKey
    };
}
