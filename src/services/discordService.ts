import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import EventEmitter from 'events';
import config from '../config/config.json';

export interface ChatUserstateExtended {
  istwitch: boolean;
  isyoutube: boolean;
  isdiscord: boolean;
  thumbnail: string;
  isMod: boolean;
  isSub: boolean;
  isOwner: boolean;
}

export type MessageEventData = {
  message: string;
  username: string;
  extra?: ChatUserstateExtended;
};

class DiscordService extends EventEmitter {
  private static instance: DiscordService;
  private client: Client;
  // @ts-ignore (define in dts)
  private channel: TextChannel | null = null;

  private constructor() {
    super();
    console.log('Connecting to Discord channel:', config.discordChannelId);
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    });

    this.client.once('ready', () => {
      console.log('Discord bot is ready');
      this.channel = this.client.channels.cache.get(config.discordChannelId) as TextChannel;
    });

    this.client.on('messageCreate', (message) => {
      if (message.author.bot) return;

      if (message.channel.id === config.discordChannelId) {
        const messageEventData: MessageEventData = {
          message: message.content,
          username: message.author.username || 'Nome não informado',
          extra: {
            istwitch: false,
            isyoutube: false,
            isdiscord: true,
            thumbnail: message.author.displayAvatarURL(),
            // @ts-ignore (define in dts)
            isMod: message.member?.permissions.has('MANAGE_MESSAGES') || false,
            isSub: false,
            isOwner: message.author.id === config.discordOwnerId,
          } as ChatUserstateExtended,
        };

        this.emit('message', messageEventData);
      }
    });
  }

  public static getInstance(): DiscordService {
    if (!DiscordService.instance) {
      DiscordService.instance = new DiscordService();
    }
    return DiscordService.instance;
  }

  public init() {
    this.client.login(config.discordToken);
  }

  public onMessage(listener: (data: MessageEventData) => void) {
    this.on('message', listener);
  }

  public disconnect() {
    this.client.destroy();
  }
}

export const discordService = DiscordService.getInstance();
