/**
 * Copyright (c) 2023 Strategio Digital s.r.o.
 * @author Jiří Zapletal (https://strategio.dev, jz@strategio.dev)
 */

import { GoogleSpreadsheet } from 'google-spreadsheet'
import * as dotenv from 'dotenv'

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

    return {
        auth,
        getSheet
    }
}