/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve a list of all users in the system
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "651c1f8a2f1b2c0098765432"
 *               firstName:
 *                 type: string
 *                 example: "Rupali"
 *               lastName:
 *                 type: string
 *                 example: "Dhasade"
 *               email:
 *                 type: string
 *                 example: "rupali@example.com"
 *               role:
 *                 type: string
 *                 example: "Developer"
 *               phone:
 *                 type: string
 *                 example: "97305225645"
 *               department:
 *                 type: string
 *                 example: "Java"
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-24T12:34:56Z"
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-24T12:34:56Z"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user profile
 *     description: Retrieve the profile of the currently authenticated user
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "651c1f8a2f1b2c0098765432"
 *             firstName:
 *               type: string
 *               example: "Rupali"
 *             lastName:
 *               type: string
 *               example: "Dhasade"
 *             email:
 *               type: string
 *               example: "rupali@example.com"
 *             role:
 *               type: string
 *               example: "Developer"
 *             phone:
 *               type: string
 *               example: "97305225645"
 *             department:
 *               type: string
 *               example: "Java"
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: "2025-09-24T12:34:56Z"
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: "2025-09-24T12:34:56Z"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/profile:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user profile
 *     description: Update the profile of the currently authenticated user
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
 *           properties:
 *             firstName:
 *               type: string
 *               example: "Juii"
 *             phone:
 *               type: string
 *               example: "8145219426"
 *             department:
 *               type: string
 *               example: "SAP-MM"
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Profile updated successfully"
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "651c1f8a2f1b2c0098765432"
 *                 firstName:
 *                   type: string
 *                   example: "Juii"
 *                 phone:
 *                   type: string
 *                   example: "8145219426"
 *                 department:
 *                   type: string
 *                   example: "SAP-MM"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-25T12:34:56Z"
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/managers:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all managers
 *     description: Retrieve a list of all users with the role of "Manager"
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     responses:
 *       200:
 *         description: List of managers retrieved successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "651c1f8a2f1b2c0098765432"
 *               firstName:
 *                 type: string
 *                 example: "Rahul"
 *               lastName:
 *                 type: string
 *                 example: "Sharma"
 *               email:
 *                 type: string
 *                 example: "rahul.manager@example.com"
 *               role:
 *                 type: string
 *                 example: "Manager"
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               department:
 *                 type: string
 *                 example: "Finance"
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-24T12:34:56Z"
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-24T12:34:56Z"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/developers:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all developers
 *     description: Retrieve a list of all users with the role of "Developer"
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     responses:
 *       200:
 *         description: List of developers retrieved successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "651c1f8a2f1b2c0098765432"
 *               firstName:
 *                 type: string
 *                 example: "Rupali"
 *               lastName:
 *                 type: string
 *                 example: "Dhasade"
 *               email:
 *                 type: string
 *                 example: "rupali.developer@example.com"
 *               role:
 *                 type: string
 *                 example: "Developer"
 *               phone:
 *                 type: string
 *                 example: "97305225645"
 *               department:
 *                 type: string
 *                 example: "Java"
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-24T12:34:56Z"
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-24T12:34:56Z"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Retrieve a single user's details using their unique ID
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The unique ID of the user
 *         example: "68d3796d420f8c45f7968e4f"
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "68d3796d420f8c45f7968e4f"
 *             firstName:
 *               type: string
 *               example: "Rupali"
 *             lastName:
 *               type: string
 *               example: "Dhasade"
 *             email:
 *               type: string
 *               example: "rupali@example.com"
 *             role:
 *               type: string
 *               example: "Developer"
 *             phone:
 *               type: string
 *               example: "97305225645"
 *             department:
 *               type: string
 *               example: "Java"
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: "2025-09-24T12:34:56Z"
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: "2025-09-24T12:34:56Z"
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user by ID
 *     description: Update a user's details by their unique ID
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
 *         description: The unique ID of the user to update
 *         example: "68d3796d420f8c45f7968e4f"
 *       - in: body
 *         name: body
 *         description: Fields to update in the user profile
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *               example: "Rupali"
 *             lastName:
 *               type: string
 *               example: "Dhasade"
 *             email:
 *               type: string
 *               example: "rupali@example.com"
 *             phone:
 *               type: string
 *               example: "8087438867"
 *             department:
 *               type: string
 *               example: "SAP-MM"
 *             role:
 *               type: string
 *               example: "Developer"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "User updated successfully"
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "68d3796d420f8c45f7968e4f"
 *                 firstName:
 *                   type: string
 *                   example: "Rupali"
 *                 lastName:
 *                   type: string
 *                   example: "Dhasade"
 *                 email:
 *                   type: string
 *                   example: "rupali@example.com"
 *                 phone:
 *                   type: string
 *                   example: "8087438867"
 *                 department:
 *                   type: string
 *                   example: "SAP-MM"
 *                 role:
 *                   type: string
 *                   example: "Developer"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-25T12:34:56Z"
 *       400:
 *         description: Invalid request body or user ID
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user by ID
 *     description: Delete a user from the system using their unique ID
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The unique ID of the user to delete
 *         example: "68d3829a6e4c1d1b11698fcb"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "User deleted successfully"
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/blocked:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all blocked users
 *     description: Retrieve a list of all users who are currently blocked
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     responses:
 *       200:
 *         description: List of blocked users retrieved successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "651c1f8a2f1b2c0098765432"
 *               firstName:
 *                 type: string
 *                 example: "Rahul"
 *               lastName:
 *                 type: string
 *                 example: "Sharma"
 *               email:
 *                 type: string
 *                 example: "rahul@example.com"
 *               role:
 *                 type: string
 *                 example: "Developer"
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               department:
 *                 type: string
 *                 example: "Finance"
 *               status:
 *                 type: string
 *                 example: "Blocked"
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-24T12:34:56Z"
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-24T12:34:56Z"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /users/{id}/blocked:
 *   get:
 *     tags:
 *       - Users
 *     summary: Check if a user is blocked
 *     description: Retrieve the blocked status of a specific user by their unique ID
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The unique ID of the user
 *         example: "68d3cc2f08d3fe4a66415dda"
 *     responses:
 *       200:
 *         description: User blocked status retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "68d3cc2f08d3fe4a66415dda"
 *             firstName:
 *               type: string
 *               example: "Rupali"
 *             lastName:
 *               type: string
 *               example: "Dhasade"
 *             status:
 *               type: string
 *               example: "Blocked"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/block:
 *   post:
 *     tags:
 *       - Users
 *     summary: Block a user
 *     description: Block a user by providing their user ID and a reason for blocking
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
 *             - userId
 *             - reason
 *           properties:
 *             userId:
 *               type: string
 *               example: "68d2ad1b8ed62eefc81bfce3"
 *             reason:
 *               type: string
 *               example: "Inappropriate behavior in meetings"
 *     responses:
 *       200:
 *         description: User blocked successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "User has been blocked successfully"
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "68d2ad1b8ed62eefc81bfce3"
 *                 status:
 *                   type: string
 *                   example: "Blocked"
 *                 reason:
 *                   type: string
 *                   example: "Inappropriate behavior in meetings"
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /users/block/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Unblock a user
 *     description: Unblock a user by their unique ID
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The unique ID of the user to unblock
 *         example: "68d3cc2f08d3fe4a66415dda"
 *     responses:
 *       200:
 *         description: User unblocked successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "User has been unblocked successfully"
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "68d3cc2f08d3fe4a66415dda"
 *                 status:
 *                   type: string
 *                   example: "Active"
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /users/blocked-by:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get users who blocked me
 *     description: Retrieve a list of users who have blocked the currently authenticated user
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     responses:
 *       200:
 *         description: List of users who blocked the authenticated user retrieved successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "651c1f8a2f1b2c0098765432"
 *               firstName:
 *                 type: string
 *                 example: "Rahul"
 *               lastName:
 *                 type: string
 *                 example: "Sharma"
 *               email:
 *                 type: string
 *                 example: "rahul@example.com"
 *               role:
 *                 type: string
 *                 example: "Manager"
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               department:
 *                 type: string
 *                 example: "Finance"
 *               status:
 *                 type: string
 *                 example: "Blocked Me"
 *               blockedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-24T12:34:56Z"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error
 */
