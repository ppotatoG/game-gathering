import {Snackbar, Alert} from "@mui/material";

import {useToastStore} from "@/store/toast";
export default function Toast() {
  const toasts = useToastStore(state => state.toasts);
  const removeToast = useToastStore(state => state.removeToast);

  console.log('toast', toasts);
  return (
    <>
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open
          autoHideDuration={3000}
          onClose={() => removeToast(toast.id)}
        >
          <Alert
            severity={toast.type}
            onClose={() => removeToast(toast.id)}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}
