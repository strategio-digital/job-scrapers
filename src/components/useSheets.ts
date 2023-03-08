/**
 * Copyright (c) 2023 Strategio Digital s.r.o.
 * @author Jiří Zapletal (https://strategio.dev, jz@strategio.dev)
 */

import { GoogleSpreadsheet } from 'google-spreadsheet'
import * as dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID as string)

export const useSheets = () => {
    async function auth() {
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL as string,
            private_key: process.env.GOOGLE_PRIVATE_KEY as string
        })

        await doc.loadInfo()

        return doc
    }

    async function getSheet(sheetName: string) {
        return doc.sheetsByTitle[sheetName]
    }

    async function storeData(sheetName: string) {
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
        auth,
        getSheet,
        storeData
    }
}