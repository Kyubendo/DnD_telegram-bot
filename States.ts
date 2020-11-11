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
        {stage: 'end', message: 'gameCreationState end stage'},
    ]
};

