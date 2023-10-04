import { useEffect, useState } from "react"
import { Team } from "../data/types";
import { calculateSinclair } from "../lib/sinclair";

export const useTeams = (data: Team[] | null) => {
    const [actualBestIWFTeam, setActualBestIWFTeam] = useState<number>(0)
    const [projectedBestIWFTeam, setProjectedBestIWFTeam] = useState<number>(0)

    useEffect(() => {
        if (!data) {
            return
        }

        data.forEach(({ team, players }) => {
            setActualBestIWFTeam(prev => team.total > prev ? team.total : prev )

            const projectedTeamTotal = Math.floor(players.reduce((current, { bw, snatches, cjs, sex }) => {
                const maxSnatch = Math.max(...snatches.filter(({ status }) => status === 'good lift' || status === 'to do').map(({ weight }) => weight))
                const maxCJ = Math.max(...cjs.filter(({ status }) => status === 'good lift' || status === 'to do').map(({ weight }) => weight))

                const total = maxSnatch + maxCJ

                const sinclair = calculateSinclair(total, bw, sex)
                return current + sinclair
              }, 0 )*100) / 100

              setProjectedBestIWFTeam(prev => projectedTeamTotal > prev ? projectedTeamTotal : prev)
        });
    }, [data])

    return {
        actualBestIWFTeam,
        projectedBestIWFTeam
    }

}