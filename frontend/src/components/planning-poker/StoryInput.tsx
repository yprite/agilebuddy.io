import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Paper, 
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  IconButton,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, CloudDownload as CloudDownloadIcon } from '@mui/icons-material';

interface StoryInputProps {
  story: string;
  onStoryChange: (story: string) => void;
  disabled?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`story-input-tabpanel-${index}`}
      aria-labelledby={`story-input-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const StoryInput: React.FC<StoryInputProps> = ({ story, onStoryChange, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clickupUrl, setClickupUrl] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullStory = `제목: ${title}\n\n${description}`;
    onStoryChange(fullStory);
    setTitle('');
    setDescription('');
    setOpen(false);
  };

  const handleClickupImport = async () => {
    try {
      // TODO: Clickup API 연동
      // 임시로 URL에서 제목과 설명을 추출하는 로직
      const taskId = clickupUrl.split('/').pop();
      // 실제로는 Clickup API를 호출하여 데이터를 가져와야 함
      const mockData = `제목: Clickup Task ${taskId}\n\n이 태스크는 Clickup에서 가져왔습니다: ${clickupUrl}`;
      onStoryChange(mockData);
      setClickupUrl('');
      setOpen(false);
    } catch (error) {
      console.error('Clickup import failed:', error);
      // TODO: 에러 처리 추가
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Tooltip title="직접 입력">
          <IconButton 
            onClick={() => {
              setTabValue(0);
              setOpen(true);
            }}
            color="primary"
            disabled={disabled}
            sx={{ 
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': { 
                backgroundColor: 'primary.dark'
              } 
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Clickup에서 가져오기">
          <IconButton 
            onClick={() => {
              setTabValue(1);
              setOpen(true);
            }}
            color="primary"
            disabled={disabled}
            sx={{ 
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': { 
                backgroundColor: 'primary.dark'
              } 
            }}
          >
            <CloudDownloadIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            새로운 스토리 입력
          </Typography>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}
          >
            <Tab label="직접 입력" />
            <Tab label="Clickup에서 가져오기" />
          </Tabs>
        </DialogTitle>

        <TabPanel value={tabValue} index={0}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="스토리 제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="스토리 설명"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                multiline
                rows={4}
                fullWidth
              />
            </Box>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>취소</Button>
              <Button 
                type="submit" 
                variant="contained"
                disabled={!title || !description}
              >
                저장
              </Button>
            </DialogActions>
          </form>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Clickup 태스크 URL을 입력해주세요
            </Typography>
            <TextField
              label="Clickup URL"
              value={clickupUrl}
              onChange={(e) => setClickupUrl(e.target.value)}
              required
              fullWidth
              placeholder="https://app.clickup.com/t/..."
            />
            <DialogActions>
              <Button onClick={() => setOpen(false)}>취소</Button>
              <Button 
                variant="contained"
                onClick={handleClickupImport}
                disabled={!clickupUrl}
              >
                가져오기
              </Button>
            </DialogActions>
          </Box>
        </TabPanel>
      </Dialog>

      {story && (
        <Paper 
          elevation={2}
          sx={{ 
            p: 3,
            borderRadius: 2,
            background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
            whiteSpace: 'pre-wrap'
          }}
        >
          <Typography 
            variant="body1"
            sx={{ 
              color: 'text.primary',
              lineHeight: 1.6
            }}
          >
            {story}
          </Typography>
        </Paper>
      )}
    </>
  );
};

export default StoryInput; 