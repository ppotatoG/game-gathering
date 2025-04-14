import StarRateIcon from '@mui/icons-material/StarRate';
import { Box } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Props {
    users: AuctionUserData[];
    currentTarget: AuctionUserData | null;
}

const tierOrder = ['C', 'GM', 'M', 'D', 'E', 'P', 'G', 'S', 'B', 'I'];

export const getTierWeight = (tier?: string): number => {
    if (!tier) {
        // console.warn('[getTierWeight] 티어 없음 → null 반환');
        return -1;
    }

    const divisionChar = tier.slice(-1);
    const grade = tier.slice(0, -1);

    if (!/^\d$/.test(divisionChar)) {
        // console.warn(`[getTierWeight] 잘못된 division: ${divisionChar} (tier: ${tier})`);
        return -1;
    }

    if (!tierOrder.includes(grade)) {
        // console.warn(`[getTierWeight] 알 수 없는 grade: ${grade} (tier: ${tier})`);
        return -1;
    }

    const division = parseInt(divisionChar, 10);
    const gradeIndex = tierOrder.indexOf(grade);

    return gradeIndex * 10 + division;
};

export default function AuctionUserTable({ users, currentTarget }: Props) {
    const columns: GridColDef[] = [
        {
            field: 'nickname',
            headerName: '닉네임',
            width: 200,
            renderCell: params => (
                <Box display="flex" alignItems="center" gap={1}>
                    {params.value}
                    {params.row.isCaptain && <StarRateIcon fontSize="small" color="warning" />}
                </Box>
            )
        },
        {
            field: 'tier',
            headerName: '티어',
            width: 100
        }
    ];

    const rows = users
        .filter(u => !u.isCaptain)
        .sort((a, b) => {
            const tierA = getTierWeight(a.tier || '');
            const tierB = getTierWeight(b.tier || '');
            if (tierA === tierB) {
                return a.nickname.localeCompare(b.nickname);
            }
            return tierA - tierB;
        })
        .map((user, idx) => ({
            id: idx,
            nickname: `${user.nickname}#${user.tag}`,
            isCaptain: user.isCaptain,
            isTarget: currentTarget?.nickname === user.nickname && currentTarget?.tag === user.tag,
            tier: user.mostChampion || '-'
        }));

    return (
        <Grid2 size="grow">
            <DataGrid
                rows={rows}
                columns={columns}
                disableRowSelectionOnClick
                disableColumnMenu
                hideFooter
                getRowClassName={params => (params.row.isTarget ? 'highlight-row' : '')}
            />
        </Grid2>
    );
}
