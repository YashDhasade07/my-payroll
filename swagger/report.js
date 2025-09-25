/**
 * @swagger
 * /reports/meetings/monthly:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get monthly meeting report
 *     description: Retrieve a report of meetings for the current month or a specific month if query parameters are provided
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: month
 *         in: query
 *         required: false
 *         type: string
 *         description: Month in YYYY-MM format (optional, defaults to current month)
 *         example: "2025-09"
 *     responses:
 *       200:
 *         description: Monthly meeting report retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             month:
 *               type: string
 *               example: "2025-09"
 *             totalMeetings:
 *               type: integer
 *               example: 15
 *             completedMeetings:
 *               type: integer
 *               example: 12
 *             pendingMeetings:
 *               type: integer
 *               example: 3
 *             meetings:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "68d391b6f8f637c15833dd29"
 *                   title:
 *                     type: string
 *                     example: "Payroll standup call"
 *                   scheduledDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-25T10:00:00Z"
 *                   status:
 *                     type: string
 *                     example: "Completed"
 *                   createdBy:
 *                     type: string
 *                     example: "68d2ad1b8ed62eefc81bfce3"
 *                   assignedTo:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "68d3796d420f8c45f7968e4f"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /reports/meetings/custom:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get custom meeting report by date range
 *     description: Retrieve a report of meetings between a specified start date and end date
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: startDate
 *         in: query
 *         required: true
 *         type: string
 *         format: date
 *         description: Start date of the report in YYYY-MM-DD format
 *         example: "2025-01-01"
 *       - name: endDate
 *         in: query
 *         required: true
 *         type: string
 *         format: date
 *         description: End date of the report in YYYY-MM-DD format
 *         example: "2025-09-30"
 *     responses:
 *       200:
 *         description: Custom meeting report retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             startDate:
 *               type: string
 *               example: "2025-01-01"
 *             endDate:
 *               type: string
 *               example: "2025-09-30"
 *             totalMeetings:
 *               type: integer
 *               example: 120
 *             completedMeetings:
 *               type: integer
 *               example: 95
 *             pendingMeetings:
 *               type: integer
 *               example: 25
 *             meetings:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "68d391b6f8f637c15833dd29"
 *                   title:
 *                     type: string
 *                     example: "Payroll standup call"
 *                   scheduledDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-15T10:00:00Z"
 *                   status:
 *                     type: string
 *                     example: "Completed"
 *                   createdBy:
 *                     type: string
 *                     example: "68d2ad1b8ed62eefc81bfce3"
 *                   assignedTo:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "68d3796d420f8c45f7968e4f"
 *       400:
 *         description: Invalid date range
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /reports/meetings/scheduled:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get scheduled meeting report
 *     description: Retrieve a report of all scheduled meetings, optionally including detailed information
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: includeDetails
 *         in: query
 *         required: false
 *         type: boolean
 *         description: Whether to include detailed information about each meeting
 *         example: true
 *     responses:
 *       200:
 *         description: Scheduled meeting report retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             totalScheduled:
 *               type: integer
 *               example: 25
 *             meetings:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "68d391b6f8f637c15833dd29"
 *                   title:
 *                     type: string
 *                     example: "Payroll standup call"
 *                   scheduledDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-25T10:00:00Z"
 *                   status:
 *                     type: string
 *                     example: "Scheduled"
 *                   createdBy:
 *                     type: string
 *                     example: "68d2ad1b8ed62eefc81bfce3"
 *                   attendeeIds:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "68d3796d420f8c45f7968e4f"
 *                   description:
 *                     type: string
 *                     example: "Lorem Ipsum meeting description"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /reports/meetings/attended:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get attended meeting report
 *     description: Retrieve a report of meetings attended within a specific timeframe
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: timeframe
 *         in: query
 *         required: true
 *         type: string
 *         description: Timeframe for the report (e.g., day, week, month, quarter, year)
 *         example: "quarter"
 *       - name: includeDetails
 *         in: query
 *         required: false
 *         type: boolean
 *         description: Whether to include detailed information about each attended meeting
 *         example: false
 *     responses:
 *       200:
 *         description: Attended meeting report retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             timeframe:
 *               type: string
 *               example: "quarter"
 *             totalAttended:
 *               type: integer
 *               example: 42
 *             meetings:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "68d391b6f8f637c15833dd29"
 *                   title:
 *                     type: string
 *                     example: "Payroll standup call"
 *                   scheduledDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-25T10:00:00Z"
 *                   status:
 *                     type: string
 *                     example: "Attended"
 *                   createdBy:
 *                     type: string
 *                     example: "68d2ad1b8ed62eefc81bfce3"
 *                   attendeeIds:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "68d3796d420f8c45f7968e4f"
 *                   description:
 *                     type: string
 *                     example: "Lorem Ipsum meeting description"
 *       400:
 *         description: Invalid timeframe parameter
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /reports/users/activity:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get user activity report
 *     description: Retrieve activity records of a specific user within a given timeframe
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         type: string
 *         description: Unique ID of the user
 *         example: "68d37949420f8c45f7968e4c"
 *       - name: timeframe
 *         in: query
 *         required: true
 *         type: string
 *         description: Timeframe for the activity report (e.g., day, week, month, quarter, year)
 *         example: "month"
 *     responses:
 *       200:
 *         description: User activity report retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *               example: "68d37949420f8c45f7968e4c"
 *             timeframe:
 *               type: string
 *               example: "month"
 *             totalActivities:
 *               type: integer
 *               example: 35
 *             activities:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "act_123456"
 *                   type:
 *                     type: string
 *                     example: "Meeting Created"
 *                   description:
 *                     type: string
 *                     example: "Created a new sprint planning meeting"
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-25T10:00:00Z"
 *       400:
 *         description: Invalid userId or timeframe
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /reports/appointments/status:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get appointment status report
 *     description: Retrieve a summary of appointments grouped by their status
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     responses:
 *       200:
 *         description: Appointment status report retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             totalAppointments:
 *               type: integer
 *               example: 50
 *             statuses:
 *               type: object
 *               properties:
 *                 pending:
 *                   type: integer
 *                   example: 15
 *                 accepted:
 *                   type: integer
 *                   example: 25
 *                 declined:
 *                   type: integer
 *                   example: 10
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error
 */
