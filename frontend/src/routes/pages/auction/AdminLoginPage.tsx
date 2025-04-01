import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import { useAdminLogin } from '@/hooks/useAdminLogin';

const AdminLoginPage = () => {
    const { code } = useParams<{ code: string }>();
    const { form, handleChange, handleSubmit } = useAdminLogin(code || '');

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom mt={4}>
                관리자 로그인
            </Typography>

            <Box
                component="form"
                display="flex"
                flexDirection="column"
                gap={2}
                mt={2}
                onSubmit={e => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <TextField
                    label="관리자 비밀번호"
                    name="adminPassword"
                    type="password"
                    value={form.adminPassword}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <Button type="submit" variant="contained" color="primary">
                    로그인
                </Button>
            </Box>
        </Container>
    );
};

export default AdminLoginPage;
