import {Message, MessageType} from "node-telegram-bot-api";

require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')

const token = process.env.TOKEN
const bot = new TelegramBot(token, {polling: true})

type State = {
    name: string,
    stages: Array<string>,
}

const gameCreationState: State = {
    name: 'gameCreation',
    stages: ['default', 'name', 'level']
};


type UserState = {
    state: State;
    stage: number;
} | undefined

class User {
    public id: string | number;
    public name: string;
    public username: string;
    private position: UserState= {
        state: {name:'d', stages:['s']},
        stage: 0
    }; // TODO: Rename
    public data: UserData = {
        gameCreation: {}
    }

    constructor(id, name, username) {
        this.id = id
        this.name = name
        this.username = username;
    }

    get currentState() {
        return this.position.state.name
    }

    get currentStage() {
        return this.position.state.stages[this.position.stage]
    }

    set newState(state: State) {
        this.position = {
            state: state,
            stage: 0,
        }
    }

    stateUp = () => {
        this.position.stage += 1
    }
}

const userList: Array<User> = [];

bot.on("text", (msg) => {
    !userList.find(i => i.id === msg.from.id)
    && userList.push(new User(msg.from.id, msg.from.first_name, msg.from.username))
    const user = userList.find(i => i.id === msg.from.id)

    mainSwitch(user, msg)

})

const mainSwitch = (user: User, msg: Message) => {
    console.log(user.currentState)
    switch (user.currentState) {
        case 'gameCreation':
            gameCreation(user, msg)
            break
        default:
            bot.sendMessage(user.id, 'Что вы хотите сделать?', startOptions)
    }
}

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

type UserData = {
    gameCreation: {
        [P in keyof Game]?: Game[P];
    }
}

