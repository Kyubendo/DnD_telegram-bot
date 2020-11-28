import * as moment from 'moment'

export type QuestionState = {
    name: string,
    stages: Array<{
        stage: string,
        message: string,
        validation?: (value: string) => boolean,
        errorMessage?: string
    }>,
}

export const defaultState: QuestionState = {
    name: 'default',
    stages: [{stage: 'default', message: 'default'}], // ??
};

export const gameCreationState: QuestionState = {
    name: 'gameCreation',
    stages: [
        {stage: 'name', message: 'Введите название кампании'},
        {
            stage: 'level', message: 'Для игроков какого уровня предназначена кампания?',
            validation: (v) => Array.from({length: 20}, (_, i) => ++i).includes(+v),
            errorMessage: 'Напишите уровень числом от 1 до 20.'
        },
        {stage: 'setting', message: 'В каком сеттинге будет проходить кампания?'},
        {
            stage: 'time', message: 'Время?',
            validation: (v) => moment(v, 'DD.MM.YYYY') >= moment().startOf('day'),
            errorMessage: 'Дата дожна быть в формате dd.mm.yyyy и не меньше сегоднешней.'
        },
        {
            stage: 'playersNumber', message: 'На сколько игроков расчитана кампания?',
            validation: (v) => +v>0,
            errorMessage: 'Количество игроков должно быть числом, которое больше нуля.'
        },
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
