export type Game = {
    id: number,
    name: string,
    level: number,
    setting: string | undefined,
    time: string,
    playersNumber: number,
    players: Array<Player>
}

export type Player = {
    name: string,
    alias: string,
    class: string | undefined,
}



