export type QuestionState = {
    name: string,
    stages: Array<{ stage: string, message: string, errorMessage?: string }>,
}

export const defaultState: QuestionState = {
    name: 'default',
    stages: [{stage: 'default', message: 'default'}], // ??
};

export const gameCreationState: QuestionState = {
    name: 'gameCreation',
    stages: [
        {stage: 'name', message: 'Введите название кампании'},
        {stage: 'level', message: 'Для игроков какого уровня предназначена кампания?'},
        {stage: 'setting', message: 'В каком сеттинге будет проходить кампания?'},
        {stage: 'time', message: 'Время?'},
        {stage: 'playersNumber', message: 'На сколько игроков расчитана кампания?'},
        {stage: 'end', message: 'gameCreationState end stage'},
    ]
};

export const singUpState: QuestionState = {
    name: 'singUp',
    stages: [
        {stage: 'class', message: 'За какой класс будете играть?'},
        {stage: 'race', message: 'Раса?'},
        {stage: 'end', message: 'gameCreationState end stage'},
    ]
};
