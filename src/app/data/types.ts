export type Status = 'to do' | 'good lift' | 'no lift'

interface Attempt {
    weight: number
    status: Status
}

export type Sex = 'M' | 'F'

export interface Player {
    name: string
    snatches: Attempt[]
    cjs: Attempt[]
    bw: number
    sex: Sex
}

export interface Team {
    team: { name: string, total: number }
    players: Player[]
}