import {defaultState, QuestionState} from "./States";
import {Game} from "./Game";
import {Player} from "./Player";

export type UserState = { // refactor to class?
    state: QuestionState
    stage: number
}

export type UserData = {
    gameCreation: {
        [P in keyof Game]?: Game[P];
    }
    singUp: {
        [P in keyof Player]?: Player[P];
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
        gameCreation: {},
        singUp: {},
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

    get nextStage() {
        return this.position.state.stages[this.position.stage + 1]
    }

    get previousStage() {
        return this.position.state.stages[this.position.stage - 1]
    }

    set newState(state: QuestionState) {
        this.position = {
            state: state,
            stage: 0,
        }
    }

    resetState() {
        this.newState = defaultState
    }

    stateUp = () => {
        this.position.state.stages[this.position.stage + 1] ? this.position.stage += 1 : console.log('error')
    }
}

