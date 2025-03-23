import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  ToggleButtonGroup, 
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert
} from '@mui/material';
import StoryInput from '../../components/planning-poker/StoryInput';
import PointEstimation from '../../components/planning-poker/PointEstimation';
import VoteResult from '../../components/planning-poker/VoteResult';
import { websocketService } from '../../services/websocket';
import { VoteMessage, JoinMessage, StoryUpdateMessage, Vote } from '../../types/voting';

type VotingMode = 'single' | 'multi';

const PlanningPoker: React.FC = () => {
  const [mode, setMode] = useState<VotingMode>('single');
  const [votes, setVotes] = useState<{ [key: string]: Vote }>({});
  const [isRevealed, setIsRevealed] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [story, setStory] = useState('');
  const [channelDialogOpen, setChannelDialogOpen] = useState(false);
  const [channelId, setChannelId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentUser] = useState({
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    name: 'User ' + Math.floor(Math.random() * 1000)
  });

  // WebSocket 연결 관리
  useEffect(() => {
    if (mode === 'multi' && channelId) {
      // WebSocket 연결
      websocketService.connect();

      // WebSocket 이벤트 구독
      websocketService.subscribe('VOTE', (vote: VoteMessage) => {
        setVotes(prev => ({
          ...prev,
          [vote.userId]: {
            userId: vote.userId,
            point: vote.point,
            timestamp: Date.now()
          }
        }));
      });

      websocketService.subscribe('JOIN', (join: JoinMessage) => {
        setParticipants(prev => [...prev, join.userId]);
      });

      websocketService.subscribe('LEAVE', ({ userId }) => {
        setParticipants(prev => prev.filter(id => id !== userId));
        setVotes(prev => {
          const newVotes = { ...prev };
          delete newVotes[userId];
          return newVotes;
        });
      });

      websocketService.subscribe('REVEAL', () => {
        setIsRevealed(true);
      });

      websocketService.subscribe('STORY_UPDATE', (update: StoryUpdateMessage) => {
        setStory(update.story);
      });

      // 세션 참가
      websocketService.joinSession({
        userId: currentUser.id,
        userName: currentUser.name,
        channelId
      });

      // 컴포넌트 언마운트 시 정리
      return () => {
        websocketService.leaveSession(currentUser.id);
        websocketService.disconnect();
      };
    } else {
      // 싱글 모드이거나 채널 ID가 없을 때는 WebSocket 연결 해제
      websocketService.disconnect();
      setParticipants([currentUser.id]);
    }
  }, [currentUser, mode, channelId]);

  const handleVote = (point: number) => {
    if (mode === 'multi' && channelId) {
      websocketService.sendVote({
        userId: currentUser.id,
        point
      });
    } else {
      setVotes(prev => ({
        ...prev,
        [currentUser.id]: {
          userId: currentUser.id,
          point,
          timestamp: Date.now()
        }
      }));
    }
  };

  const handleReveal = () => {
    if (mode === 'multi' && channelId) {
      websocketService.revealResults();
    } else {
      setIsRevealed(true);
    }
  };

  const handleStoryChange = (newStory: string) => {
    setStory(newStory);
    if (mode === 'multi' && channelId) {
      websocketService.updateStory({ story: newStory });
    }
  };

  const handleModeChange = (event: React.MouseEvent<HTMLElement>, newMode: VotingMode) => {
    if (newMode !== null) {
      if (newMode === 'multi') {
        setChannelDialogOpen(true);
        return;
      }
      setMode(newMode);
      // 모드 변경 시 상태 초기화
      setVotes({});
      setIsRevealed(false);
      setStory('');
      setChannelId('');
    }
  };

  const handleCreateChannel = () => {
    const newChannelId = Math.random().toString(36).substr(2, 9);
    setChannelId(newChannelId);
    setMode('multi');
    setChannelDialogOpen(false);
  };

  const handleJoinChannel = () => {
    if (!channelId.trim()) {
      setError('채널 ID를 입력해주세요');
      return;
    }
    setError(null);
    setMode('multi');
    setChannelDialogOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Planning Poker
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            aria-label="voting mode"
          >
            <ToggleButton value="single" aria-label="single mode">
              싱글 모드
            </ToggleButton>
            <ToggleButton value="multi" aria-label="multi mode">
              멀티 모드
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {mode === 'multi' && channelId && (
          <Alert severity="info" sx={{ mb: 2 }}>
            채널 ID: {channelId}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StoryInput
              story={story}
              onStoryChange={handleStoryChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <PointEstimation
                onVote={handleVote}
                hasVoted={!!votes[currentUser.id]}
                selectedPoint={votes[currentUser.id]?.point}
              />
            </Paper>
          </Grid>

          {Object.keys(votes).length > 0 && (
            <Grid item xs={12}>
              <VoteResult
                votingState={{
                  votes,
                  isRevealed,
                  participants,
                  currentUserId: currentUser.id
                }}
                onReveal={handleReveal}
              />
            </Grid>
          )}
        </Grid>
      </Box>

      <Dialog 
        open={channelDialogOpen} 
        onClose={() => setChannelDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography sx={{ fontWeight: 600 }}>
            멀티 모드 설정
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleCreateChannel}
              fullWidth
              sx={{ mb: 2 }}
            >
              새 채널 만들기
            </Button>
            
            <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
              또는
            </Typography>

            <TextField
              label="채널 ID 입력"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              error={!!error}
              helperText={error}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChannelDialogOpen(false)}>취소</Button>
          <Button 
            variant="contained" 
            onClick={handleJoinChannel}
            disabled={!channelId.trim()}
          >
            참가하기
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PlanningPoker; 