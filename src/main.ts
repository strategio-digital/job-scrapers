/**
 * Copyright (c) 2023 Strategio Digital s.r.o.
 * @author Jiří Zapletal (https://strategio.dev, jz@strategio.dev)
 */

import { useSheets } from './components/useSheets.js'
import { jobsCrawler } from './extractors/jobs/crawler.js'
import { startupJobsCrawler } from './extractors/startupJobs/crawler.js'
import { useDataset } from './components/useDataset.js'

const dataset = useDataset()
const sheets = useSheets()
await sheets.auth()

const tags = ['php', 'nette', 'symfony', 'laravel', 'vue', 'react', 'node']

for (const tag of tags) {
    await startupJobsCrawler([tag], `https://www.startupjobs.cz/nabidky?superinput=${tag}`)
    await jobsCrawler([tag], `https://beta.www.jobs.cz/prace/?q[]=${tag}`)
}

// Store data in Google Sheets
await dataset.store('sheet-name')