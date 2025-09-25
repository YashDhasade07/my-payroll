/**
 * @swagger
 * /appointments:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get appointments
 *     description: Retrieve a list of appointments. Optional query parameters can be used to filter by start and end dates.
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: startDate
 *         in: query
 *         required: false
 *         type: string
 *         format: date
 *         description: Start date to filter appointments (YYYY-MM-DD)
 *         example: "2025-09-25"
 *       - name: endDate
 *         in: query
 *         required: false
 *         type: string
 *         format: date
 *         description: End date to filter appointments (YYYY-MM-DD)
 *         example: "2025-09-30"
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "652a6f42d3b9a2c91fbb8d32"
 *               title:
 *                 type: string
 *                 example: "Project Meeting"
 *               description:
 *                 type: string
 *                 example: "Discuss project requirements"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-25T10:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-25T11:00:00Z"
 *               createdBy:
 *                 type: string
 *                 example: "651c1f8a2f1b2c0098765432"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /appointments/my-created:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get my created appointments
 *     description: Retrieve a list of appointments created by the currently authenticated user
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     responses:
 *       200:
 *         description: Appointments created by user retrieved successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "652a6f42d3b9a2c91fbb8d32"
 *               title:
 *                 type: string
 *                 example: "Project Meeting"
 *               description:
 *                 type: string
 *                 example: "Discuss project requirements"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-25T10:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-25T11:00:00Z"
 *               createdBy:
 *                 type: string
 *                 example: "651c1f8a2f1b2c0098765432"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /appointments/my-assigned:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get my assigned appointments
 *     description: Retrieve a list of appointments that are assigned to the currently authenticated user
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     responses:
 *       200:
 *         description: Appointments assigned to user retrieved successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "652a6f42d3b9a2c91fbb8d32"
 *               title:
 *                 type: string
 *                 example: "Project Meeting"
 *               description:
 *                 type: string
 *                 example: "Discuss project requirements"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-25T10:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-25T11:00:00Z"
 *               assignedTo:
 *                 type: string
 *                 example: "651c1f8a2f1b2c0098765432"
 *               createdBy:
 *                 type: string
 *                 example: "651c1f8a2f1b2c0098765432"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get appointment by ID
 *     description: Retrieve the details of a specific appointment using its unique ID
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The unique ID of the appointment
 *         example: "68d391b6f8f637c15833dd29"
 *     responses:
 *       200:
 *         description: Appointment retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "68d391b6f8f637c15833dd29"
 *             title:
 *               type: string
 *               example: "Project Meeting"
 *             description:
 *               type: string
 *               example: "Discuss project requirements"
 *             startTime:
 *               type: string
 *               format: date-time
 *               example: "2025-09-25T10:00:00Z"
 *             endTime:
 *               type: string
 *               format: date-time
 *               example: "2025-09-25T11:00:00Z"
 *             createdBy:
 *               type: string
 *               example: "651c1f8a2f1b2c0098765432"
 *             assignedTo:
 *               type: string
 *               example: "651c1f8a2f1b2c0098765432"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/{userId}/appointments/created:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get appointments created by a specific user
 *     description: Retrieve a list of appointments created by a user using their userId
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: The unique ID of the user
 *         example: "68d2ad1b8ed62eefc81bfce3"
 *     responses:
 *       200:
 *         description: Appointments created by the user retrieved successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "68d391b6f8f637c15833dd29"
 *               title:
 *                 type: string
 *                 example: "Design Review Meeting"
 *               description:
 *                 type: string
 *                 example: "Discuss UI/UX design progress"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-26T14:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-26T15:00:00Z"
 *               createdBy:
 *                 type: string
 *                 example: "68d2ad1b8ed62eefc81bfce3"
 *               assignedTo:
 *                 type: string
 *                 example: "68d3cc2f08d3fe4a66415dda"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: User or appointments not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/{userId}/appointments/assigned:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get appointments assigned to a specific user
 *     description: Retrieve a list of appointments assigned to a user using their userId
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: The unique ID of the user
 *         example: "68d37949420f8c45f7968e4c"
 *     responses:
 *       200:
 *         description: Appointments assigned to the user retrieved successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "68d391b6f8f637c15833dd29"
 *               title:
 *                 type: string
 *                 example: "Design Review Meeting"
 *               description:
 *                 type: string
 *                 example: "Discuss UI/UX design progress"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-26T14:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-26T15:00:00Z"
 *               createdBy:
 *                 type: string
 *                 example: "68d2ad1b8ed62eefc81bfce3"
 *               assignedTo:
 *                 type: string
 *                 example: "68d37949420f8c45f7968e4c"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: User or appointments not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /appointments/{id}/status:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get appointment status
 *     description: Retrieve the current status of a specific appointment using its unique ID
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The unique ID of the appointment
 *         example: "68d391b6f8f637c15833dd29"
 *     responses:
 *       200:
 *         description: Appointment status retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "68d391b6f8f637c15833dd29"
 *             status:
 *               type: string
 *               example: "Scheduled"
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: "2025-09-25T12:00:00Z"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /appointments/{id}/accept:
 *   put:
 *     tags:
 *       - Appointments
 *     summary: Accept an appointment
 *     description: Accept a specific appointment using its unique ID
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The unique ID of the appointment to accept
 *         example: "68d391b6f8f637c15833dd29"
 *     responses:
 *       200:
 *         description: Appointment accepted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Appointment has been accepted"
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "68d391b6f8f637c15833dd29"
 *                 status:
 *                   type: string
 *                   example: "Accepted"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-25T12:30:00Z"
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /appointments/{id}/decline:
 *   put:
 *     tags:
 *       - Appointments
 *     summary: Decline an appointment
 *     description: Decline a specific appointment using its unique ID and provide a reason
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The unique ID of the appointment to decline
 *         example: "68d391b6f8f637c15833dd29"
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - reason
 *           properties:
 *             reason:
 *               type: string
 *               example: "Schedule conflict"
 *     responses:
 *       200:
 *         description: Appointment declined successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Appointment has been declined"
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "68d391b6f8f637c15833dd29"
 *                 status:
 *                   type: string
 *                   example: "Declined"
 *                 reason:
 *                   type: string
 *                   example: "Schedule conflict"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-25T13:00:00Z"
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     tags:
 *       - Appointments
 *     summary: Update an appointment
 *     description: Update details of a specific appointment using its unique ID
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The unique ID of the appointment to update
 *         example: "68d391b6f8f637c15833dd29"
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: "Sprint Planning Meeting 2.0"
 *             description:
 *               type: string
 *               example: "Discuss next sprint goals"
 *             attendeeIds:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "68d3796d420f8c45f7968e4f"
 *             duration:
 *               type: integer
 *               example: 66
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Appointment has been updated successfully"
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "68d391b6f8f637c15833dd29"
 *                 title:
 *                   type: string
 *                   example: "Sprint Planning Meeting 2.0"
 *                 description:
 *                   type: string
 *                   example: "Discuss next sprint goals"
 *                 attendeeIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "68d3796d420f8c45f7968e4f"
 *                 duration:
 *                   type: integer
 *                   example: 66
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-25T14:00:00Z"
 *       400:
 *         description: Invalid request body or appointment ID
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     tags:
 *       - Appointments
 *     summary: Delete an appointment
 *     description: Delete a specific appointment using its unique ID
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The unique ID of the appointment to delete
 *         example: "68d44eed7e818fd9ca01d0cb"
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Appointment has been deleted successfully"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     tags:
 *       - Appointments
 *     summary: Create a new appointment
 *     description: Schedule a new appointment with title, description, attendees, scheduled date, and duration
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - description
 *             - attendeeIds
 *             - scheduledDate
 *             - duration
 *           properties:
 *             title:
 *               type: string
 *               example: "Payroll standup call 7"
 *             description:
 *               type: string
 *               example: "Lorem Ipsum new"
 *             attendeeIds:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "68d3796d420f8c45f7968e4f"
 *             scheduledDate:
 *               type: string
 *               format: date-time
 *               example: "2025-10-02T10:00:00Z"
 *             duration:
 *               type: integer
 *               example: 55
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Appointment has been created successfully"
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "68d44eed7e818fd9ca01d0cb"
 *                 title:
 *                   type: string
 *                   example: "Payroll standup call 7"
 *                 description:
 *                   type: string
 *                   example: "Lorem Ipsum new"
 *                 attendeeIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "68d3796d420f8c45f7968e4f"
 *                 scheduledDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-02T10:00:00Z"
 *                 duration:
 *                   type: integer
 *                   example: 55
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-25T14:30:00Z"
 *                 createdBy:
 *                   type: string
 *                   example: "68d2ad1b8ed62eefc81bfce3"
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error
 */
