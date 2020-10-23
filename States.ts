export type State = {
    name: string,
    stages: Array<string>,
}

export const defaultState: State = {
    name: 'default',
    stages: ['default']
};

export const gameCreationState: State = {
    name: 'gameCreation',
    stages: ['default', 'name', 'level']
};


