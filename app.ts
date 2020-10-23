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
            msg.text && bot.sendMessage(user.id, `Ваша кампания называется "${msg.text}".`)
                .then(() => { // extract to function
                    user.data.game.name = msg.text
                    user.stateUp()
                    bot.sendMessage(user.id, `Для игроков какого уровня предназначена кампания?`)
                })
            break
        case 'level':
            +msg.text in Array.from({length: 20}, (_, i) => ++i)
                ? bot.sendMessage(user.id, `Хорошо, игроки будут ${+msg.text}-го уровня.`)
                    .then(()=>{
                        user.data.game.level = +msg.text
                        user.stateUp()
                        bot.sendMessage(user.id, `В каком сеттинге будет проходить кампания?`)
                    })
                : bot.sendMessage(user.id, `Такого уровня не существует!`)
    }
}
