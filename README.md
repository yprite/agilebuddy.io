# agilebuddy.io
애자일에서 필요로 하는 유틸 기능


## 📊 1. 스토리 포인트 산정 앱 (Planning Poker / Estimation Tool)
- 기능: 스토리 포인트 투표, 자동 점수 평균 계산, 결과 저장.
  - 스크럼 마스터가 스토리를 팀원들에 보여줌 (클릭업에서 가져오기)
  - 투표 결과를 클릭업에서 가져온 스토리 앞에 점수 추가
  - 스토리 목록 관리 기능
  - 기본 기능 : 실시간 투표 기능
- 추가 기능 아이디어: 과거의 추정 데이터 비교, AI 기반 추천 포인트 제공.

### Clickup API 설정
1. Clickup API 토큰 발급
   - Clickup 계정에 로그인
   - 우측 상단의 프로필 아이콘 클릭
   - Settings > Apps > API Token 메뉴로 이동
   - "Generate" 버튼을 클릭하여 API 토큰 생성
   - 생성된 토큰을 안전한 곳에 저장

2. 환경 변수 설정
   - backend/.env 파일 생성
   ```
   CLICKUP_API_TOKEN=your_api_token_here
   ```

### 실행 방법
1. 백엔드 실행
```bash
cd backend
npm install
npm run dev
```

2. 프론트엔드 실행
```bash
cd frontend
npm install
npm start
```

3. 브라우저에서 접속
- http://localhost:3000 으로 접속

---

## 📝 2. 팀 감정 분석 (Sentiment Analysis)
- 텍스트 분석을 통해 팀 분위기 시각화.

---

## 🔍 3. 자동 회고 질문 생성기
– "이번 스프린트에서 가장 잘 된 점은?" 같은 질문 자동 생성.

---

## 🔔 4. 데일리 스탠드업 자동 요약 봇
- 기능: 어제 한 일 / 오늘 할 일 / 장애물"을 입력 → AI가 정리