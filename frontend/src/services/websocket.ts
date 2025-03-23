import { WebSocketMessage, VoteMessage, JoinMessage, StoryUpdateMessage } from '../types/voting';

class WebSocketService {
  private ws: WebSocket | null = null;
  private eventHandlers: { [key: string]: ((data: any) => void)[] } = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  private messageHandlers: { [key: string]: ((payload: any) => void)[] } = {};

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
        this.attemptReconnect();
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

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectTimeout);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  public subscribe(type: WebSocketMessage['type'], handler: (payload: any) => void) {
    if (!this.messageHandlers[type]) {
      this.messageHandlers[type] = [];
    }
    this.messageHandlers[type].push(handler);
  }

  public unsubscribe(type: WebSocketMessage['type'], handler: (payload: any) => void) {
    if (!this.messageHandlers[type]) return;
    this.messageHandlers[type] = this.messageHandlers[type].filter(h => h !== handler);
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

  private send(message: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.eventHandlers = {};
      this.reconnectAttempts = 0;
    }
  }
}

export const websocketService = new WebSocketService(); 