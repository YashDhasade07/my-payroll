import { createClient } from 'redis';

class RedisConfig {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            console.log('Attempting to connect to Redis...');
            
            this.client = createClient({
                socket: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: process.env.REDIS_PORT || 6379,
                    connectTimeout: 5000,
                    lazyConnect: true
                },
                password: process.env.REDIS_PASSWORD || undefined
            });

            this.client.on('error', (error) => {
                console.warn('Redis Client Error:', error.message);
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                console.log('✅ Redis client connected');
                this.isConnected = true;
            });

            this.client.on('ready', () => {
                console.log('✅ Redis client ready');
                this.isConnected = true;
            });

            this.client.on('end', () => {
                console.log('⚠️  Redis client disconnected');
                this.isConnected = false;
            });

            await this.client.connect();
            return this.client;
        } catch (error) {
            console.warn(`⚠️  Redis connection failed: ${error.message}`);
            this.isConnected = false;
            this.client = null;
            return null;
        }
    }

    getClient() {
        return this.isConnected ? this.client : null;
    }

    isRedisConnected() {
        return this.isConnected && this.client;
    }

    async disconnect() {
        if (this.client && this.isConnected) {
            try {
                await this.client.disconnect();
            } catch (error) {
                console.warn('Error disconnecting Redis:', error.message);
            }
        }
    }
}

export default new RedisConfig();
