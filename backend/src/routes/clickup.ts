import express from 'express';
import { clickupService } from '../services/clickup';
import { ClickupTask, ClickupTaskList } from '../types/clickup';

const router = express.Router();

// Task 목록 가져오기
router.get('/tasks/:listId', async (req, res) => {
  try {
    const { listId } = req.params;
    const tasks = await clickupService.getTasks(listId);
    res.json(tasks);
  } catch (error) {
    console.error('Error in /tasks/:listId endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch tasks from Clickup' });
  }
});

// 개별 Task 가져오기
router.get('/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await clickupService.getTask(taskId);
    res.json(task);
  } catch (error) {
    console.error('Error in /task/:taskId endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch task from Clickup' });
  }
});

export default router; 