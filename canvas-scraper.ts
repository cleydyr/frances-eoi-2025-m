import puppeteer from "puppeteer";
import axios from "axios";

// CONFIGURATION
const TARGET_URL =
  "https://www.canva.com/design/DAGS1jbtVUs/ZtauRcJI71IwuK5Afkb8fQ/view";
// IMPORTANT: You must inspect the Canva page and replace this with the actual CSS selector of the data container.
// Canva often generates random class names. If it's a real HTML table, 'table' works.
const TABLE_SELECTOR = "table";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const COLUMN_NAMES = ["Idioma", "Grupo", "Fecha"] as const;

async function run() {
  console.log("Starting Browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for GitHub Actions
  });

  const page = await browser.newPage();

  try {
    // 1. Navigate to Page
    console.log(`Navigating to ${TARGET_URL}...`);
    // networkidle2 waits until there are no more than 2 network connections for at least 500ms
    await page.goto(TARGET_URL, { waitUntil: "networkidle2", timeout: 60000 });

    // 2. Wait for the "Table" to render
    console.log("Waiting for selector...");
    await page.waitForSelector(TABLE_SELECTOR, { timeout: 15000 });

    // 3. Scrape the Data
    // This logic assumes a standard HTML table. If Canva uses divs, you must adjust this.
    const data = await page.evaluate((selector) => {
      const rows = Array.from(document.querySelectorAll(`${selector} tr`));

      return rows.map((row) => {
        const columns = row.querySelectorAll(
          "td, th"
        ) as NodeListOf<HTMLTableCellElement>;

        return Array.from(columns).map((col) => col.innerText.trim());
      });
    }, TABLE_SELECTOR);

    const structuredData = data
      .map((row) => {
        return {
          [COLUMN_NAMES[0]]: row[0],
          [COLUMN_NAMES[1]]: row[1],
          [COLUMN_NAMES[2]]: row[2],
        };
      })
      .filter((row) => row.Idioma === "FRANCÉS")
      .filter((row) => row.Grupo.includes("A1"));

    console.log("Data extracted:", structuredData);

    // 4. Send to Telegram
    await sendToTelegram(
      `📊 **Canva Data Scrape**\n\n${humanFriendlyData(structuredData)}`
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
      await sendToTelegram(`⚠️ **Scraping Failed**\n\nError: ${error.message}`);
      process.exit(1);
    } else {
      console.error("Error:", error);
      await sendToTelegram(`⚠️ **Scraping Failed**\n\nError: ${error}`);
      process.exit(1);
    }
  } finally {
    await browser.close();
  }
}

async function sendToTelegram(message: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    });
    console.log("Telegram message sent.");
  } catch (err) {
    if (err instanceof Error) {
      console.error("Failed to send Telegram message:", err.message);
    } else {
      console.error("Failed to send Telegram message:", err);
    }
  }
}

function isFrenchRow(row: HTMLTableRowElement): boolean {
  return row.cells[0].innerText.trim() === "FRANCÉS";
}

function humanFriendlyData(
  data: Record<(typeof COLUMN_NAMES)[number], string>[]
): string {
  return data
    .map(
      (row) =>
        `${row[COLUMN_NAMES[0]]} - ${row[COLUMN_NAMES[1]]} - ${
          row[COLUMN_NAMES[2]]
        }`
    )
    .join("\n");
}

run();
