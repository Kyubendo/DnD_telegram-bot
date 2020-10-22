require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')

const token = process.env.TOKEN
const bot = new TelegramBot(token, {polling: true})

class User {
    public id: string | number;
    public name: string;
    public username: string;
    public state: string = null;

    constructor(id, name, username) {
        this.id = id
        this.name = name
        this.username = username;
    }
}

const userList: Array<User> = [];

bot.on("text", (msg) => {
    !userList.find(i => i.id === msg.from.id)
    && userList.push(new User(msg.from.id, msg.from.first_name, msg.from.username))
    const user = userList.find(i => i.id === msg.from.id)

    switch (user.state) {
        case 'gameCreation_name':
            bot.sendMessage(user.id, `Ваша кампания называется "${msg.text}"`)
            break
        default:
            bot.sendMessage(user.id, 'Что вы хотите сделать?', startOptions)
    }


})

const startOptions = {
    reply_markup: {
        inline_keyboard: [
            [{text: 'Список кампаний', callback_data: 'gameList'}],
            [{text: 'Записаться в кампанию', callback_data: 'signUp'}],
            [{text: 'Создать новую кампанию', callback_data: 'createGame'}],
            [{text: 'Мои кампании', callback_data: 'myGames'}],
        ]
    }
}

bot.on('callback_query', (msg) => {
    const user = userList.find(i => i.id === msg.from.id)
    switch (msg.data) {
        case 'createGame':
            gameCreation(user)
            break
        case 'signUp':
            break
    }
})

const gameCreation = (user: User) => {
    bot.sendMessage(user.id, 'Введите название игры')
        .then(user.state = 'gameCreation_name')
}

// TODO: move


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


