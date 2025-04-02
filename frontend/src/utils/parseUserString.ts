/**
 * '00 견금여석#KR1' 또는 '겨울#KR1' 형태를 nickname, tag로 변환
 * nickname 앞에 나이 추정값(예: '00', '03')이 있는 경우 제거
 */
export const parseUserString = (raw: string): AuctionUserInput => {
    const [nicknameRaw, tagRaw] = raw.split('#');
    const tag = tagRaw?.trim();

    const nameParts = nicknameRaw.trim().split(' ');

    const maybeBirth = nameParts[0];
    const nickname = /^[0-9]{2}$/.test(maybeBirth)
        ? nameParts.slice(1).join(' ').trim()
        : nameParts.join(' ').trim();

    return { nickname, tag };
};
