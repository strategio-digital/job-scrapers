/**
 * Copyright (c) 2023 Strategio Digital s.r.o.
 * @author Jiří Zapletal (https://strategio.dev, jz@strategio.dev)
 */

import { Dataset, PlaywrightCrawlingContext } from 'crawlee'

export const extractor = async (sheetLabels: string[]) => {

    const pagination: number[] = []

    async function extractCatalogPagination(ctx: PlaywrightCrawlingContext) {
        const { request, page, log, enqueueLinks } = ctx

        log.info(`Extracting pagination from: ${request.loadedUrl}`)

        const pages = await page.$$eval('.Pagination__item', el => el.map(item => parseInt(item.textContent?.trim() || '0')))

        for (const page of pages.filter(page => page !== 0 && page !== 1 && ! Number.isNaN(page))) {
            if (! pagination.includes(page)) {
                pagination.push(page)
                const targetUrl = `${request.url}?page=${page}`
                log.info(`Adding new catalog link: ${targetUrl}.`)
                await enqueueLinks({ urls: [targetUrl], label: 'catalog' })
            }
        }
    }

    async function extractCatalogLinks(ctx: PlaywrightCrawlingContext) {
        const { request, page, log, enqueueLinks } = ctx

        log.info(`Extracting details links from: ${request.loadedUrl}`)

        const links = await page.$$eval('[data-link="jd-detail"]', el => el.map(node => {
            return node?.getAttribute('href') || null
        }))

        const filteredLinks = links.filter(link => link) as string[]

        await enqueueLinks({ urls: filteredLinks, label: 'detail' })
    }

    async function extractDetail(ctx: PlaywrightCrawlingContext) {
        const { request, page, log } = ctx
        log.info(`Extracting data from: ${request.loadedUrl}`)

        const supportedUrl = request.loadedUrl?.includes('https://beta.www.jobs.cz')

        await page.waitForSelector('h1')
        const h1s = await page.$$eval('h1', el => el.map(item => item.textContent?.trim()))
        const jobName = h1s.length > 0 ? h1s[h1s.length - 1] : '-'

        const params = await page.$$eval('.IconWithText', el => el.map(param => {
            return {
                name: param.querySelector('span')?.innerText.replace(/\s/g, ' ').trim() || null,
                value: param.querySelector('p')?.innerText.replace(/\s/g, ' ').trim() || null
            }
        }))

        const oldParams = await page.evaluate(() => {
            const node = document.querySelector('.icon-description')
            const dts = node?.querySelectorAll('dt')
            const dds = node?.querySelectorAll('dd')

            if (! dts || ! dds) {
                return []
            }

            const params: any[] = []
            dts.forEach((item, index) => {
                params.push({
                    name: item.innerText.replace(/\s/g, ' ').trim() || null,
                    value: dds[index].innerText.replace(/\s/g, ' ').trim() || null
                })
            })
            return params
        })

        const mergedParams = [...oldParams, ...params]

        const salary = mergedParams.find(param => param.name === 'Plat')?.value?.split('–') || null

        if (!supportedUrl) await new Promise(resolve => setTimeout(resolve, 3000))

        const title = await page.title()
        const splitter = supportedUrl ? '–' : '|'
        const companyName = mergedParams.find(param => param.name === 'Společnost')?.value || title.split(splitter)[1]?.trim() || '-';

        const data = {
            company_name: companyName,
            job_name: jobName?.trim() || '-',
            job_type: mergedParams.find(param => param.name === 'Typ pracovního poměru')?.value?.trim() || '-',
            remote: mergedParams.find(param => param.value?.includes('Práce převážně z domova')) ? 'ano' : '-' || '-',
            salary_min: salary ? salary[0]?.trim() : '-',
            salary_max: salary ? salary[1]?.trim() : '-',
            labels: sheetLabels.join(', ') || '-',
            source_url: request?.loadedUrl || '-',
            source: 'jobs-cz',
            created_at: (new Date()).toUTCString(),
            alert: supportedUrl ? '-' : 'Atypická URL',
            params: mergedParams,
        }

        await Dataset.pushData(data)
    }

    return {
        extractCatalogPagination,
        extractCatalogLinks,
        extractDetail
    }
}