import { Box, Button, Typography, Stack, Paper, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuctionUsers } from '@/hooks/useAuctionUsers';
import { useAdminStore } from '@/store/useAdmin';

const AdminPage = () => {
    const { code } = useParams<{ code: string }>();
    const [rawText, setRawText] = useState('');
    const [selectedCaptains, setSelectedCaptains] = useState<Set<string>>(new Set());

    const { users, importUsersFromText, deleteUsers, saveCaptains } = useAuctionUsers(code || '');
    const { auctionInfo } = useAdminStore();

    const handleTextSubmit = () => {
        importUsersFromText(rawText);
    };

    const handleCaptainToggle = (nickname: string) => {
        setSelectedCaptains(prev => {
            const next = new Set(prev);
            next.has(nickname) ? next.delete(nickname) : next.add(nickname);
            return next;
        });
    };

    const handleSaveCaptains = () => {
        saveCaptains(Array.from(selectedCaptains));
    };

    const columns: GridColDef[] = [
        { field: 'nickname', headerName: '닉네임', width: 150 },
        { field: 'tag', headerName: '태그', width: 150 },
        {
            field: 'isCaptain',
            headerName: '팀장 지정',
            width: 120,
            renderCell: params => {
                const nickname = params.row.nickname;
                const selected = selectedCaptains.has(nickname);
                const disabled =
                    !selected && selectedCaptains.size >= (auctionInfo?.captainCount || 0);

                return (
                    <Button
                        size="small"
                        variant={selected ? 'contained' : 'outlined'}
                        onClick={() => handleCaptainToggle(nickname)}
                        disabled={disabled}
                    >
                        👑
                    </Button>
                );
            }
        }
    ];

    const rows = users.map((user, index) => ({
        id: index + 1,
        nickname: user.nickname,
        tag: user.tag
    }));

    return (
        <Box p={4}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">경매 관리자 페이지</Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleTextSubmit}
                        disabled={!rawText}
                    >
                        유저 등록
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={deleteUsers}
                        disabled={users.length === 0}
                    >
                        유저 초기화
                    </Button>
                    <Button variant="contained" color="success" onClick={handleSaveCaptains}>
                        팀장 저장
                    </Button>
                </Stack>
            </Stack>

            <Stack spacing={2} mb={2}>
                <TextField
                    label="유저 텍스트 입력 (순서. 닉네임#태그)"
                    multiline
                    fullWidth
                    rows={10}
                    value={rawText}
                    onChange={e => setRawText(e.target.value)}
                />
            </Stack>

            <Paper elevation={2} sx={{ p: 2, height: 400 }}>
                <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick />
            </Paper>
        </Box>
    );
};

export default AdminPage;
