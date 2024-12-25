import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium-min";

import puppeteer, { ElementHandle } from "puppeteer-core";

const getStatus = (status: string) => {
  switch (status) {
    case "attempt_1":
      return "good lift";
    case "attempt_2":
      return "no lift";
    case "attempt_0":
    default:
      return "to do";
  }
};

const formatLifts = async (lifts: ElementHandle<HTMLTableCellElement>[]) =>
  await Promise.all(
    lifts.map(async (lift: ElementHandle<HTMLTableCellElement>) => {
      const liftDiv = await lift.$("div");
      if (liftDiv) {
        const liftStatus = await liftDiv
          .getProperty("className")
          .then((cn) => cn.jsonValue());
        const liftNumber = await liftDiv.$eval(
          "strong",
          (node) => node.innerText
        );

        if (liftStatus && liftNumber) {
          return {
            weight: parseInt(liftNumber),
            status: getStatus(liftStatus),
          };
        }
      }
    })
  );

export async function POST(request: Request) {
  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

  const browser = await puppeteer.launch({
    args: isLocal ? puppeteer.defaultArgs() : chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.CHROME_EXECUTABLE_PATH,
    headless: chromium.headless,
  });

  const { url } = await request.json();

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto(
    `http://scoresheet.ffhaltero.fr/scoresheet/team/competition/view/${url}`
  );

  const isClosed = await page.$("#printButton");
  const resultTable = await page.$(
    `.event-box ${isClosed ? "tbody" : "table"}`
  );

  const data: any[] = [];

  if (resultTable) {
    const allRows = await resultTable.$$(`${isClosed ? "tr" : "tbody"}`);
    if (allRows) {
      for (const row of allRows) {
        await row
          .$eval("div > font > strong", (n) => n.innerText)
          .then(async (teamName) => {
            const teamPoints = await row
              .$eval("td > font > strong", (n) => n.innerText)
              .catch((error) => console.error(error.message));
            data.push({
              team: {
                name: teamName,
                total: teamPoints,
              },
              players: [],
            });
          })
          .catch(async (error) => {
            const player = await row.$$("td");

            if (player && player.length) {
              const name = await (
                await player[1].getProperty("innerText")
              ).jsonValue();
              const bw = await (
                await player[5].getProperty("innerText")
              ).jsonValue();
              const sex = await (
                await player[16].getProperty("innerText")
              ).jsonValue();
              const formatPlayer = {
                name,
                bw: parseFloat(bw.replace(",", ".")),
                snatches: await formatLifts(player.slice(6, 9)),
                cjs: await formatLifts(player.slice(10, 13)),
                sex: sex.includes("M") ? "M" : "F",
              };

              const lastIndex = data.length - 1;
              data[lastIndex].players.push(formatPlayer);
            }
          });
      }
    }
  }

  await browser.close();

  return NextResponse.json(data);
}
