export interface ClickupTask {
  id: string;
  name: string;
  description: string;
  status: {
    status: string;
    color: string;
  };
  priority: {
    priority: string;
    color: string;
  };
  assignees: Array<{
    id: string;
    username: string;
    email: string;
  }>;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoryUpdateMessage {
  story: string;
}

export interface ClickupTaskList {
  tasks: ClickupTask[];
  total: number;
  has_more: boolean;
} 