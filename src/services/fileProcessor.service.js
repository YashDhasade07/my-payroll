import XLSX from 'xlsx';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import ApplicationError from '../middleware/applicationError.js';

export default class FileProcessor {
    
    async parseFile(filePath) {
        const extension = path.extname(filePath).toLowerCase();
        
        switch (extension) {
            case '.csv':
                return await this.parseCSV(filePath);
            case '.xlsx':
            case '.xls':
                return await this.parseExcel(filePath);
            default:
                throw new ApplicationError('Unsupported file format', 400);
        }
    }

    async parseCSV(filePath) {
        return new Promise((resolve, reject) => {
            const results = [];
            
            fs.createReadStream(filePath)
                .pipe(csv({
                    mapHeaders: ({ header }) => header.trim().toLowerCase()
                }))
                .on('data', (data) => {
                    // Map CSV headers to expected field names
                    const mappedData = {
                        firstName: data.firstname || data['first name'] || data.first_name,
                        lastName: data.lastname || data['last name'] || data.last_name,
                        email: data.email,
                        password: data.password,
                        role: data.role,
                        phone: data.phone || data['phone number'] || data.phone_number,
                        department: data.department || data.dept
                    };
                    results.push(mappedData);
                })
                .on('end', () => {
                    resolve(results);
                })
                .on('error', (error) => {
                    reject(new ApplicationError('Error parsing CSV file: ' + error.message, 400));
                });
        });
    }

    async parseExcel(filePath) {
        try {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0]; // Use first sheet
            const worksheet = workbook.Sheets[sheetName];
            
            // Convert to JSON with header row as keys
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                defval: '', // Default value for empty cells
                header: 1 // Use first row as header
            });

            if (jsonData.length === 0) {
                throw new ApplicationError('Excel file is empty', 400);
            }

            const headers = jsonData[0];
            const dataRows = jsonData.slice(1);

            // Map headers to lowercase for consistency
            const normalizedHeaders = headers.map(h => h.toString().trim().toLowerCase());

            // Convert rows to objects
            const results = dataRows.map(row => {
                const rowObject = {};
                normalizedHeaders.forEach((header, index) => {
                    rowObject[header] = row[index] ? row[index].toString().trim() : '';
                });

                // Map Excel headers to expected field names
                return {
                    firstName: rowObject.firstname || rowObject['first name'] || rowObject.first_name,
                    lastName: rowObject.lastname || rowObject['last name'] || rowObject.last_name,
                    email: rowObject.email,
                    password: rowObject.password,
                    role: rowObject.role,
                    phone: rowObject.phone || rowObject['phone number'] || rowObject.phone_number,
                    department: rowObject.department || rowObject.dept
                };
            });

            return results;
        } catch (error) {
            if (error instanceof ApplicationError) {
                throw error;
            }
            throw new ApplicationError('Error parsing Excel file: ' + error.message, 400);
        }
    }
}
