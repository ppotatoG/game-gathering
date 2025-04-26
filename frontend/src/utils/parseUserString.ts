/**
 *  {index}.{공백}{nickname}#{tag}{공백}{tier}
 */
import { getTierWeight } from './tier';

export const parseUserString = (raw: string): AuctionUserInput => {
    const dotIndex = raw.indexOf('.');

    if (dotIndex === -1) {
        throw new Error('Invalid format: missing "."');
    }

    const afterDot = raw.slice(dotIndex + 1).trim();
    const [nicknamePart, tagTierPart] = afterDot.split('#');

    if (!tagTierPart) {
        throw new Error('Invalid format: missing "#" and tag/tier');
    }

    const nickname = nicknamePart.trim();
    const [tag, tier] = tagTierPart.trim().split(' ');

    if (!tier) {
        throw new Error('Invalid format: missing tier');
    }

    const weight = getTierWeight(tier);

    if (weight === -1) {
        throw new Error(`Invalid tier format: ${tier}`);
    }

    return {
        nickname,
        tag,
        weight
    };
};
