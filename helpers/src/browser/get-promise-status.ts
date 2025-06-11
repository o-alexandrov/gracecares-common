enum PromiseStatus {
  pending,
  fulfilled,
  rejected,
}

const uniqueValue = /1/ // RegExp is never content-equal, so it will never collide with what a Promise can resolve to

const onFullfilled = (value: any) =>
  value === uniqueValue ? PromiseStatus.pending : PromiseStatus.fulfilled

const onRejected = () => PromiseStatus.rejected

const resolvedPromise = Promise.resolve(uniqueValue)

export const getPromiseStatus = async (
  promise: Promise<any>,
): Promise<PromiseStatus> => {
  return Promise.race([promise, resolvedPromise]).then(onFullfilled, onRejected)
}

export const checkIsPromisePending = async (promise: Promise<any>) => {
  return (await getPromiseStatus(promise)) === PromiseStatus.pending
}
