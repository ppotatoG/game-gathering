import * as XLSX from 'xlsx';

import { parseUserString } from '@/utils/parseUserString';

export const parseAuctionExcel = async (file: File): Promise<AuctionUserInput[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = e => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const raw = XLSX.utils.sheet_to_json<{ users: string }>(sheet);

            const parsed = raw.map(entry => parseUserString(entry.users));
            resolve(parsed);
        };

        reader.onerror = err => reject(err);
        reader.readAsArrayBuffer(file);
    });
};
