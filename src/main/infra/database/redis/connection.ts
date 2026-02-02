import { createClient } from "redis"
import { newDate } from "../../common/date"

class ClientRedis {
  public static client: any
  public static errClientRedis = false
  public static connected = false

  static async getClient() {
    if (!this.connected) {
      await this.initializeRedis()
    }
    return this.client
  }

  static async initializeRedis() {
    this.client = this.createClient()

    this.client.on('error', (error: any) => {
      console.log(`[${newDate().toLocaleString()}] error connect redis: ${error.message}`)

      if (error.code === 'ECONNREFUSED') {
        this.errClientRedis = true
      }
    })

    this.client.on("connect", () => {
      console.log('connected')
      this.errClientRedis = false
      this.connected = true
    })

    if (!this.connected) {
      console.log('connecting')
      await this.client.connect()
    }
  }

  static createClient() {
    return createClient({
      url: process.env.DATABASE_AUTH_REDIS_URI
    })
  }
}

export {
  ClientRedis
}