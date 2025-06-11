import { createServer } from "node:net"

import kill from "kill-port"

export const isPortTaken = async (
  port: number,
  shouldKillIfTaken?: boolean,
) => {
  return new Promise<boolean>((resolve, reject) => {
    const server = createServer()
      .once(`error`, async (err) => {
        if ((err as NodeJS.ErrnoException).code === `EADDRINUSE`) {
          if (shouldKillIfTaken) await kill(port)
          resolve(true)
        }

        reject(err)
      })
      .once(`listening`, () => {
        server.close()
        resolve(false)
      })
      .listen(port)
  })
}

export const killPorts = async (ports: number[]) => {
  console.info(`====================================`)
  console.info(`Killing ports: `, ports)
  console.info(`====================================`)

  return Promise.all(ports.map((v) => isPortTaken(v, true)))
}
