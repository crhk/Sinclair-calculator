import { Fragment } from "react";
import { Status, data } from "./data/data";
import { coefficients } from "./data/coefficients";

const getClassName = (status: string) => {
  switch(status) {
    case 'good lift':
      return 'text-green-600 font-semibold'
    case "no lift":
      return 'text-red-600'
    case 'to do':
    default:
      return ''
  }
}

export default function Home() {
  return (
    <>
      <h1>LE CALCULATEUR DE LA VICTOIRE</h1>
      <table>
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
            <th>Suggestion EJ</th>
            <th>Total projeté</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ teamName, players }) => {
            return <Fragment key={teamName}>
              <tr>
                <td colSpan={11}>
                {teamName}
                </td>
                <td>
                  {Math.floor(players.reduce((current, { bw, snatches, cjs }) => {
                    const maxSnatch = Math.max(...snatches.filter(({ status }) => status === 'good lift').map(({ weight }) => weight))
                    const maxCJ = Math.max(...cjs.filter(({ status }) => status === 'good lift').map(({ weight }) => weight))
    
                    const total = maxSnatch + maxCJ
    
                    const sinclair = Math.floor(total*coefficients[bw]*100) / 100
                    return current + sinclair
                  }, 0 )*100) / 100}
                </td>
              </tr>
              {players.map(({ name, bw, snatches, cjs }) => {
                const maxSnatch = Math.max(...snatches.filter(({ status }) => status === 'good lift').map(({ weight }) => weight))
                const maxCJ = Math.max(...cjs.filter(({ status }) => status === 'good lift').map(({ weight }) => weight))

                const total = maxSnatch + maxCJ

                const sinclair = Math.floor(total*coefficients[bw]*100) / 100

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
                    {cjs.filter(({ status }) => status === 'to do').length < 1 ? 'finito pipo': 'calcul potentiel'}
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
