/**
 * @swagger
 * /bulk-upload/users:
 *   post:
 *     tags:
 *       - Bulk Upload
 *     summary: Bulk upload users from Excel file
 *     description: Upload an Excel file containing multiple user records to insert them into the system
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: Excel file (.xlsx or .xls) containing user records
 *     responses:
 *       200:
 *         description: Users uploaded successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Bulk upload completed successfully"
 *             insertedCount:
 *               type: integer
 *               example: 50
 *             failedRecords:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rowNumber:
 *                     type: integer
 *                     example: 4
 *                   reason:
 *                     type: string
 *                     example: "Email already exists"
 *       400:
 *         description: Invalid file format or content
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /bulk-upload/{id}:
 *   get:
 *     tags:
 *       - Bulk Upload
 *     summary: Get bulk upload details by ID
 *     description: Retrieve the details of a specific bulk upload operation by its unique ID
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The unique ID of the bulk upload
 *         example: "68d3e70c7306f25218805e0b"
 *     responses:
 *       200:
 *         description: Bulk upload details retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "68d3e70c7306f25218805e0b"
 *             entityType:
 *               type: string
 *               example: "users"
 *             uploadedBy:
 *               type: string
 *               example: "68d2ad1b8ed62eefc81bfce3"
 *             totalRecords:
 *               type: integer
 *               example: 50
 *             successfulRecords:
 *               type: integer
 *               example: 45
 *             failedRecords:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rowNumber:
 *                     type: integer
 *                     example: 5
 *                   reason:
 *                     type: string
 *                     example: "Email already exists"
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: "2025-09-25T14:30:00Z"
 *       400:
 *         description: Invalid bulk upload ID
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: Bulk upload not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /bulk-upload/{id}:
 *   delete:
 *     tags:
 *       - Bulk Upload
 *     summary: Delete a bulk upload record by ID
 *     description: Remove a specific bulk upload operation from the system using its unique ID
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The unique ID of the bulk upload to delete
 *         example: "68d3e70c7306f25218805e0b"
 *     responses:
 *       200:
 *         description: Bulk upload deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Bulk upload deleted successfully"
 *             deletedId:
 *               type: string
 *               example: "68d3e70c7306f25218805e0b"
 *       400:
 *         description: Invalid bulk upload ID
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: Bulk upload not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /bulk-upload/{id}/download:
 *   get:
 *     tags:
 *       - Bulk Upload
 *     summary: Download bulk upload file by ID
 *     description: Download the original file of a specific bulk upload operation using its unique ID
 *     produces:
 *       - application/octet-stream
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The unique ID of the bulk upload
 *         example: "68d3ecbe2854e76712e655cd"
 *     responses:
 *       200:
 *         description: Bulk upload file retrieved successfully
 *         schema:
 *           type: string
 *           format: binary
 *       400:
 *         description: Invalid bulk upload ID
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: Bulk upload not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /bulk-upload/{id}/errors:
 *   get:
 *     tags:
 *       - Bulk Upload
 *     summary: Get bulk upload error records by ID
 *     description: Retrieve the failed records of a specific bulk upload operation using its unique ID
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The unique ID of the bulk upload
 *         example: "68d3ecbe2854e76712e655cd"
 *     responses:
 *       200:
 *         description: Bulk upload error records retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "68d3ecbe2854e76712e655cd"
 *             totalRecords:
 *               type: integer
 *               example: 50
 *             failedRecordsCount:
 *               type: integer
 *               example: 5
 *             failedRecords:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rowNumber:
 *                     type: integer
 *                     example: 4
 *                   reason:
 *                     type: string
 *                     example: "Email already exists"
 *       400:
 *         description: Invalid bulk upload ID
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: Bulk upload not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /bulk-upload/history:
 *   get:
 *     tags:
 *       - Bulk Upload
 *     summary: Get bulk upload history
 *     description: Retrieve the history of all bulk upload operations performed in the system
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     responses:
 *       200:
 *         description: Bulk upload history retrieved successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "68d3ecbe2854e76712e655cd"
 *               entityType:
 *                 type: string
 *                 example: "users"
 *               uploadedBy:
 *                 type: string
 *                 example: "68d2ad1b8ed62eefc81bfce3"
 *               totalRecords:
 *                 type: integer
 *                 example: 50
 *               successfulRecords:
 *                 type: integer
 *                 example: 45
 *               failedRecords:
 *                 type: integer
 *                 example: 5
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-25T14:30:00Z"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error
 */
