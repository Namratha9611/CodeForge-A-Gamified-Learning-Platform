export function calculateDifficulty(userXP) {
    // Scale difficulty 1-5 based on XP
    if (userXP > 1000) return 5;
    if (userXP > 500) return 4;
    if (userXP > 250) return 3;
    if (userXP > 100) return 2;
    return 1;
}

export function getXPReward(difficulty) {
    return difficulty * 20;
}
