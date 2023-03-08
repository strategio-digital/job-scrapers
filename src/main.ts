/**
 * Copyright (c) 2023 Strategio Digital s.r.o.
 * @author Jiří Zapletal (https://strategio.dev, jz@strategio.dev)
 */

import { useSheets } from './components/useSheets.js'
import { startupJobsCrawler } from './extractors/startupJobs/crawler.js'

const sheets = useSheets()
await sheets.auth()

await startupJobsCrawler('test', ['php'], 'https://www.startupjobs.cz/nabidky/vyvoj/back-end/php')