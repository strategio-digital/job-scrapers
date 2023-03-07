/**
 * Copyright (c) 2023 Strategio Digital s.r.o.
 * @author Jiří Zapletal (https://strategio.dev, jz@strategio.dev)
 */

import router from './../../router.js'
import { useSheets } from '../../components/useSheets.js'
import { extractor } from './extractor.js'

export const startupJobsHandler = async (sheetLabels: string[], sheetName: string) => {
    const { getSheet } = useSheets()
    const sheet = await getSheet(sheetName)

    const { extractCatalogPagination, extractCatalogLinks, extractDetail } = await extractor(sheet, sheetLabels)

    router.addHandler('home', async ctx => {
        await extractCatalogPagination(ctx)
        await extractCatalogLinks(ctx)
    })

    router.addHandler('catalog', extractCatalogLinks)

    router.addHandler('detail', extractDetail)

    return {
        sheetLabels,
        sheetName
    }
}