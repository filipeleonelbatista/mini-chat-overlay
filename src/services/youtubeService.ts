import EventEmitter from 'events';
import { TubeChat } from 'tubechat';
import { config } from '../config/config';

export interface ChatUserstateExtended {
  istwitch: boolean;
  isyoutube: boolean;
  thumbnail: string;
  isMod: boolean;
  isSub: boolean;
  isOwner: boolean;
}

export type MessageEventData = {
  message: string;
  username: string;
  extra?: ChatUserstateExtended;
}

interface Thumbnail {
  url: string;
  alt: string;
}

interface Badges {
  [key: string]: any;
}

interface TubeChatMessage {
  channel: string;
  id: string;
  message: { text?: string }[];
  name: string;
  thumbnail: Thumbnail;
  channelId: string;
  isMembership: boolean;
  isOwner: boolean;
  isVerified: boolean;
  isModerator: boolean;
  isNewMember: boolean;
  badges: Badges;
  color: string;
  timestamp: Date;
}

class YouTubeService extends EventEmitter {
  private tubeChat: TubeChat;

  constructor() {
    super();
    this.tubeChat = new TubeChat();
    this.tubeChat.connect(config.youtubeChannelName);
    console.log('Connecting to YouTube channel:', config.youtubeChannelName);
    this.tubeChat.on('message', (data: TubeChatMessage) => this.handleMessage(data));
  }

  private handleMessage(params: TubeChatMessage) {
    const { message, name, isMembership, isOwner, isModerator, thumbnail } = params;
    try {
      const messageText = message?.[0]?.text || '';
      const messageEventData: MessageEventData = {
        message: messageText,
        username: name,
        extra: {
          istwitch: false,
          isyoutube: true,
          thumbnail: thumbnail?.url ?? 'user.png',
          isMod: isModerator,
          isSub: isMembership,
          isOwner: isOwner,
        } as ChatUserstateExtended
      };
      this.emit('message', messageEventData);

      console.log('Message received from YouTube:', messageEventData);
    } catch (error) {
      console.error('Error handling YouTube message:', error);
    }
  }

  public onMessage(listener: (data: MessageEventData) => void) {
    this.on('message', listener);
  }
}

export const youtubeService = new YouTubeService();
