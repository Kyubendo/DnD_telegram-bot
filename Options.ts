export const startOptions = {
    reply_markup: {
        inline_keyboard: [
            [{text: 'Список кампаний', callback_data: 'gameList'}],
            [{text: 'Записаться в кампанию', callback_data: 'signUp'}],
            [{text: 'Создать новую кампанию', callback_data: 'createGame'}],
            [{text: 'Мои кампании', callback_data: 'myGames'}],
        ]
    }
}