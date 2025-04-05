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
  Alert,
  IconButton,
  Snackbar
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StoryInput from '../../components/planning-poker/StoryInput';
import PointEstimation from '../../components/planning-poker/PointEstimation';
import VoteResult from '../../components/planning-poker/VoteResult';
import { websocketService } from '../../services/websocket';
import { VoteMessage } from '../../types/voting';
import { JoinMessage } from '../../types/channel';
import { StoryUpdateMessage } from '../../types/clickup';
import TaskList from '../../components/planning-poker/TaskList';
import { ClickupTask } from '../../types/clickup';
import { Vote } from 'types/voting';

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
  const [showCopySnackbar, setShowCopySnackbar] = useState(false);
  const [currentUser] = useState({
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    name: 'User ' + Math.floor(Math.random() * 1000)
  });
  const [selectedTask, setSelectedTask] = useState<ClickupTask | null>(null);
  const [listId, setListId] = useState<string>('');

  // WebSocket 연결 관리
  useEffect(() => {
    if (mode === 'multi' && channelId) {
      // WebSocket 연결 및 세션 참가
      websocketService.connect()
        .then(() => {
          // WebSocket 이벤트 구독
          websocketService.subscribe('VOTE', (vote: VoteMessage) => {
            console.log('Received vote:', vote);
            setVotes(prev => {
              const newVotes = {
                ...prev,
                [vote.userId]: {
                  userId: vote.userId,
                  point: vote.point,
                  timestamp: Date.now()
                }
              };

              // 모든 참가자가 투표했는지 확인
              const allVoted = participants.every(participant => newVotes[participant]);
              if (allVoted) {
                setIsRevealed(true);
              }

              return newVotes;
            });
          });

          websocketService.subscribe('JOIN', (join: JoinMessage) => {
            console.log('Received join:', join);
            setParticipants(prev => {
              if (!prev.includes(join.userId)) {
                return [...prev, join.userId];
              }
              return prev;
            });
          });

          websocketService.subscribe('LEAVE', ({ userId }) => {
            console.log('Received leave:', userId);
            setParticipants(prev => prev.filter(id => id !== userId));
            setVotes(prev => {
              const newVotes = { ...prev };
              delete newVotes[userId];
              return newVotes;
            });
          });

          websocketService.subscribe('REVEAL', () => {
            console.log('Received reveal');
            // 모든 참가자가 투표했는지 확인
            const allVoted = participants.every(participant => votes[participant]);
            if (allVoted) {
              setIsRevealed(true);
            }
          });

          websocketService.subscribe('STORY_UPDATE', (update: StoryUpdateMessage) => {
            console.log('Received story update:', update);
            if (update.story) {
              setStory(update.story);
            }
          });

          websocketService.subscribe('RESET', () => {
            console.log('Received reset');
            setVotes({});
            setIsRevealed(false);
          });

          websocketService.subscribe('CHANNEL_STATE', (state: any) => {
            console.log('Received channel state:', state);
            setParticipants(state.participants);
            setVotes(state.votes);
            setStory(state.story || '');
            setIsRevealed(state.isRevealed);
          });

          // 세션 참가
          websocketService.joinSession({
            userId: currentUser.id,
            userName: currentUser.name,
            channelId
          });
        })
        .catch((error) => {
          console.error('Failed to connect to WebSocket:', error);
          websocketService.disconnect();
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
      setVotes({}); // 투표 상태 초기화
    }
  }, [currentUser, mode, channelId]);

  const handleVote = (point: number) => {
    console.log('PlanningPoker handleVote called with point:', point);
    setVotes(prev => ({
      ...prev,
      [currentUser.id]: {
        userId: currentUser.id,
        point,
        timestamp: Date.now()
      }
    }));

    if (mode === 'multi' && channelId) {
      // 5초 후에 투표 전송
      setTimeout(() => {
        websocketService.sendVote({
          userId: currentUser.id,
          point
        });
      }, 5000);
    } else {
      // 싱글 모드에서는 5초 후에 결과 표시
      setTimeout(() => {
        setIsRevealed(true);
      }, 5000);
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

  const generateChannelId = () => {
    // 간단한 한글 단어 목록
    const words = [
      '사과', '바나나', '오렌지', '포도', '딸기',
      '강아지', '고양이', '토끼', '사자', '호랑이',
      '커피', '차', '우유', '주스', '물',
      '책', '연필', '공책', '지우개', '가방',
      '별', '달', '태양', '구름', '비',
      '꽃', '나무', '풀', '바다', '산'
    ];

    // 랜덤하게 두 개의 단어 선택
    const word1 = words[Math.floor(Math.random() * words.length)];
    const word2 = words[Math.floor(Math.random() * words.length)];

    return `${word1}${word2}`;
  };

  const handleCreateChannel = () => {
    const newChannelId = generateChannelId();
    setChannelId(newChannelId);
    setMode('multi');
    setChannelDialogOpen(false);
  };

  const handleJoinChannel = () => {
    if (!channelId.trim()) {
      setError('채널 ID를 입력해주세요');
      return;
    }
    // 한글만 입력 가능하도록 검증
    if (!/^[가-힣]+$/.test(channelId)) {
      setError('한글만 입력 가능합니다');
      return;
    }
    setError(null);
    setMode('multi');
    setChannelDialogOpen(false);
  };

  const handleCopyChannelId = async () => {
    try {
      await navigator.clipboard.writeText(channelId);
      setShowCopySnackbar(true);
    } catch (err) {
      console.error('Failed to copy channel ID:', err);
    }
  };

  const handleReset = () => {
    if (mode === 'multi' && channelId) {
      websocketService.sendMessage({
        type: 'RESET',
        payload: {}
      });
    }
    setVotes({});
    setIsRevealed(false);
  };

  const handleTaskSelect = (task: ClickupTask) => {
    setSelectedTask(task);
    setStory(task.description);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* <Grid item xs={12} md={4}>
          <TaskList
            onTaskSelect={handleTaskSelect}
          />
        </Grid> */}
        <Grid item xs={12} md={8}>
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
              <Alert
                severity="info"
                sx={{ mb: 2 }}
                action={
                  <IconButton
                    aria-label="copy channel ID"
                    color="inherit"
                    size="small"
                    onClick={handleCopyChannelId}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                }
              >
                채널 ID: {channelId}
              </Alert>
            )}

            {/* <StoryInput
              story={story}
              onStoryChange={handleStoryChange}
              disabled={isRevealed}
            /> */}

            {!isRevealed ? (
              <PointEstimation
                onVote={handleVote}
                hasVoted={!!votes[currentUser.id]}
                selectedPoint={votes[currentUser.id]?.point}
              />
            ) : (
              <VoteResult
                votingState={{
                  votes,
                  isRevealed,
                  participants,
                  currentUserId: currentUser.id
                }}
                onReveal={handleReveal}
                onReset={handleReset}
              />
            )}
          </Box>
        </Grid>
      </Grid>

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

      <Snackbar
        open={showCopySnackbar}
        autoHideDuration={2000}
        onClose={() => setShowCopySnackbar(false)}
        message="채널 ID가 복사되었습니다"
      />
    </Container>
  );
};

export default PlanningPoker; 