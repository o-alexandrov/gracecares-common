const exitEvents = [
  `beforeExit`,
  `uncaughtException`,
  `unhandledRejection`,
  `SIGHUP`,
  `SIGINT`,
  `SIGQUIT`,
  `SIGILL`,
  `SIGTRAP`,
  `SIGABRT`,
  `SIGBUS`,
  `SIGFPE`,
  `SIGUSR1`,
  `SIGSEGV`,
  `SIGUSR2`,
  `SIGTERM`,
]
/**
 * Sets a callback to be invoked when the program exits
 *   - more details @see https://stackoverflow.com/a/63223515/4122857
 */
export const setExitHandler = (callback: () => void | Promise<any>) => {
  const exitHandler = async (evtOrExitCodeOrError: number | string | Error) => {
    console.info(`exitHandler ~ evtOrExitCodeOrError`, evtOrExitCodeOrError)
    try {
      await callback()
    } catch (error) {
      console.error(`exitHandler ~ error`, error)
    }

    process.exit(isNaN(+evtOrExitCodeOrError) ? 1 : +evtOrExitCodeOrError)
  }

  for (const event of exitEvents) {
    process.on(event, exitHandler)
  }
}
