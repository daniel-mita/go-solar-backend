const puppeteer = require("puppeteer")

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function scrapeUTB() {
  // Launch a new headless browser instance
  const browser = await puppeteer.launch({ headless: true })

  // Open a new page
  const page = await browser.newPage()

  // Navigate to a URL
  await page.goto("https://utb-shop.ro/")

  // Wait for the page to load completely

  await page.waitForSelector(".container-fluid.submenuhead")

  const link = await page.evaluate(() => {
    const panouriSolare = Array.from(
      document.querySelectorAll(".bmenu-cat .tit")
    ).find((element) => element.textContent.trim() === "PANOURI SOLARE")
    return panouriSolare.parentElement.getAttribute("href")
  })

  page.goto("https://utb-shop.ro" + link)

  await page.waitForSelector(".d-none.d-sm-block")
  await page.waitForSelector(".domef")

  const aElement = await page.$(
    'div.d-none.d-sm-block div.row a[href="/categorie/electrice/panouri-solare/1/filter&filtru=tip_produs&filtru_id=34&pret=0"]'
  )
  if (aElement) {
    const href = await page.evaluate((el) => el.getAttribute("href"), aElement)
    page.goto("https://utb-shop.ro" + href)
  } else {
    console.log("Element not found.")
  }

  await page.waitForSelector("#prodse > div:nth-child(1)")

  const href = await page.$eval("div.row div.cd-bdy:first-child a", (el) =>
    el.getAttribute("href")
  )

  page.goto("https://utb-shop.ro" + href)

  await page.waitForSelector("div#descriere_produs")

  const tableData = await page.$$eval(
    "div.desc table.table-bordered tbody tr",
    (rows) => {
      const rowData = {}
      for (const row of rows) {
        const cells = row.querySelectorAll("td")
        const label = cells[0].textContent.trim()
        const value = cells[1].textContent.trim()
        rowData[label] = value
      }
      return rowData
    }
  )

  const price = await page.$eval('#pret_produss', el => parseFloat(el.textContent.trim()));
  tableData['pret'] = price
  await delay(1000)

  // Close the browser
  await browser.close()

  return tableData
}
