const { text: input } = require('input')
const { Api, TelegramClient } = require('telegram')
const { StringSession } = require('telegram/sessions')
const { NewMessage } = require('telegram/events')

const entity = {
  MessageEntityUnknown: 'unknown',
  MessageEntityMention: 'mention',
  MessageEntityHashtag: 'hashtag',
  MessageEntityBotCommand: 'bot_command',
  MessageEntityUrl: 'url',
  MessageEntityEmail: 'email',
  MessageEntityBold: 'bold', 
  MessageEntityItalic: 'italic',
  MessageEntityCode: 'code',
  MessageEntityPre: 'pre',
  MessageEntityTextUrl: 'test_url',
  MessageEntityMentionName: 'mention_name',
  InputMessageEntityMentionName: 'input_message_mentiom_name',
  MessageEntityPhone: 'phone',
  MessageEntityCashtag: 'cashtag',
  MessageEntityUnderline: 'underline',
  MessageEntityStrike: 'strike',
  MessageEntityBlockquote: 'blockquote',
  MessageEntityBankCard: 'bank_card',
  MessageEntitySpoiler: 'spoiler'
}
const messageTypes  = [
  'UpdatesTooLong',
  'UpdateShortMessage',
  'UpdateShortChatMessage',
  'UpdateShort',
  'UpdatesCombined',
  'Updates',
  'UpdateShortSentMessage'
]
const actions = {
  SendMessageTypingAction: 'typing',
  SendMessageCancelAction: 'canceling',
  SendMessageRecordVideoAction: 'video_recording',
  SendMessageUploadVideoAction: 'video_uploading',
  SendMessageRecordAudioAction: 'audio_recording',
  SendMessageUploadAudioAction: 'audio_uploading',
  SendMessageUploadPhotoAction: 'photo_uploading',
  SendMessageUploadDocumentAction: 'document_uploading',
  SendMessageGeoLocationAction: 'geo_locationing',
  SendMessageChooseContactAction: 'choose_contacting',
  SendMessageGamePlayAction: 'game_playing',
  SendMessageRecordRoundAction: 'round_video_recording',
  SendMessageUploadRoundAction: 'round_video_uploading',
  SpeakingInGroupCallAction: 'voice_speeking',
  SendMessageHistoryImportAction: 'history_importing',
  SendMessageChooseStickerAction: 'choosing_sticker', 
  SendMessageEmojiInteraction: 'emoji_interaction',
  SendMessageEmojiInteractionSeen: 'emoji_interaction_seen'
}

const Fuxo = class Fuxo {
  constructor(app) {
    this.client = new TelegramClient(
      new StringSession(app.session), 
      Number(app.id), 
      app.hash, {
        connectionRetries: 5
      }
    )
  }
  
  login (login) {
    return this.client.start({
      phoneNumber: login.phone,
      password: login.password,
      phoneCode: login.code,
      onError: login.onError
    })
  }
  
  sessionSave () {
    return this.client.session.save()
  }

  async connect() {
    return await this.client.connect()
  }
  
  async disconnect () {
    return await this.client.disconnect()
  }

  setParseMode(mode) {
    return this.client.setParseMode(mode)
  }  

  sendMessage(chatId, text, extra) {
    return this.client.sendMessage(chatId, {
      message: text,
      ...extra
    })
  }

  /*
  on(event, callback) {
    this.client.addEventHandler( async (update) => {
      const ut = update.className
      const ou = update

      if (event == 'status_changed') { 
        if (ut == 'UpdateUserStatus') {
          update = {
            user: {
              id: Number(update.userId)
            }
          }
          if (update.status.className == 'UserStatusOnline') {
            update.status = {
              type: 'online',
              expires: update.status.expires
            }
          } else {
            update.status = {
              type: 'offline',
              wasOnline: update.status.wasOnline
            }
          }
          callback(update)
        }
      }
      if (event == 'reaction') { 
        if (ut == 'UpdateMessageReactions') {
          let beta = {
            user: {
              id: Number(update.userId)
            }
          }
          callback(update)
        }
      }
      if (event == 'joined') { 
        if (ut == 'UpdateChatParticipant' || ut == 'UpdateChatParticipantAdd' || ut == 'UpdateChatParticipantDelete' || ut == 'UpdateChatParticipants') {
          let beta = {
            user: {
              id: Number(update.userId)
            }
          }
          callback(update)
        }
      }
      if (event == 'typing') { 
        if (ut == 'UpdateChannelUserTyping') {
          update = {
            action: actions[update.action.className],
            chat: {
              id: Number(update.channelId)
            },
            user: {
              id: Number(update.fromId.userId)
            }
          }
          callback(update)
        }
      }
    })
  }

  event(callback) {
    this.client.addEventHandler( async (update) => {
      callback(update)
    })
  }

  onMessage(callback) {
    this.client.addEventHandler( async (update) => {
      const msg = update.message

      const entity = {
        MessageEntityUnknown: 'unknown',
        MessageEntityMention: 'mention',
        MessageEntityHashtag: 'hashtag',
        MessageEntityBotCommand: 'bot_command',
        MessageEntityUrl: 'url',
        MessageEntityEmail: 'email',
        MessageEntityBold: 'bold', 
        MessageEntityItalic: 'italic',
        MessageEntityCode: 'code',
        MessageEntityPre: 'pre',
        MessageEntityTextUrl: 'test_url',
        MessageEntityMentionName: 'mention_name',
        InputMessageEntityMentionName: 'input_message_mentiom_name',
        MessageEntityPhone: 'phone',
        MessageEntityCashtag: 'cashtag',
        MessageEntityUnderline: 'underline',
        MessageEntityStrike: 'strike',
        MessageEntityBlockquote: 'blockquote',
        MessageEntityBankCard: 'bank_card',
        MessageEntitySpoiler: 'spoiler'
      }

      let ctx = {
        user: {
          id: Number(msg.senderId) 
        }, 
        chat: {
          id: msg.peerId.className == 'PeerChannel' ? Number(msg.peerId.channelId) : Number(msg.peerId.userId)
        },
        message: {
          id: msg.id,
          text: msg.message
        },
      }
      if (msg.replyTo != null) 
        ctx.reply = {
          id: msg.replyTo.replyToMsgId
        }

      if (msg.entities != null) {
        let entities = []
        for (let e of msg.entities) {
          let f = {
            type: entity[e.className],
            text: msg.message.substring(e.offset, e.offset + e.length),
            offset: e.offset,
            length: e.length
          }
          if (entity[e.className] == 'text_url')
            f.url = e.utl
          if (entity[e.className] == 'mention_name')
            f.user = {
              id: Number(e.userId)
            }
          entities.push(f)
        }
        ctx.entities = entities
      }

      callback(ctx, update)
    }, new NewMessage({}))
  }

  onMessageFromUser(users, callback) {
    this.client.addEventHandler( async (update) => {
      const isUser = 
        Array.isArray(users) == true ? 
        users.includes(update.message.senderId) : users == update.message.senderId

      const msg = update.message

      const entity = {
        MessageEntityUnknown: 'unknown',
        MessageEntityMention: 'mention',
        MessageEntityHashtag: 'hashtag',
        MessageEntityBotCommand: 'bot_command',
        MessageEntityUrl: 'url',
        MessageEntityEmail: 'email',
        MessageEntityBold: 'bold', 
        MessageEntityItalic: 'italic',
        MessageEntityCode: 'code',
        MessageEntityPre: 'pre',
        MessageEntityTextUrl: 'test_url',
        MessageEntityMentionName: 'mention_name',
        InputMessageEntityMentionName: 'input_message_mentiom_name',
        MessageEntityPhone: 'phone',
        MessageEntityCashtag: 'cashtag',
        MessageEntityUnderline: 'underline',
        MessageEntityStrike: 'strike',
        MessageEntityBlockquote: 'blockquote',
        MessageEntityBankCard: 'bank_card',
        MessageEntitySpoiler: 'spoiler'
      }

      let ctx = {
        user: {
          id: Number(msg.senderId) 
        }, 
        chat: {
          id: msg.peerId.className == 'PeerChannel' ? Number(msg.peerId.channelId) : Number(msg.peerId.userId)
        },
        message: {
          id: msg.id,
          text: msg.message
        },
      }
      if (msg.replyTo != null) 
        ctx.reply = {
          id: msg.replyTo.replyToMsgId
        }

      if (msg.entities != null) {
        let entities = []
        for (let e of msg.entities) {
          let f = {
            type: entity[e.className],
            text: msg.message.substring(e.offset, e.offset + e.length),
            offset: e.offset,
            length: e.length
          }
          if (entity[e.className] == 'text_url')
            f.url = e.utl
          if (entity[e.className] == 'mention_name')
            f.user = {
              id: Number(e.userId)
            }
          entities.push(f)
        }
        ctx.entities = entities
      }
      
      if (isUser)
        callback(ctx)
    }, new NewMessage({}))
  }

  cmd(triggers, callback) {
    this.client.addEventHandler( async (update) => {
      const isTrigger = 
        Array.isArray(triggers) == true ? 
        triggers.includes(update.message.message) : triggers == update.message.message      
      
      const msg = update.message

      let ctx = {
        user: {
          id: Number(msg.senderId) 
        }, 
        chat: {
          id: msg.peerId.className == 'PeerChannel' ? Number(msg.peerId.channelId) : Number(msg.peerId.userId)
        },
        message: {
          id: msg.id,
          text: msg.message
        },
      }
      if (msg.replyTo != null) 
        ctx.reply = {
          id: msg.replyTo.replyToMsgId
        }

      if (msg.entities != null) {
        let entities = []
        for (let e of msg.entities) {
          let f = {
            type: entity[e.className],
            text: msg.message.substring(e.offset, e.offset + e.length),
            offset: e.offset,
            length: e.length
          }
          if (entity[e.className] == 'text_url')
            f.url = e.utl
          if (entity[e.className] == 'mention_name')
            f.user = {
              id: Number(e.userId)
            }
          entities.push(f)
        }
        ctx.entities = entities
      }

      if (isTrigger)
        callback(ctx)
    },  new NewMessage({}))
  }

  command(triggers, callback) {
    this.client.addEventHandler( async (update) => {
      const isTrigger = 
        Array.isArray(triggers) == true ? 
        triggers.includes(update.message.message) : triggers == update.message.message      
 
      if (isTrigger)
        callback(update)
    },  new NewMessage({}))
  }

  commandForUsers(triggers, users, callback) {
    this.client.addEventHandler( async (update) => {
      const isTrigger = 
        Array.isArray(triggers) == true ? 
        triggers.includes(update.message.message) : triggers == update.message.message      
      const isUser = 
        Array.isArray(users) == true ? 
        users.includes(update.message.senderId) : users == update.message.senderId
        
      if (isTrigger && isUser)
        callback(update)
    },  new NewMessage({}))
  }
  
  sendFile(chatId, file, text = null, extra) {
    return this.client.sendFile(chatId, {
      file: file, 
      caption: text,
      ...extra
    })
  }
  forwardMessage(toChatId, fromChatId, messageId) {
    return this.client.forwardMessages(toChatId, {
      messages: messageId,
      fromPeer: fromChatId
    })
  }
  saveToFavorites(fromChatId, messageId) {
    return this.client.forwardMessages('me', {
      messages: messageId,
      fromPeer: fromChatId
    })
  }
  editMessage(chatId, messageId, text) {
    return this.client.editMessage(chatId, {
      message: messageId,
      text: text
    })
  }
  deleteMessages(chatId, messageId) {   
    messageId = 
      Array.isArray(messageId) == true ? 
      messageId : [messageId]
    return this.client.deleteMessages(chatId, messageId, {
      revoke: true
    })
  }
  pinMessage(chatId, messageId) {
    return this.client.pinMessage(chatId, messageId)
  }
  unpinMessage(chatId, messageId = null) {
    return this.client.unpinMessage(chatId, messageId)
  }
  async getDialogs(extra) {
    return await this.client.iterDialogs({
      ...extra
    })
  } 
  async getMembers(chatId, extra) {
    return await this.client.iterParticipants(chatId, {
      ...extra
    })
  } 
  async getMessages(chatId, extra) {
    return await this.client.iterMessages(chatId, {
      ...extra
    })
  } 
  async getMe() {
    return await this.client.getMe()
  } 
  async getEntity(id) {
    return await this.client.getEntity(id)
  } 
  async getInputEntity(id) {
    return await this.client.getInputEntity(id)
  } 
  async getPeerId(id) {
    return await this.client.getPeerId(id)
  } 
  */
}

module.exports = {
  Fuxo,
  input
}