import {Player} from "./Player";

export type Game = {
    id: number,
    name: string,
    level: number,
    setting: string | undefined,
    time: string,
    playersNumber: number,
    players: Array<Player>
}
