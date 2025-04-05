import { WebSocketMessage, VoteMessage, JoinMessage, StoryUpdateMessage } from '../types/voting';
import { WebSocketMessageType } from '../types/websocket';

class WebSocketService {
  private ws: WebSocket | null = null;
  private eventHandlers: { [key: string]: ((data: any) => void)[] } = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  private pingInterval: NodeJS.Timeout | null = null;

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      this.ws = new WebSocket('ws://localhost:3001');

      this.ws.onopen = () => {
        console.log('WebSocket Connected');
        this.reconnectAttempts = 0;
        resolve();
      };

      this.ws.onclose = () => {
        console.log('WebSocket Disconnected');
        reject(new Error('WebSocket connection closed'));
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        reject(error);
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          const handlers = this.eventHandlers[message.type] || [];
          handlers.forEach(handler => handler(message.payload));
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };
    });
  }

  public subscribe(type: WebSocketMessage['type'], handler: (payload: any) => void) {
    if (!this.eventHandlers[type]) {
      this.eventHandlers[type] = [];
    }
    this.eventHandlers[type].push(handler);
  }

  public unsubscribe(type: WebSocketMessage['type'], handler: (payload: any) => void) {
    if (!this.eventHandlers[type]) return;
    this.eventHandlers[type] = this.eventHandlers[type].filter(h => h !== handler);
  }

  public send(message: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('Sending WebSocket message:', message);
      this.ws.send(JSON.stringify(message));
      console.log('WebSocket message sent successfully');
    } else {
      console.error('WebSocket is not connected. Current state:', this.ws?.readyState);
    }
  }

  public sendVote(vote: VoteMessage) {
    this.send({
      type: 'VOTE',
      payload: vote
    });
  }

  public joinSession(join: JoinMessage) {
    this.send({
      type: 'JOIN',
      payload: join
    });
  }

  public leaveSession(userId: string) {
    this.send({
      type: 'LEAVE',
      payload: { userId }
    });
  }

  public revealResults() {
    this.send({
      type: 'REVEAL',
      payload: {}
    });
  }

  public updateStory(update: StoryUpdateMessage) {
    this.send({
      type: 'STORY_UPDATE',
      payload: update
    });
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.eventHandlers = {};
      this.reconnectAttempts = 0;
    }
  }

  sendMessage(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }
}

export const websocketService = new WebSocketService(); 