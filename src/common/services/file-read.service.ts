import { Injectable } from '@nestjs/common'

import * as xlsx from 'xlsx'

@Injectable()
export class FileReadService {
  readTableFile(fileBuffer: Buffer): string | null {
    try {
      const workbook = xlsx.read(fileBuffer, { type: 'buffer' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1, raw: true }) as unknown[][]
      let textContent = ''
      rows.forEach((row, index) => {
        const rowText = row.map((cell: any) => (cell ? String(cell).trim() : '')).join(' | ')
        textContent += `row${index + 1}: ${rowText}\n`
      })
      return textContent
    } catch (error) {
      console.error('Error reading Excel file:', error)
      return null
    }
  }
}
