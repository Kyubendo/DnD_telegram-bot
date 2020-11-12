import {Message} from "node-telegram-bot-api";
import {User} from "./User";
import {defaultState, gameCreationState, singUpState} from "./States";
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

const mainSwitch = (user: User, msg: Message) => { //rename
    console.log(user.currentStage)
    try {
        user.currentState === 'default'
            ? bot.sendMessage(user.id, 'Что вы хотите сделать?', startOptions)
            : create(user, msg, user.currentState)
    } catch (e) {
        console.log(e)
    }

}

bot.on('callback_query', (msg) => { // link with state
    const user = userList.find(i => i.id === msg.from.id)
    switch (msg.data) {
        case 'gameCreation':
            user.newState = gameCreationState
            mainSwitch(user, msg)
            break
        case 'signUp':
            user.newState = singUpState
            mainSwitch(user, msg)
            break
    }
})

const create = (user: User, msg: Message, creationType) => { // rename
    if (user.previousStage) user.data[creationType][user.previousStage.stage] = msg.text
    user.currentStage.stage !== 'end' ? bot.sendMessage(user.id, user.currentStage.message)
            .then(() => user.stateUp())
        : bot.sendMessage(user.id, 'Готово!')
            .then(() => user.resetState())
}