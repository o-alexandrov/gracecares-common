import type { TestContext } from "vitest"

type GetH<P> = (props: P) => Promise<any>

export const testExpectedError = <H = GetH<TestContext>, P = TestContext>(
  handlerTest: H,
) => {
  return async (testContext: P) => {
    // @ts-expect-error - we intentionally override it here
    process.env.EXPECT_ERROR = `true`

    const response = await (handlerTest as GetH<P>)(testContext)

    // @ts-expect-error - we intentionally override it here
    process.env.EXPECT_ERROR = ``

    return response
  }
}
