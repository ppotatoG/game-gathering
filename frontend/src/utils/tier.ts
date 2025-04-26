const tierOrder = ['C', 'GM', 'M', 'D', 'E', 'P', 'G', 'S', 'B'];

export const getTierWeight = (tier?: string): number => {
    if (!tier) return -1;

    const divisionChar = tier.slice(-1);
    const grade = tier.slice(0, -1);

    if (!/^\d$/.test(divisionChar)) return -1;
    if (!tierOrder.includes(grade)) return -1;

    const division = parseInt(divisionChar, 10);
    const gradeIndex = tierOrder.indexOf(grade);

    return gradeIndex * 10 + division;
};

export const getTierFromWeight = (weight: number): string => {
    if (weight < 0) return '';

    const gradeIndex = Math.floor(weight / 10);
    const division = weight % 10;

    if (gradeIndex < 0 || gradeIndex >= tierOrder.length) return '';

    const grade = tierOrder[gradeIndex];

    return `${grade}${division}`;
};
