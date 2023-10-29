"use client";

import { Fragment, useEffect, useState } from "react";
import { useTeams } from "../hooks/useTeams";
import { calculateCJ } from "../lib/calculateCJ";
import { Team } from "../data/types";
import { calculateSinclair } from "../lib/sinclair";
import { sample1 } from "@/app/test/data/sample1";

const getClassName = (status: string) => {
  switch (status) {
    case "good lift":
      return "bg-green-600 font-semibold";
    case "no lift":
      return "bg-red-600";
    case "to do":
    default:
      return "";
  }
};

const test = true;

export default function Page({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Team[] | null>(test ? sample1 : null);
  const { actualBestIWFTeam, projectedBestIWFTeam } = useTeams(data);

  useEffect(() => {
    // const fetchData = async () => {
    //   const res = await fetch("/api", {
    //     method: "POST",
    //     body: JSON.stringify({ url: params.id }),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });
    //   const data = await res.json();
    //   setData(data);
    // };
    // fetchData();
  }, [params.id]);

  if (!data) {
    return <>de la merde ton id</>;
  }

  return (
    <>
      <h1>LE CALCULATEUR DE LA VICTOIRE</h1>
      <table className="text-center">
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
          {data &&
            data.length &&
            data.map((elem) => {
              const { team, players } = elem;
              return (
                <Fragment key={team.name}>
                  <tr>
                    <td colSpan={11} className="text-left font-extrabold">
                      {team.name}
                    </td>
                    <td colSpan={2} className="text-left">
                      {team.total}
                    </td>
                    <td className="text-left">
                      {Math.floor(
                        players.reduce(
                          (current, { bw, snatches, cjs, sex }) => {
                            const maxSnatch = Math.max(
                              ...snatches
                                .filter(
                                  ({ status }) =>
                                    status === "good lift" || status === "to do"
                                )
                                .map(({ weight }) => weight)
                            );
                            const maxCJ = Math.max(
                              ...cjs
                                .filter(
                                  ({ status }) =>
                                    status === "good lift" || status === "to do"
                                )
                                .map(({ weight }) => weight)
                            );

                            const total = maxSnatch + maxCJ;

                            const sinclair = calculateSinclair(total, bw, sex);
                            return current + sinclair;
                          },
                          0
                        ) * 100
                      ) / 100}
                    </td>
                  </tr>
                  {players.map((player) => {
                    const { name, bw, snatches, cjs, sex } = player;
                    const maxSnatch = Math.max(
                      ...snatches
                        .filter(({ status }) => status === "good lift")
                        .map(({ weight }) => weight),
                      0
                    );
                    const maxCJ = Math.max(
                      ...cjs
                        .filter(({ status }) => status === "good lift")
                        .map(({ weight }) => weight),
                      0
                    );

                    const total = maxSnatch + maxCJ;

                    const sinclair = calculateSinclair(total, bw, sex);

                    return (
                      <tr key={name}>
                        <td>{name}</td>
                        <td>{bw}</td>
                        {snatches.map(({ weight, status }, index) => {
                          return (
                            <td
                              key={`snatch-${weight}-${status}-${index}`}
                              className={getClassName(status)}
                            >
                              {weight}
                            </td>
                          );
                        })}
                        <td className="font-extrabold">{maxSnatch}</td>
                        {cjs.map(({ weight, status }, index) => {
                          return (
                            <td
                              key={`cj-${weight}-${status}-${index}`}
                              className={getClassName(status)}
                            >
                              {weight}
                            </td>
                          );
                        })}
                        <td className="font-extrabold">{maxCJ}</td>
                        <td>{total}</td>
                        <td>{sinclair}</td>
                        <td>
                          {cjs.filter(({ status }) => status === "to do")
                            .length < 1
                            ? "finito pipo"
                            : calculateCJ(
                                actualBestIWFTeam,
                                elem,
                                player,
                                cjs.filter(
                                  ({ status }) => status === "to do"
                                )[0].weight
                              )}
                        </td>
                        <td></td>
                        <td>
                          {cjs.filter(({ status }) => status === "to do")
                            .length < 1
                            ? "finito pipo"
                            : calculateCJ(
                                projectedBestIWFTeam,
                                elem,
                                player,
                                cjs.filter(
                                  ({ status }) => status === "to do"
                                )[0].weight
                              )}
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              );
            })}
          <tr></tr>
        </tbody>
      </table>
    </>
  );
}
