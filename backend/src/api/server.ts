import express from 'express';
import cors from 'cors';
import { storyRouter } from './routes/story';
import clickupRouter from '../routes/clickup';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 라우터 등록
app.use('/api/stories', storyRouter);
app.use('/api/clickup', clickupRouter);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'AgileBuddy API Server' });
});

// 에러 핸들링
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
}); 