/**
 * Copyright (c) 2023 Strategio Digital s.r.o.
 * @author Jiří Zapletal (https://strategio.dev, jz@strategio.dev)
 */

import { useSheets } from './components/useSheets.js'
import { jobsCrawler } from './extractors/jobs/crawler.js'

const sheets = useSheets()
await sheets.auth()

//await startupJobsCrawler('['php'], 'https://www.startupjobs.cz/nabidky/vyvoj/back-end/php')
await jobsCrawler(['php'], 'https://beta.www.jobs.cz/prace/php-vyvojar/')
await sheets.storeData('test')