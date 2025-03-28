import SendIcon from '@mui/icons-material/Send';
import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    List,
    ListItem,
    ListItemText
} from '@mui/material';

type Message = {
    user: string;
    message: string;
};

type Props = {
    messages: Message[];
    input: string;
    onChange: (value: string) => void;
    onSend: () => void;
};

export default function ChatBox({ messages, input, onChange, onSend }: Props) {
    return (
        <Paper
            sx={{ p: 2, width: '100%', height: '500px', display: 'flex', flexDirection: 'column' }}
        >
            <Typography variant="h6" gutterBottom>
                Auction Chat
            </Typography>

            <Box sx={{ flex: 1, overflowY: 'auto', mb: 1 }}>
                <List>
                    {messages.map((msg, idx) => (
                        <ListItem key={idx}>
                            <ListItemText primary={<b>{msg.user}</b>} secondary={msg.message} />
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="메시지를 입력하세요"
                    value={input}
                    onChange={e => onChange(e.target.value)}
                />
                <IconButton color="primary" onClick={onSend}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Paper>
    );
}
