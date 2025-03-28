import { Backdrop, CircularProgress } from '@mui/material';

import { useLoadingStore } from '@/store/useLoadingStore';

const LoadingOverlay = () => {
    const { loadingCount } = useLoadingStore();

    return (
        <Backdrop open={loadingCount > 0} sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default LoadingOverlay;
