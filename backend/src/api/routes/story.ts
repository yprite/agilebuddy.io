import { Router } from 'express';

const router = Router();

// 임시로 메모리에 스토리 저장
let currentStory = '';

router.get('/', (req, res) => {
  res.json({ story: currentStory });
});

router.post('/', (req, res) => {
  const { story } = req.body;
  currentStory = story;
  res.json({ success: true });
});

export const storyRouter = router; 