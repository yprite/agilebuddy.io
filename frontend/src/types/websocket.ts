
export type WebSocketMessageType =
  | 'VOTE'
  | 'JOIN'
  | 'LEAVE'
  | 'REVEAL'
  | 'STORY_UPDATE'
  | 'ERROR'
  | 'RESET'
  | 'CHANNEL_STATE'
  | 'FETCH_SPRINT_TASKS'
  | 'FETCH_TASK'
  | 'SPRINT_TASKS'
  | 'TASK_DETAILS'
  | 'PING';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: any;
}

