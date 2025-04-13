import { AuctionUserData } from '@/models/AuctionUser';

export function getRandomUser(users: AuctionUserData[]): AuctionUserData {
    const idx = Math.floor(Math.random() * users.length);
    return users[idx];
}
