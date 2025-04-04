import { Box, Button, Typography, Stack, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';

import { useAuctionUsers } from '@/hooks/useAuctionUsers';

const AdminPage = () => {
    const { code } = useParams<{ code: string }>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { importUsersFromExcel, updateUserWithRiotData, users, deleteUsers } = useAuctionUsers(
        code || ''
    );

    const handleExcelUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            importUsersFromExcel(file);
        }
    };

    const columns: GridColDef[] = [
        { field: 'nickname', headerName: '닉네임', width: 150 },
        { field: 'tag', headerName: '태그', width: 150 }
    ];

    const rows = users.map((user, index) => ({
        id: index + 1,
        nickname: user.nickname,
        tag: user.tag
    }));

    return (
        <Box p={4}>
            <Typography variant="h5" gutterBottom>
                경매 관리자 페이지
            </Typography>

            <Stack direction="row" spacing={2} mb={2}>
                <Button variant="outlined" onClick={handleExcelUpload}>
                    엑셀 업로드
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={updateUserWithRiotData}
                    disabled={true}
                >
                    라이엇 정보 갱신
                </Button>
                <Button variant="contained" color="error" onClick={deleteUsers}>
                    유저 초기화
                </Button>
            </Stack>

            <Paper elevation={2} sx={{ p: 2, height: 400 }}>
                <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick />
            </Paper>

            <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </Box>
    );
};

export default AdminPage;
