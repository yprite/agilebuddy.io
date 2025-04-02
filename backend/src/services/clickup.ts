import axios from 'axios';

class ClickupService {
  private apiToken: string;
  private baseUrl: string = 'https://api.clickup.com/api/v2';

  constructor() {
    const token = process.env.CLICKUP_API_TOKEN;
    if (!token) {
      throw new Error('CLICKUP_API_TOKEN is not set in environment variables');
    }
    this.apiToken = token;
  }

  private getHeaders() {
    return {
      'Authorization': this.apiToken,
      'Content-Type': 'application/json'
    };
  }

  async getTasks(listId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/list/${listId}/task`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks from Clickup:', error);
      throw error;
    }
  }

  async getTask(taskId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/task/${taskId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching task from Clickup:', error);
      throw error;
    }
  }
}

export const clickupService = new ClickupService(); 