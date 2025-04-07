import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Snackbar, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface LightningPaymentProps {
  invoice: string;
}

const LightningPayment: React.FC<LightningPaymentProps> = ({ invoice }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(invoice);
    setCopied(true);
  };

  const handleClose = () => {
    setCopied(false);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body1" gutterBottom>
        라이트닝 네트워크를 통한 후원:
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', maxWidth: '500px', margin: '0 auto' }}>
        <TextField
          value={invoice}
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
        <Button
          variant="outlined"
          startIcon={<ContentCopyIcon />}
          onClick={handleCopy}
          sx={{ width: '100%', py: 1 }}
        >
          주소 복사하기
        </Button>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        위 인보이스를 복사하여 라이트닝 지갑에서 결제하세요.
      </Typography>
      <Snackbar open={copied} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          인보이스가 클립보드에 복사되었습니다.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LightningPayment; 