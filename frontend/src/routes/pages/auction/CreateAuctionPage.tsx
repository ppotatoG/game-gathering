import { Box, Button, Container, MenuItem, TextField, Typography } from '@mui/material';

import { useCreateAuction } from '@/hooks/useCreateAuction';

const CreateAuctionPage = () => {
    const { form, handleChange, handleSubmit } = useCreateAuction();

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom mt={4}>
                경매 생성
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                display="flex"
                flexDirection="column"
                gap={2}
                mt={2}
            >
                <TextField
                    label="소모임 이름"
                    name="clubName"
                    value={form.clubName}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="경매 관리자 이름"
                    name="hostName"
                    value={form.hostName}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="경매 타이틀"
                    name="auctionTitle"
                    value={form.auctionTitle}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="내전 인원 (5의 배수)"
                    name="memberCount"
                    select
                    value={form.memberCount}
                    onChange={handleChange}
                    fullWidth
                >
                    {[5, 10, 15, 20, 25, 30].map(num => (
                        <MenuItem key={num} value={num}>
                            {num}명
                        </MenuItem>
                    ))}
                </TextField>

                <Button type="submit" variant="contained" color="primary">
                    생성하기
                </Button>
            </Box>
        </Container>
    );
};

export default CreateAuctionPage;
