import { Channel, JoinMessage } from '../types';

class ChannelService {
  private channels: Map<string, Channel> = new Map();
  private readonly CHANNEL_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24시간

  private generateChannelId(): string {
    const words = [
      '사과', '바나나', '오렌지', '포도', '딸기',
      '강아지', '고양이', '토끼', '사자', '호랑이',
      '커피', '차', '우유', '주스', '물',
      '책', '연필', '공책', '지우개', '가방',
      '별', '달', '태양', '구름', '비',
      '꽃', '나무', '풀', '바다', '산'
    ];
    
    let channelId: string;
    do {
      const word1 = words[Math.floor(Math.random() * words.length)];
      const word2 = words[Math.floor(Math.random() * words.length)];
      channelId = `${word1}${word2}`;
    } while (this.channels.has(channelId));

    return channelId;
  }

  createChannel(userName: string, channelId: string): Channel {
    const channel: Channel = {
      id: channelId,
      name: `${userName}의 채널`,
      participants: [],
      votes: {},
      story: '',
      isRevealed: false,
      createdAt: Date.now()
    };

    this.channels.set(channelId, channel);
    return channel;
  }

  getChannel(channelId: string): Channel | undefined {
    const channel = this.channels.get(channelId);
    if (channel && Date.now() - channel.createdAt > this.CHANNEL_EXPIRY_TIME) {
      this.channels.delete(channelId);
      return undefined;
    }
    return channel;
  }

  joinChannel(channelId: string, join: JoinMessage): boolean {
    const channel = this.getChannel(channelId);
    if (!channel) {
      return false;
    }

    if (!channel.participants.includes(join.userId)) {
      channel.participants.push(join.userId);
    }

    return true;
  }

  leaveChannel(channelId: string, userId: string): void {
    const channel = this.getChannel(channelId);
    if (channel) {
      channel.participants = channel.participants.filter(id => id !== userId);
      delete channel.votes[userId];

      // 채널이 비어있으면 삭제
      if (channel.participants.length === 0) {
        this.channels.delete(channelId);
      }
    }
  }

  updateVote(channelId: string, userId: string, point: number): void {
    const channel = this.getChannel(channelId);
    if (channel) {
      channel.votes[userId] = {
        userId,
        point,
        timestamp: Date.now()
      };
    }
  }

  revealVotes(channelId: string): void {
    const channel = this.getChannel(channelId);
    if (channel) {
      channel.isRevealed = true;
    }
  }

  updateStory(channelId: string, story: string): void {
    const channel = this.getChannel(channelId);
    if (channel) {
      channel.story = story;
    }
  }

  cleanupExpiredChannels(): void {
    const now = Date.now();
    for (const [channelId, channel] of this.channels.entries()) {
      if (now - channel.createdAt > this.CHANNEL_EXPIRY_TIME) {
        this.channels.delete(channelId);
      }
    }
  }

  resetChannel(channelId: string): void {
    const channel = this.channels.get(channelId);
    if (channel) {
      channel.votes = {};
      channel.isRevealed = false;
    }
  }
}

export const channelService = new ChannelService(); 