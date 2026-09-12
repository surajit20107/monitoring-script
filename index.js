import "dotenv/config";
import cron from "node-cron";
import { sendEmail } from "./mail.js";

const urls = ["http://140.238.162.119:5000",];

for (let i = 0; i < urls.length; i++) {
  runJob(urls[i]);
}

async function runJob(url) {
    if (!url) return;
    const job = cron.schedule("*/5 * * * *", async () => {
        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.log(`Error: ${url} is down!`);
                await sendEmail(url, res?.statusText || "Unknown error");
                return;
            }
            console.log(`Success: ${url} is up and running`);
        } catch (err) {
            console.log(`Error: ${url} is down!`);
            await sendEmail(url, err?.message || "Unknown error");
            console.log(err?.message || "Unknown error occured");
        }
    }, { noOverlap: true });
    job.on('execution:failed', (ctx) => console.error('failed:', ctx.execution?.error));
    job.on('execution:overlap', () => console.warn('skipped: job is already running'));
}
