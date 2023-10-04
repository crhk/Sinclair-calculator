import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

const formatLifts = (lifts: string[]) => lifts.map((lift: string) => ({
        weight: parseInt(lift),
        status: parseInt(lift) > 0 ? 'good lift' : 'no lift'
    }))


export async function POST(request: Request) {
    const { url } = await request.json()
    const browser = await puppeteer.launch({ headless: 'new' });

    // Create a page
    const page = await browser.newPage();
  
    // Go to your site
    await page.goto(`http://scoresheet.ffhaltero.fr/scoresheet/team/competition/view/${url}`);

    const resultTable = await page.$('.event-box tbody')

    const data: any[] = []

    if (resultTable) {
        const allRows = await resultTable.$$('tr')
        if (allRows) {
            for (const row of allRows) {
                await row.$eval('div > font > strong', n => n.innerText)
                .then(async (teamName) => {
                    const teamPoints = await row.$eval('td > font > strong', n => n.innerText).catch(error => console.error(error.message));
                    data.push({
                        team: {
                            name: teamName,
                            total: teamPoints
                        },
                        players: []
                    })
                })
                .catch(async (error) => {
                    const player = await row.$$eval('td', nodes => nodes.map(node => node.innerText))

                    if (player && player.length) {
                        const formatPlayer = {
                            name: player[1],
                            bw: parseFloat(player[5].replace(',', '.')),
                            snatches: formatLifts(player.slice(6, 9)),
                            cjs: formatLifts(player.slice(10, 13)),
                            sex: player[16].includes('M') ? 'M' : 'F'
                        }
                        const lastIndex = data.length - 1
                        data[lastIndex].players.push(formatPlayer)
                    }
                });
                
            }
        }
    }
    
    await browser.close();



    return NextResponse.json(data)
}