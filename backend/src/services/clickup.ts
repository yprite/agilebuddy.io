import axios from 'axios';
import { ClickupTask, ClickupTaskList } from '../types/clickup';

class ClickupService {
  private apiToken: string;
  private baseUrl: string = 'https://api.clickup.com/api/v2';

  constructor() {
    //const token = process.env.CLICKUP_API_TOKEN;
    const token = "pk_66630061_G6Q43VP0Z0OMADLIZ6H2DK55M7GZVMIO";
    if (!token) {
      throw new Error('CLICKUP_API_TOKEN is not set in environment variables');
    }
    this.apiToken = token;
    // 토큰 유효성 확인
    this.validateToken();
  }

  private getHeaders() {
    return {
      'Authorization': this.apiToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  private async validateToken() {
    try {
      console.log('Validating ClickUp API token...');
      const response = await axios.get(
        `${this.baseUrl}/user`,
        { headers: this.getHeaders() }
      );
      console.log('Token validation successful:', response.data);
    } catch (error: any) {
      console.error('Token validation failed:', error.response?.data || error.message);
      throw new Error('Invalid ClickUp API token');
    }
  }

  async getTasks(listId: string): Promise<ClickupTaskList> {
    try {
      console.log('Fetching tasks for list:', listId);
      const response = await axios.get<ClickupTaskList>(
        `${this.baseUrl}/list/${listId}/task`,
        { headers: this.getHeaders() }
      );
      console.log('Tasks response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tasks from Clickup:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  }

  async getTask(taskId: string): Promise<ClickupTask> {
    try {
      console.log('Fetching task:', taskId);
      const response = await axios.get<ClickupTask>(
        `${this.baseUrl}/task/${taskId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      // console.error('Error fetching task from Clickup:', error);
      // if (error.response) {
      //   console.error('Error response:', error.response.data);
      // }
      throw error;
    }
  }

  async getSprintTasks(folderId: string): Promise<ClickupTaskList> {
    try {
      console.log('Fetching sprint tasks for folder:', folderId);
      const response = await axios.get<ClickupTaskList>(
        `${this.baseUrl}/folder/${folderId}/list`,
        { headers: this.getHeaders() }
      );
      console.log('Sprint tasks response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching sprint tasks:', error);
      // if (error.response) {
      //   console.error('Error response:', error.response.data);
      // }
      throw error;
    }
  }
}

export const clickupService = new ClickupService(); 