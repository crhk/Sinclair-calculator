"use client";

import { Fragment, useEffect, useState } from "react";
import { useTeams } from "./hooks/useTeams";
import { calculateCJ } from "./lib/calculateCJ";
import { Team } from "./data/types";
import { calculateSinclair } from "./lib/sinclair";

const getClassName = (status: string) => {
  switch(status) {
    case 'good lift':
      return 'bg-green-600 font-semibold'
    case "no lift":
      return 'bg-red-600'
    case 'to do':
    default:
      return ''
  }
}

export default function Home() {
  const [url, setUrl] = useState<string | null>()
  const [data, setData] = useState<Team[] | null>(null)
  const { actualBestIWFTeam, projectedBestIWFTeam } = useTeams(data)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.stopPropagation()
    e.preventDefault()

    if (url) {
      const res = await fetch('/searchprod', {
        method: "POST",
        body: JSON.stringify({ url }),
        headers: {
          "Content-Type": "application/json"
        },
      })
  
      const data = await res.json()
      setData(data)
    }
  }

  if (!data) {
    return <form onSubmit={handleSubmit}>
      <label htmlFor="url">FFHM Scoresheet URL ou ID</label>
      <input type="text" id="url" name="url" onChange={(e) => setUrl(e.target.value)}/>
      <input type="submit" />
    </form>
  }

  return (
    <>
      <h1>LE CALCULATEUR DE LA VICTOIRE</h1>
      <table className='text-center'>
        <thead>
          <tr>
            <th>Nom</th>
            <th>PDC</th>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>Meilleur arraché</th>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>Meilleur EJ</th>
            <th>Total</th>
            <th>Points</th>
            <th>Suggestion EJ pour battre le meilleur total actuel</th>
            <th>Total projeté</th>
            <th>Suggestion EJ pour battre le meilleur total projeté</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length && data.map(elem => {
            const { team, players } = elem
            return <Fragment key={team.name}>
              <tr>
                <td colSpan={11} className='text-left font-extrabold'>
                {team.name}
                </td>
                <td colSpan={2} className='text-left'>
                  {team.total}
                </td>
                <td className='text-left'>
                  {Math.floor(players.reduce((current, { bw, snatches, cjs, sex }) => {
                    const maxSnatch = Math.max(...snatches.filter(({ status }) => status === 'good lift' || status === 'to do').map(({ weight }) => weight))
                    const maxCJ = Math.max(...cjs.filter(({ status }) => status === 'good lift' || status === 'to do').map(({ weight }) => weight))
    
                    const total = maxSnatch + maxCJ
    
                    const sinclair = calculateSinclair(total, bw, sex)
                    return current + sinclair
                  }, 0 )*100) / 100}
                </td>
              </tr>
              {players.map(player => {
                const { name, bw, snatches, cjs, sex } = player
                const maxSnatch = Math.max(...snatches.filter(({ status }) => status === 'good lift').map(({ weight }) => weight))
                const maxCJ = Math.max(...cjs.filter(({ status }) => status === 'good lift').map(({ weight }) => weight))

                const total = maxSnatch + maxCJ

                const sinclair = calculateSinclair(total, bw, sex)

                return <tr key={name}>
                  <td>{name}</td>
                  <td>{bw}</td>
                  {snatches.map(({ weight, status }) => {
                    return <td key={`snatch-${weight}-${status}`} className={getClassName(status)}>
                      {weight}
                    </td>
                  })}
                  <td className='font-extrabold'>{maxSnatch}</td>
                  {cjs.map(({ weight, status }) => {
                    return <td key={`cj-${weight}-${status}`} className={getClassName(status)}>
                      {weight}
                    </td>
                  })}
                  <td className='font-extrabold'>{maxCJ}</td>
                  <td>{total}</td>
                  <td>{sinclair}</td>
                  <td>
                    {cjs.filter(({ status }) => status === 'to do').length < 1 ? 'finito pipo': calculateCJ(actualBestIWFTeam, elem, player, cjs.filter(({ status }) => status === 'to do')[0].weight)}
                  </td>
                  <td></td>
                  <td>
                    {cjs.filter(({ status }) => status === 'to do').length < 1 ? 'finito pipo': calculateCJ(projectedBestIWFTeam, elem, player, cjs.filter(({ status }) => status === 'to do')[0].weight)}
                  </td>
                </tr>
              }
              )}
            </Fragment>
          })}
          <tr></tr>
        </tbody>
      </table>
    </>
  );
}
