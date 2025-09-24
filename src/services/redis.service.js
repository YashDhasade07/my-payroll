import redisConfig from '../config/redis.config.js';

class RedisService {
    constructor() {
        this.client = null;
        this.available = false;
    }

    async initialize() {
        try {
            this.client = await redisConfig.connect();
            this.available = !!this.client;
            
            if (this.available) {
                console.log('🚀 Redis caching enabled - tokens will be cached');
            } else {
                console.log('📊 Redis not available - using database only');
            }
        } catch (error) {
            console.log('⚠️  Redis initialization failed');
            this.available = false;
        }
    }

    async storeToken(token, userId, expirationInSeconds = 3600) {
        if (!this.available) return false;

        try {
            const tokenData = {
                userId: userId,
                createdAt: new Date().toISOString()
            };

            await this.client.setEx(
                `token:${token}`, 
                expirationInSeconds, 
                JSON.stringify(tokenData)
            );

            console.log('✅ Token cached in Redis');
            return true;
        } catch (error) {
            console.warn('Redis store failed:', error.message);
            return false;
        }
    }

    async getToken(token) {
        if (!this.available) return null;

        try {
            const tokenData = await this.client.get(`token:${token}`);
            
            if (!tokenData) {
                return null;
            }

            console.log('✅ Token found in Redis cache');
            return JSON.parse(tokenData);
        } catch (error) {
            console.warn('Redis get failed:', error.message);
            return null;
        }
    }

    async deleteToken(token) {
        if (!this.available) return false;

        try {
            const result = await this.client.del(`token:${token}`);
            console.log('✅ Token deleted from Redis');
            return result > 0;
        } catch (error) {
            console.warn('Redis delete failed:', error.message);
            return false;
        }
    }

    isAvailable() {
        return this.available && redisConfig.isRedisConnected();
    }
}

export default new RedisService();
