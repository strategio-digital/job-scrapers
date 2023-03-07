/**
 * Copyright (c) 2023 Strategio Digital s.r.o.
 * @author Jiří Zapletal (https://strategio.dev, jz@strategio.dev)
 */

import { PlaywrightCrawler } from 'crawlee'
import { useSheets } from './components/useSheets.js'
import { startupJobsHandler } from './extractors/startupJobs/handler.js'
import router from './router.js'

const startupJobsCrawler = new PlaywrightCrawler({
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: router,
    headless: true,
    maxRequestRetries: 1,
    maxRequestsPerMinute: 40
})

const sheets = useSheets()
await sheets.auth()

await startupJobsHandler(['php'], 'test')
await startupJobsCrawler.run([{ url: 'https://www.startupjobs.cz/nabidky/vyvoj/back-end/php', label: 'home' }])