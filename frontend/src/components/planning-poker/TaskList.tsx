import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  Button
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { ClickupTask } from '../../types/clickup';
import { clickupService } from '../../services/clickup';

interface TaskListProps {
  onTaskSelect: (task: ClickupTask) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onTaskSelect }) => {
  const [tasks, setTasks] = useState<ClickupTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [folderId, setFolderId] = useState<string>('');

  const fetchSprintTasks = async () => {
    if (!folderId.trim()) {
      setError('Sprint 폴더 ID를 입력해주세요');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching tasks for folder:', folderId);
      const response = await clickupService.getSprintTasks(folderId);
      console.log('Response:', response);
      if (!response || !response.tasks) {
        throw new Error('Task 목록을 가져오는데 실패했습니다.');
      }
      setTasks(response.tasks);
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'Task 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
        Sprint Task 목록
      </Typography>
      
      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <TextField
          label="Sprint 폴더 ID"
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
          error={!!error}
          helperText={error}
          size="small"
          fullWidth
        />
        <Button
          variant="contained"
          onClick={fetchSprintTasks}
          disabled={loading}
          sx={{ minWidth: '100px' }}
        >
          가져오기
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box p={3}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : (
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              sx={{
                mb: 1,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              <ListItemText
                primary={task.name}
                secondary={
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip
                      label={task.status.status}
                      size="small"
                      sx={{ backgroundColor: task.status.color + '20', color: task.status.color }}
                    />
                    {task.priority.priority && (
                      <Chip
                        label={task.priority.priority}
                        size="small"
                        sx={{ backgroundColor: task.priority.color + '20', color: task.priority.color }}
                      />
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => onTaskSelect(task)}
                  color="primary"
                >
                  <Visibility />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default TaskList; 