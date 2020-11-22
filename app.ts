import {Message} from "node-telegram-bot-api";
import {User} from "./User";
import {defaultState, gameCreationState, singUpState} from "./States";
import {startOptions} from "./Options";
import * as sqlite3 from "sqlite3";
import {Game} from "./Game";

require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TOKEN
const bot = new TelegramBot(token, {polling: true})

const userList: Array<User> = [];


const db = new sqlite3.Database('./db/database.db', e => console.log(e))
db.run(`create table if not exists game
        (
            id            integer primary key,
            name          varchar(24) not null,
            gm            integer     not null references gm (id),
            level         int         not null,
            setting       varchar(36),
            time          date,
            playersNumber int
        )`)
db.run(`
    create table if not exists "user"
    (
        id         integer primary key,
        name       varchar(32) not null,
        alias      varchar(32),
        telegramId bigint      not null
    )`)
db.run(`
    create table if not exists player
    (
        userId integer references "user" (id),
        gameId integer references game (id),
        class  varchar(32),
        race   varchar(32),
        primary key (userId, gameId)
    )`)
db.run(`
    create table if not exists gm
    (
        id     integer primary key,
        userId integer references "user" (id)
    )`)

bot.on("text", (msg) => {
    !userList.find(i => i.id === msg.from.id)
    && userList.push(new User(msg.from.id, msg.from.first_name, msg.from.username))
    const user = userList.find(i => i.id === msg.from.id)

    mainSwitch(user, msg)
})

const mainSwitch = (user: User, msg: Message) => { //rename
    try {
        user.currentState === 'default'
            ? bot.sendMessage(user.id, 'Что вы хотите сделать?', startOptions)
            : creationObject[user.currentState](user, msg)
    } catch (e) {
        console.log(e)
    }

}

const gameListQueryToMessage = (queryResult: Array<Game>) =>
    queryResult.map(i => `
**${i.name}**
Уровень ${i.level} ()
Сеттинг: ${i.setting}
Время — ${i.time} 14:00
ГМ: ${i.gm}
Игроки:
`).join('')


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
        case 'gameList':
            db.all(`select *
                    from game`, (err, res) => bot.sendMessage(user.id,
                gameListQueryToMessage(res), {parse_mode: "Markdown"})
            )
    }
})

const create = (user: User, msg: Message) => { // rename
    if (user.previousStage) user.data[user.currentState][user.previousStage.stage] = msg.text
    user.currentStage.stage !== 'end' ? bot.sendMessage(user.id, user.currentStage.message)
            .then(() => user.stateUp())
        : bot.sendMessage(user.id, 'Готово!')
            .then(() => {
                console.log(Object.keys(user.data[user.currentState]).map(i =>
                    user.data[user.currentState][i]).join())
                db.run(`insert into game(gm, name, level, setting, time, "playersNumber")
                        values (
                                '${Object.keys(user.data[user.currentState]).map(i =>
                    user.data[user.currentState][i]).join("', '")}'
                                )`)
            })
            .then(() => user.resetState())
}


const creationObject = { //rename
    gameCreation: (user: User, msg: Message) => {
        user.data.gameCreation.gm = user.name
        create(user, msg)
    },
    singUp: (user: User, msg: Message) => {
        user.data.singUp.name = user.name
        create(user, msg)
    },
}
