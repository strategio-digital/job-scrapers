/**
 * Copyright (c) 2023 Strategio Digital s.r.o.
 * @author Jiří Zapletal (https://strategio.dev, jz@strategio.dev)
 */

import { Dataset, PlaywrightCrawlingContext } from 'crawlee'
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'

export const extractor = async (sheet: GoogleSpreadsheetWorksheet, searchParams: string[]) => {
    async function extractCatalogPagination(ctx: PlaywrightCrawlingContext) {
        const { request, page, log, enqueueLinks } = ctx

        log.info(`Extracting pagination from: ${request.loadedUrl}`)

        const lastPage = await page.$eval('.bg-lightergeneral.text-primary.py-2.px-3.leading-5.z-0',
            el => el.textContent?.replace('strana', '').split('/')[1].trim()) as string

        const links = []
        for (let i = 2; i <= parseInt(lastPage); i++) {
            const targetLink = `${request.url}/strana-${i}`
            log.info(`Adding new catalog link: ${targetLink}.`)
            links.push(targetLink)
        }

        await enqueueLinks({ urls: links, label: 'catalog' })
    }

    async function extractCatalogLinks(ctx: PlaywrightCrawlingContext) {
        const { request, page, log, enqueueLinks } = ctx

        log.info(`Extracting details links from: ${request.loadedUrl}`)

        const nodes = await page.$$eval('#offers-list article', el => el.map(article => {
            const source = article.querySelector('a')?.getAttribute('href') || null
            return source ? `https://www.startupjobs.cz${source}` : null
        }))

        await enqueueLinks({ urls: nodes.filter(links => links !== null) as string[], label: 'detail' })
    }

    async function extractDetail(ctx: PlaywrightCrawlingContext) {
        const { request, page, log } = ctx

        log.info(`Extracting data from: ${request.loadedUrl}`)

        const jobName = await page.$eval('h1', el => el.textContent)
        const companyName = await page.$eval('.flex.md\\\:hidden.py-4.justify-center > img', el => el.getAttribute('alt'))

        const params = await page.$$eval('.offer-detail-parameters > .col-span-2 > .mb-4', el => el.map(param => {
            return {
                name: param.querySelector('dt')?.innerText.replace(/\s/g, ' ').trim() || null,
                value: param.querySelector('dd')?.innerText.replace(/\s/g, ' ').trim() || null
            }
        }))

        const salary = params.find(param => param.name === 'Odměna')?.value?.split('\/')[0].split(' - ') || null

        const data = {
            company_name: companyName ? companyName?.trim() : '-',
            job_name: jobName ? jobName?.trim() : '-',
            job_type: params.find(param => param.name === 'Úvazek')?.value || '-',
            salary_min: salary ? salary[0]?.trim() : '-',
            salary_max: salary ? salary[1]?.trim() : '-',
            remote: params.find(param => param.value?.includes('Remote')) ? 'ano' : '-' || '-',
            search_params: searchParams.join(', ') || '-',
            source: 'startup-jobs',
            created_at: (new Date()).toUTCString(),
            params,
            source_url: request.loadedUrl as string
        }

        await sheet.addRow({ ...data, params: JSON.stringify(data.params) })
        await Dataset.pushData(data)
    }

    return {
        extractCatalogPagination,
        extractCatalogLinks,
        extractDetail,
    }
}