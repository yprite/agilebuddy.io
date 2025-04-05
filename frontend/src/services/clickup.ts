import { ClickupTask, ClickupTaskList } from '../types/clickup';
import { websocketService } from './websocket';
import { StoryUpdateMessage } from '../types/clickup';

class ClickupService {
  async getTasks(listId: string): Promise<ClickupTaskList> {
    return new Promise((resolve, reject) => {
      websocketService.subscribe('SPRINT_TASKS', (data: ClickupTaskList) => {
        resolve(data);
      });

      websocketService.send({
        type: 'FETCH_SPRINT_TASKS',
        payload: { listId }
      });
    });
  }

  async getTask(taskId: string): Promise<ClickupTask> {
    return new Promise((resolve, reject) => {
      websocketService.subscribe('TASK_DETAILS', (data: ClickupTask) => {
        resolve(data);
      });

      websocketService.send({
        type: 'FETCH_TASK',
        payload: { taskId }
      });
    });
  }

  async getSprintTasks(folderId: string): Promise<ClickupTaskList> {
    return new Promise((resolve, reject) => {
      websocketService.subscribe('SPRINT_TASKS', (data: ClickupTaskList) => {
        resolve(data);
      });

      websocketService.send({
        type: 'FETCH_SPRINT_TASKS',
        payload: { folderId }
      });
    });
  }
}

export const clickupService = new ClickupService(); 