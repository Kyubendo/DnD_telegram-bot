import {defaultState, State} from "./States";
import {Game} from "./Game";

export type UserState = { // refactor to class?
    state: State
    stage: number
}

export type UserData = {
    gameCreation: {
        [P in keyof Game]?: Game[P];
    }
}

export const defaultUserState: UserState = {
    state: defaultState,
    stage: 0,
}

export class User {
    public id: string | number
    public name: string
    public username: string
    private position: UserState = defaultUserState
    public data: UserData = {
        gameCreation: {}
    } // change to default constant

    constructor(id, name, username) {
        this.id = id
        this.name = name
        this.username = username
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
        this.position.state.stages[this.position.stage + 1] ? this.position.stage += 1 : console.log('error')
    }
}

