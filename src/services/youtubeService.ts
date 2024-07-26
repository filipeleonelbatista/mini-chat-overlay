import * as httpServer from 'node:http'
import { Server } from 'socket.io'
import { TubeChat } from 'tubechat'
import { config } from '../config/config'

const tubeChat = new TubeChat()
tubeChat.connect(config.twitchChannelName)

const server = httpServer.createServer()

const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

const onConnection = socket => {
  tubeChat.on('message', ({ message, name }) => {
    const messageText = message[0]?.text || ''

    const messageEventData = {
      message: messageText,
      username: name,
      extra: {
        istwitch: false,
        isyoutube: true,
        isMod: false,
        isSub: false,
        isOwner: false,
      }
    }

    socket.emit('chat', messageEventData)
  })
}

io.on('connection', onConnection)

server.listen(3333)
