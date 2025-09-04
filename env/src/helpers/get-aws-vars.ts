/**
 * This module is potentially w/ side effects, hence is served separately
 */
import simpleGit from "simple-git"

import type { stage } from "./consts"
import { stageDefault, stages } from "./consts"

export const baseAwsProfile = `gracecares`
export const awsAccountsIds = {
  // root: ``,
  develop: `272468137631`,
  production: `465208506949`,
} as const

export const setVars = <S extends stage>(stage: S) =>
  ({
    region: `us-east-1`,
    stage,
    profile: `${baseAwsProfile}${stage}` as const,
    accountId: awsAccountsIds[stage],
  }) as const

export const awsVarsStageDefault = setVars(stageDefault)

export type AWSEnvVars = ReturnType<typeof setVars<stage>>
export const getAwsVars = async <S extends stage = typeof stageDefault>(
  stageOverride?: S,
): Promise<AWSEnvVars> => {
  const override = (process.env.STAGE_OVERRIDE as stage) || stageOverride
  let stage = override
  if (!override) {
    const branch = (await simpleGit().status()).current as stage
    const branchStage = stages.find((v) => v === branch)
    stage = branchStage || stageDefault
  }

  if (!stages.includes(stage)) throw new Error(`Unknown stage: ${stage}`)

  console.info(`\nInfrastructure stage: ${stage}\n`)

  return setVars(stage)
}
