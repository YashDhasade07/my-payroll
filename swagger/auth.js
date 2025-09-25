/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Creates a new user account
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - firstName
 *             - lastName
 *             - email
 *             - password
 *           properties:
 *             firstName:
 *               type: string
 *               example: "Dummy"
 *             lastName:
 *               type: string
 *               example: "Dhasade"
 *             email:
 *               type: string
 *               example: "eyxsa@gmail.com"
 *             password:
 *               type: string
 *               example: "pass@1234"
 *             role:
 *               type: string
 *               example: "Developer"
 *             phone:
 *               type: integer
 *               example: 97305225645
 *             department:
 *               type: string
 *               example: "Java"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 */

 /**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login a user
 *     description: Authenticate a user with email and password
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               example: "yashdhasade1234@gmail.com"
 *             password:
 *               type: string
 *               example: "pass@1234"
 *     responses:
 *       200:
 *         description: Successful login
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: "yashdhasade1234@gmail.com"
 *       400:
 *         description: Invalid input or missing fields
 *       401:
 *         description: Unauthorized, wrong email or password
 */

 /**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Forgot password
 *     description: Sends an OTP or reset link to the user's email
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *           properties:
 *             email:
 *               type: string
 *               example: "yashdhasade1234@gmail.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully or reset link sent
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "OTP has been sent to your email"
 *       400:
 *         description: Invalid email or missing field
 *       404:
 *         description: User with this email not found
 */

 /**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset password
 *     description: Resets the user's password using the token sent via email
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - newPassword
 *             - token
 *           properties:
 *             newPassword:
 *               type: string
 *               example: "pass@1234"
 *             token:
 *               type: string
 *               example: "e3f8f0366efcb6127a30448816ab1b75bc083902527d9defb8e01c03ded488fc"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Password has been reset successfully"
 *       400:
 *         description: Invalid token or missing fields
 *       401:
 *         description: Token expired or unauthorized
 */

 /**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout a user
 *     description: Logs out the user by invalidating the Bearer token
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []   # 🔑 Require Bearer Token
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Logged out successfully"
 *       401:
 *         description: Unauthorized, invalid or missing token
 */
