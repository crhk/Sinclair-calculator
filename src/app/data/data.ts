export type Status = 'to do' | 'good lift' | 'no lift'

interface Attempt {
    weight: number
    status: Status
}

interface Player {
    name: string
    snatches: Attempt[]
    cjs: Attempt[]
    bw: number
}

interface Team {
    teamName: string
    players: Player[]
}

interface TableData {
    data: Team[]
}

export const data = [
    {
        teamName: 'RBC',
        players: [
            {
                name: 'Allan MOUSSET',
                bw: 61.50,
                snatches: [{ weight: 76, status: 'good lift' }, { weight: 80, status: 'no lift' }, { weight: 83, status: 'good lift' }],
                cjs: [{ weight: 94, status: 'good lift' }, { weight: 101, status: 'good lift' }, { weight: 106, status: 'no lift' }],
            },
            {
                name: 'Théau CAVILLON',
                bw: 70.90,
                snatches: [{ weight: 87, status: 'no lift' }, { weight: 87, status: 'good lift' }, { weight: 92, status: 'good lift' }],
                cjs: [{ weight: 112, status: 'good lift' }, { weight: 118, status: 'good lift' }, { weight: 123, status: 'no lift' }],
            },
            {
                name: 'Lucas LETACONNOUX',
                bw: 79.70,
                snatches: [{ weight: 90, status: 'good lift' }, { weight: 100, status: 'good lift' }, { weight: 103, status: 'no lift' }],
                cjs: [{ weight: 110, status: 'good lift' }, { weight: 120, status: 'good lift' }, { weight: 125, status: 'no lift' }],
            },
            {
                name: 'Mathias DIXNEUF',
                bw: 87.20,
                snatches: [{ weight: 105, status: 'good lift' }, { weight: 110, status: 'no lift' }, { weight: 112, status: 'good lift' }],
                cjs: [{ weight: 125, status: 'good lift' }, { weight: 130, status: 'good lift' }, { weight: 135, status: 'good lift' }],
            },
            {
                name: 'Mathieu TANG',
                bw: 88.10,
                snatches: [{ weight: 92, status: 'good lift' }, { weight: 97, status: 'good lift' }, { weight: 102, status: 'no lift' }],
                cjs: [{ weight: 122, status: 'good lift' }, { weight: 133, status: 'good lift' }, { weight: 138, status: 'to do' }],
            },
        ]
    },
    {
        teamName: 'CJF LAVAL VOUTRE HALTERO 53',
        players: [
            {
                name: 'ROGUET Thomas',
                bw: 80.10,
                snatches: [{ weight: 82, status: 'good lift' }, { weight: 85, status: 'good lift' }, { weight: 87, status: 'good lift' }],
                cjs: [{ weight: 105, status: 'good lift' }, { weight: 108, status: 'good lift' }, { weight: 110, status: 'good lift' }],
            },
            {
                name: 'TERRIER Killian',
                bw: 82.80,
                snatches: [{ weight: 100, status: 'no lift' }, { weight: 105, status: 'no lift' }, { weight: 105, status: 'good lift' }],
                cjs: [{ weight: 125, status: 'good lift' }, { weight: 130, status: 'good lift' }, { weight: 135, status: 'no lift' }],
            },
            {
                name: 'COGNON Theo',
                bw: 76.70,
                snatches: [{ weight: 103, status: 'good lift' }, { weight: 107, status: 'good lift' }, { weight: 110, status: 'good lift' }],
                cjs: [{ weight: 130, status: 'good lift' }, { weight: 135, status: 'good lift' }, { weight: 138, status: 'good lift' }],
            },
            {
                name: 'COGNON Jonathan',
                bw: 79.90,
                snatches: [{ weight: 103, status: 'no lift' }, { weight: 103, status: 'good lift' }, { weight: 107, status: 'good lift' }],
                cjs: [{ weight: 130, status: 'good lift' }, { weight: 135, status: 'good lift' }, { weight: 138, status: 'good lift' }],
            },
            {
                name: 'DUCHEMANE Nelson',
                bw: 100.10,
                snatches: [{ weight: 95, status: 'good lift' }, { weight: 100, status: 'good lift' }, { weight: 102, status: 'no lift' }],
                cjs: [{ weight: 115, status: 'good lift' }, { weight: 122, status: 'good lift' }, { weight: 126, status: 'to do' }],
            },
        ]
    }
]