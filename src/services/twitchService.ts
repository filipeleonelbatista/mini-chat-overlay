import EventEmitter from 'events'
import * as tmi from 'tmi.js'
import config from '../config/config.json'

export interface ChatUserstateExtended {
  istwitch: boolean
  isyoutube: boolean
  thumbnail: string
  isMod: boolean
  isSub: boolean
  isOwner: boolean
}

export type MessageEventData = {
  message: string
  username: string
  extra?: ChatUserstateExtended
}

class TwitchService extends EventEmitter {
  private static instance: TwitchService;
  private client: tmi.Client;

  private constructor() {
    super();
    console.log('Connecting to Twitch channel:', config.twitchChannelName);
    this.client = new tmi.Client({
      channels: [config.twitchChannelName]
    });
  }

  public static getInstance(): TwitchService {
    if (!TwitchService.instance) {
      TwitchService.instance = new TwitchService();
    }
    return TwitchService.instance;
  }

  public init() {
    this.client.connect();

    this.client.on('message', (_channel, extra, message) => {
      try {
        const messageEventData: MessageEventData = {
          message,
          username: extra.username || 'Nome não informado',
          extra: {
            ...extra,
            istwitch: true,
            isyoutube: false,
            thumbnail: 'user.png',
            isMod: extra.mod,
            isSub: extra.subscriber,
            isOwner: extra.username === config.twitchChannelName
          } as ChatUserstateExtended
        };

        this.emit('message', messageEventData);
      } catch (error) {
        console.error('Error handling Twitch message:', error);
      }
    });
  }

  public onMessage(listener: (data: MessageEventData) => void) {
    this.on('message', listener);
  }

  public disconnect() {
    this.client.disconnect();
  }
}

export const twitchService = TwitchService.getInstance();
