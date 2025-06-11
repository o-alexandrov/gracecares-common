/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/consistent-type-definitions */

type NodeJSProcessEnv =
  import("../src/helpers/get-process-env").NodeJSProcessEnv

namespace NodeJS {
  interface ProcessEnv extends NodeJSProcessEnv {}
}
