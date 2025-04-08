import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import LightningPayment from 'components/LightningPayment';

const Home = () => {
  const lightningInvoice = "vexedash70@walletofsatoshi.com"
  return (
    <Container maxWidth="lg">
      {/* 헤더 섹션 */}
      <Box sx={{ textAlign: 'center', mb: 6, mt: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Agile-Buddy
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          애자일 팀을 위한 스마트한 도구 모음
        </Typography>
      </Box>

      {/* 소개 섹션 */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              프로젝트 소개
            </Typography>
            <Typography paragraph>
              Agile-Buddy는 애자일 팀을 위한 다양한 도구들을 제공하는 플랫폼입니다.
              현재는 스토리 포인트 산정 도구를 시작으로, 앞으로 더 많은 애자일 도구들이 추가될 예정입니다.
            </Typography>
            <Typography paragraph>
              현재 제공 중인 기능:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>
                <Typography>
                  스토리 포인트 산정 (Planning Poker)
                </Typography>
              </li>
            </ul>
            <Typography paragraph>
              향후 추가 예정 기능:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>
                <Typography>
                  스프린트 회고 (Sprint Retrospective)
                </Typography>
              </li>
              <li>
                <Typography>
                  일일 스탠드업 (Daily Standup)
                </Typography>
              </li>
              <li>
                <Typography>
                  백로그 관리 (Backlog Management)
                </Typography>
              </li>
              <li>
                <Typography>
                  팀 협업 도구 (Team Collaboration)
                </Typography>
              </li>
            </ul>
          </Paper>
        </Grid>
        {/* <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box component="img"
              src="/planning-poker-preview.png"
              alt="Planning Poker Preview"
              sx={{
                width: '100%',
                maxHeight: 300,
                objectFit: 'contain'
              }}
            />
          </Paper>
        </Grid> */}
      </Grid>

      {/* 현재 기능 섹션 */}
      <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          스토리 포인트 산정 (Planning Poker)
        </Typography>
        <Typography paragraph>
          현재 제공 중인 스토리 포인트 산정 도구는 분산된 팀에서도 효율적으로 스토리 포인트를 산정할 수 있도록 도와줍니다.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>1. 방 생성</Typography>
            <Typography>
              '스토리 포인트 산정' 메뉴에서 새로운 방을 생성하거나 기존 방에 참여하세요.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>2. 팀원 초대</Typography>
            <Typography>
              생성된 방의 URL을 팀원들과 공유하여 초대하세요.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>3. 투표 진행</Typography>
            <Typography>
              각자의 의견을 카드로 선택하고 결과를 실시간으로 확인하세요.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* 로드맵 섹션 */}
      <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          개발 로드맵
        </Typography>
        <Typography paragraph>
          Agile-Buddy는 지속적으로 발전하는 프로젝트입니다. 다음 기능들이 순차적으로 추가될 예정입니다:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Q2 2025</Typography>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>
                <Typography>
                  스프린트 회고 도구
                </Typography>
              </li>
              <li>
                <Typography>
                  일일 스탠드업 도구
                </Typography>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Q3 2025</Typography>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>
                <Typography>
                  백로그 관리 도구
                </Typography>
              </li>
              <li>
                <Typography>
                  팀 협업 도구
                </Typography>
              </li>
            </ul>
          </Grid>
        </Grid>
      </Paper>

      {/* 후원 섹션 */}
      <Paper elevation={3} sx={{ p: 4, mb: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          후원하기
        </Typography>
        <Typography paragraph>
          Agile-Buddy는 오픈소스 프로젝트입니다.
          더 나은 서비스를 위해 여러분의 후원이 큰 도움이 됩니다.
        </Typography>
        <LightningPayment invoice={lightningInvoice} />
      </Paper>

      {/* 시작하기 버튼 */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Button
          component={Link}
          to="/planning-poker"
          variant="contained"
          size="large"
          sx={{ minWidth: 200 }}
        >
          스토리 포인트 산정 시작하기
        </Button>
      </Box>
    </Container>
  );
};

export default Home; 