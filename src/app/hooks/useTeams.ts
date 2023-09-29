import { data } from "../data/data";
import { coefficients } from "../data/coefficients";

import { useEffect, useState } from "react"

export const useTeams = () => {
    const [actualBestIWFTeam, setActualBestIWFTeam] = useState<number>(0)
    const [projectedBestIWFTeam, setProjectedBestIWFTeam] = useState<number>(0)

    useEffect(() => {
        data.forEach(({ team, players }) => {
            setActualBestIWFTeam(prev => team.total > prev ? team.total : prev )

            const projectedTeamTotal = Math.round(players.reduce((current, { bw, snatches, cjs }) => {
                const maxSnatch = Math.max(...snatches.filter(({ status }) => status === 'good lift' || status === 'to do').map(({ weight }) => weight))
                const maxCJ = Math.max(...cjs.filter(({ status }) => status === 'good lift' || status === 'to do').map(({ weight }) => weight))

                const total = maxSnatch + maxCJ

                const sinclair = Math.floor(total*coefficients[bw]*100) / 100
                return current + sinclair
              }, 0 )*100) / 100

              setProjectedBestIWFTeam(prev => projectedTeamTotal > prev ? projectedTeamTotal : prev)
        });
    }, [])

    return {
        actualBestIWFTeam,
        projectedBestIWFTeam
    }

}