import {Player} from "./Player";
import {User} from "./User";

export type Game = {
    id: number,
    name: string,
    gm: string, // to User
    level: number,
    setting: string | undefined,
    time: string,
    playersNumber: number,
    players: Array<Player>
}
