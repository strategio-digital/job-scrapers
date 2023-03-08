/**
 * Copyright (c) 2023 Strategio Digital s.r.o.
 * @author Jiří Zapletal (https://strategio.dev, jz@strategio.dev)
 */

import { createPlaywrightRouter, PlaywrightCrawler } from 'crawlee'
import { extractor } from './extractor.js'

export const jobsCrawler = async (sheetLabels: string[], startUrl: string) => {
    const router = createPlaywrightRouter()

    const { extractCatalogPagination, extractCatalogLinks, extractDetail } = await extractor(sheetLabels)

    router.addHandler('catalog', async ctx => {
        await extractCatalogPagination(ctx)
        await extractCatalogLinks(ctx)
    })

    router.addHandler('detail', extractDetail)

    const crawler = new PlaywrightCrawler({
        // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
        requestHandler: router,
        headless: true,
        maxRequestRetries: 1,
        maxRequestsPerMinute: 40,
    })

    await crawler.run([{ url: startUrl, label: 'catalog' }])
}