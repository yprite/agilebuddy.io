export type WebSocketMessageType =
  | 'VOTE'
  | 'JOIN'
  | 'LEAVE'
  | 'REVEAL'
  | 'STORY_UPDATE'
  | 'ERROR'
  | 'RESET'
  | 'CHANNEL_STATE'
  | 'REQUEST_CHANNEL_STATE'
  | 'FETCH_SPRINT_TASKS'
  | 'FETCH_TASK'
  | 'SPRINT_TASKS'
  | 'TASK_DETAILS'
  | 'PING'
  | 'YPRITE';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: any;
}

