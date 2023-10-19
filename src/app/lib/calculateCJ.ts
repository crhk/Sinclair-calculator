import { Player, Team } from "../data/types";
import { calculateSinclair } from "./sinclair";

export const calculateCJ = (IWFToBeat: number, team: Team, player: Player, projectedCJ: number): number => {
    if (IWFToBeat === 0) {
        return 0
    }

    const teamTotal = team.team.total
    const { snatches, cjs, bw, sex } = player

    const maxSnatch = Math.max(...snatches.filter(({ status }) => status === 'good lift').map(({ weight }) => weight))
    const maxCJ = Math.max(...cjs.filter(({ status }) => status === 'good lift').map(({ weight }) => weight))

    const actualTotal = maxSnatch + maxCJ
    const projectedTotal = maxSnatch + projectedCJ
    const actualSinclair = calculateSinclair(actualTotal, bw, sex)
    const projectedSinclair = calculateSinclair(projectedTotal, bw, sex)

    const teamTotalWithoutPlayer = teamTotal - actualSinclair
    const projectedTeamTotal = teamTotalWithoutPlayer + projectedSinclair

    if (projectedTeamTotal > IWFToBeat) {
        return projectedCJ
    }

    return calculateCJ(IWFToBeat, team, player, projectedCJ+1)
}