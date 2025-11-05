export const REDIS_BIDS_KEY = (code: string) => `auction:${code}:bids`;
export const REDIS_STATE_KEY = (code: string) => `auction:${code}:state`;
export const REDIS_USERS_KEY = (code: string) => `auction:${code}:users`;
