import { networkInterfaces } from "node:os"

/**
 * @returns The local IP address of the machine
 * @example getLocalIpAddress() // returns "192.168.1.30"
 */
export const getLocalIpAddress = () => {
  const nets = networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      const ipAddress: string = net.address
      /**
       * Skip over:
       *   - non-IPv4
       *   - internal (i.e. 127.0.0.1) addresses
       *   - ip addresses that start with 10
       */
      if (
        net.family === `IPv4` &&
        !net.internal &&
        !ipAddress.startsWith(`10`)
      ) {
        return ipAddress
      }
    }
  }
  throw new Error(`Unable to find local IP address`)
}
