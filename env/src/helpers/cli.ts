/**
 * Used for scripts to add environment variables before the script's execution
 */
import { execSync } from "node:child_process"

import { setProcessEnvForCLI } from "./set-process-env"

void setProcessEnvForCLI({
  addAWSCredentials: true,
  nodeEnv: process.env.NODE_ENV as `development` | undefined,
  pathToSecrets: process.env.PATH_TO_SECRETS,
}).then(() => {
  const arrFrom3rdArg = process.argv.splice(2)
  const watch = process.env.WATCH ? ` watch` : ``

  const cmd = `tsx${watch} ${arrFrom3rdArg.join(` `)}`

  execSync(cmd, {
    cwd: process.env.PWD,
    stdio: `inherit`, // make execSync process to use the parent's: "stdin", "stdout", "stderr" streams
  })
})
