import { AuctionUserData } from '@/models/AuctionUser';

export function getRemainingUsers(allUsers: AuctionUserData[], selected: AuctionUserData[]) {
    const selectedKeys = new Set(selected.map(u => `${u.nickname}#${u.tag}`));

    return allUsers.filter(u => !u.isCaptain && !selectedKeys.has(`${u.nickname}#${u.tag}`));
}
