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
    console.log('Session info saved:', { channelId, userId, userName });
  }

  // 세션 정보 복구
  private restoreSessionInfo(): { channelId: string; userId: string; userName: string } | null {
    const savedSession = localStorage.getItem('wsSession');
    if (!savedSession) {
      console.log('No saved session found');
      return null;
    }

    const session = JSON.parse(savedSession);
    // 1시간이 지난 세션은 무효화
    if (Date.now() - session.timestamp > 60 * 60 * 1000) {
      console.log('Session expired');
      localStorage.removeItem('wsSession');
      return null;
    }

    console.log('Session restored:', session);
    return session;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        console.log('WebSocket is already connected');
        resolve();
        return;
      }

      console.log('Attempting to connect WebSocket...');
      this.ws = new WebSocket('ws://3.36.132.159:10190');

      this.ws.onopen = () => {
        console.log('WebSocket Connected');
        this.reconnectAttempts = 0;
        
        // 저장된 세션이 있다면 자동으로 재접속
        const savedSession = this.restoreSessionInfo();
        if (savedSession) {
          console.log('Auto-rejoining session:', savedSession);
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
          console.log('Received WebSocket message:', message);
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
    console.log(`Subscribed to ${type} events`);
  }

  public unsubscribe(type: WebSocketMessage['type'], handler: (payload: any) => void) {
    if (!this.eventHandlers[type]) return;
    this.eventHandlers[type] = this.eventHandlers[type].filter(h => h !== handler);
    console.log(`Unsubscribed from ${type} events`);
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
    console.log('Joining session:', join);
    this.saveSessionInfo(join.channelId, join.userId, join.userName);
    this.send({
      type: 'JOIN',
      payload: join
    });
  }

  public leaveSession(userId: string) {
    console.log('Leaving session for user:', userId);
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
    console.log('Disconnecting WebSocket');
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
    // visibilitychange 이벤트
    document.addEventListener('visibilitychange', () => {
      console.log('Visibility changed:', document.visibilityState);
      this.handleVisibilityChange();
    });

    // focus/blur 이벤트
    window.addEventListener('focus', () => {
      console.log('Window focused');
      this.handleVisibilityChange();
    });

    window.addEventListener('blur', () => {
      console.log('Window blurred');
    });

    // 모바일 이벤트
    document.addEventListener('resume', () => {
      console.log('App resumed');
      this.handleVisibilityChange();
    });

    // 온라인/오프라인 상태 감지
    window.addEventListener('online', () => {
      console.log('Device is online');
      this.handleVisibilityChange();
    });

    window.addEventListener('offline', () => {
      console.log('Device is offline');
    });
  }

  private handleVisibilityChange() {
    // 페이지가 보이거나, 포커스를 받거나, 온라인 상태가 되었을 때
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.log('Attempting to reconnect WebSocket...');
      this.connect()
        .then(() => {
          console.log('WebSocket reconnected successfully');
          // 저장된 세션이 있다면 상태 요청
          const savedSession = this.restoreSessionInfo();
          if (savedSession) {
            console.log('Restoring session:', savedSession);
            this.send({
              type: 'REQUEST_CHANNEL_STATE',
              payload: { channelId: savedSession.channelId }
            });
          }
        })
        .catch(error => {
          console.error('Failed to reconnect WebSocket:', error);
        });
    } else {
      console.log('WebSocket is already connected');
    }
  }

  constructor() {
    this.setupVisibilityHandler();
  }
}

export const websocketService = new WebSocketService(); 