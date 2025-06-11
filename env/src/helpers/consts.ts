export const stageDefault = `develop`
export const stages = [
  stageDefault,
  // `staging`, // we are not using staging for now
  `production`,
] as const
export type stage = (typeof stages)[number]

export const productionDomain = `gracecares.ai`

export const getDomain = (stage: stage) =>
  stage === `production` ? productionDomain : (`gracecares-${stage}.click` as const)
