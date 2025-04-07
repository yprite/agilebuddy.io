import { VoteMessage } from '../types/voting';
import { WebSocketMessage } from '../types/websocket';
import { JoinMessage } from '../types/channel';
import { StoryUpdateMessage } from '../types/clickup';

class WebSocketService {
  private ws: WebSocket | null = null;
  private eventHandlers: { [key: string]: ((data: any) => void)[] } = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  private pingInterval: NodeJS.Timeout | null = null;
  private currentChannelId: string | null = null;
  private currentUserId: string | null = null;
  private currentUserName: string | null = null;

  // 세션 정보 저장
  private saveSessionInfo(channelId: string, userId: string, userName: string) {
    this.currentChannelId = channelId;
    this.currentUserId = userId;
    this.currentUserName = userName;
    
    // localStorage에도 저장
    localStorage.setItem('wsSession', JSON.stringify({
      channelId,
      userId,
      userName,
      timestamp: Date.now()
    }));
  }

  // 세션 정보 복구
  private restoreSessionInfo(): { channelId: string; userId: string; userName: string } | null {
    const savedSession = localStorage.getItem('wsSession');
    if (!savedSession) return null;

    const session = JSON.parse(savedSession);
    // 1시간이 지난 세션은 무효화
    if (Date.now() - session.timestamp > 60 * 60 * 1000) {
      localStorage.removeItem('wsSession');
      return null;
    }

    return session;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      this.ws = new WebSocket('ws://3.36.132.159:10190');

      this.ws.onopen = () => {
        console.log('WebSocket Connected');
        this.reconnectAttempts = 0;
        
        // 저장된 세션이 있다면 자동으로 재접속
        const savedSession = this.restoreSessionInfo();
        if (savedSession) {
          this.joinSession({
            channelId: savedSession.channelId,
            userId: savedSession.userId,
            userName: savedSession.userName
          });
        }
        
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
    this.saveSessionInfo(join.channelId, join.userId, join.userName);
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
    // 세션 정보 삭제
    localStorage.removeItem('wsSession');
    this.currentChannelId = null;
    this.currentUserId = null;
    this.currentUserName = null;
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

  // 페이지 가시성 변경 감지
  private setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // 페이지가 다시 보일 때 연결 상태 확인
        if (this.ws?.readyState !== WebSocket.OPEN) {
          this.connect();
        }
      }
    });
  }

  constructor() {
    this.setupVisibilityHandler();
  }
}

export const websocketService = new WebSocketService(); 