import { CmdRest } from "./presentation/cmd/cmd"

class Cmd {
  private CMD_REST = 'rest'

  main() {
    this.initDev()
    //this.init()
  }

  async checkEnvVar(): Promise<boolean> {
    const CMD = process.env.CMD
    const CMD_VERSION = process.env.CMD_VERSION
    const DATABASE_AUTH_REDIS_URI = ''
    const DATABASE_POSTGRESQL_MASTER_URI = ''


    if (!CMD) {
      console.log("var CMD not defined")
      return false
    }

    if (!CMD_VERSION) {
      console.log('var CMD_VERSION not defined')
      return false
    }


    if (!DATABASE_AUTH_REDIS_URI) {
      console.log('var DATABASE_AUTH_REDIS_URI not defined')
      return false
    } else {
      process.env["DATABASE_AUTH_REDIS_URI"] = DATABASE_AUTH_REDIS_URI
    }

     if (!DATABASE_POSTGRESQL_MASTER_URI) {
      console.log('var DATABASE_POSTGRESQL_MASTER_URI not defined')
      return false
    } else {
      process.env["DATABASE_POSTGRESQL_MASTER_URI"] = DATABASE_POSTGRESQL_MASTER_URI
    }

    return true
  }

  initDev(): void {
    process.env['DATABASE_POSTGRESQL_MASTER_URI'] = ''
    process.env["DATABASE_AUTH_REDIS_URI"] = ''

    new CmdRest().server()
  }

  async init(): Promise<void> {
    if (await this.checkEnvVar()) {
      const CMD = process.env.CMD

      if (CMD === this.CMD_REST) {
        new CmdRest().server()
      }
    }
  }
}

export {
  Cmd
}
