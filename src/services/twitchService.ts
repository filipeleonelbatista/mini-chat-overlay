import EventEmitter from 'events'
import * as tmi from 'tmi.js'
import { ChatUserstateExtended, MessageEventData } from '../actions/actions'
import { config } from '../config/config'

class TwitchService extends EventEmitter {
  private client: tmi.Client

  constructor() {
    super()
    this.client = new tmi.Client({
      channels: [config.twitchChannelName]
    })
  }

  public init() {
    this.client.connect()

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
        }

        // Aqui você usa o EventEmitter para emitir eventos
        this.emit('message', messageEventData)
      } catch (error) {
        console.error('Error handling Twitch message:', error)
      }
    })
  }

  public onMessage(listener: (data: MessageEventData) => void) {
    this.on('message', listener)
  }
}

export const twitchService = new TwitchService()
