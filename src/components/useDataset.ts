/**
 * Copyright (c) 2023 Strategio Digital s.r.o.
 * @author Jiří Zapletal (https://strategio.dev, jz@strategio.dev)
 */


import fs from 'fs'
import { useSheets } from './useSheets.js'

export const useDataset = () => {
    const { getSheet } = useSheets()

    async function prune() {
        const storagePath = './storage'
        fs.rmSync(storagePath, { recursive: true, force: true });
    }

    async function store(sheetName: string) {
        const data: any[] = []
        const storagePath = './storage/datasets/default'

        fs.readdirSync(storagePath).forEach(file => {
            const context = fs.readFileSync(`${storagePath}/${file}`, { encoding: 'utf8' })
            data.push(JSON.parse(context.toString()))
        })

        const formattedData = data.map(item => {
            return {
                ...item,
                params: JSON.stringify(item.params)
            }
        })

        const sheet = await getSheet(sheetName)
        await sheet.addRows(formattedData)
    }

    return {
        prune,
        store
    }
}