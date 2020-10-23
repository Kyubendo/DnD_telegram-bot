import {Message} from "node-telegram-bot-api";
import {User} from "./User";
import {gameCreationState} from "./States";
import {startOptions} from "./Options";

require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TOKEN
const bot = new TelegramBot(token, {polling: true})

const userList: Array<User> = [];

bot.on("text", (msg) => {
    !userList.find(i => i.id === msg.from.id)
    && userList.push(new User(msg.from.id, msg.from.first_name, msg.from.username))
    const user = userList.find(i => i.id === msg.from.id)

    mainSwitch(user, msg)
})

const mainSwitch = (user: User, msg: Message) => {
    switch (user.currentState) {
        case 'gameCreation':
            gameCreation(user, msg)
            break
        default:
            bot.sendMessage(user.id, 'Что вы хотите сделать?', startOptions)
    }
}

bot.on('callback_query', (msg) => { // link with state
    const user = userList.find(i => i.id === msg.from.id)
    switch (msg.data) {
        case 'createGame':
            user.newState = gameCreationState
            mainSwitch(user, msg)
            break
        case 'signUp':
            break
    }
})

const gameCreation = (user: User, msg: Message) => {
    switch (user.currentStage) {
        case 'default':
            bot.sendMessage(user.id, 'Введите название кампании').then(user.stateUp())
            break
        case 'name':
            bot.sendMessage(user.id, `Ваша кампания называется ${msg.text}`)
            break
    }
}
