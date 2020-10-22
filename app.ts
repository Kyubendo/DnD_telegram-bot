require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')

const token = process.env.TOKEN
const bot = new TelegramBot(token, {polling: true})

type Game = {
    id: number,
    name: string,
    level: string,
    setting: string | undefined,
    time: string,
    playersNumber: number,
    players: Array<Player>
}

type Player = {
    name: string,
    alias: string,
    class: string | undefined,
}

const startOptions = {
    reply_markup: {
        inline_keyboard: [
            [{text: 'Создать новую кампанию', callback_data: 'createGame'}],
            [{text: 'Записаться в кампанию', callback_data: 'signUp'}],
            [{text: 'Редактировать кампанию', callback_data: 'editGame'}],
            [{text: 'Удалить кампанию', callback_data: 'deleteGame'}]
        ]
    }
}

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Что вы хотите сделать?', startOptions)
})

bot.on('callback_query', (msg) => {
    bot.sendMessage(msg.from.id, msg.data)
    switch (msg.data) {
        case 'createGame':
            gameCreation(msg.from.id)
            break
        case 'signUp':
            break
    }
})

const gameCreation = (chatId) => {
    bot.sendMessage(chatId, 'Введите название игры')
}
