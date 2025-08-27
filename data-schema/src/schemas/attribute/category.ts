import * as helpers from "@gracecares-ai/data-schema/src/helpers"

export const name = `category`

export enum resource {
  dailyLiving = 1,
  respiteSupport,
  socialEngagement,
  legalFinancial,
  safetyEmergency,
  communityGroups,
  transportation,
  meals,
  assistiveTech,
  homeModifications,
}

export const mapResourceToLabel = {
  [resource.dailyLiving]: `Daily Living`,
  [resource.respiteSupport]: `Respite Support`,
  [resource.socialEngagement]: `Social Engagement`,
  [resource.legalFinancial]: `Legal & Financial`,
  [resource.safetyEmergency]: `Safety & Emergency`,
  [resource.communityGroups]: `Community Groups`,
  [resource.transportation]: `Transportation`,
  [resource.meals]: `Meals`,
  [resource.assistiveTech]: `Assistive Technology`,
  [resource.homeModifications]: `Home Modifications`,
}

export const variants = {
  resource: helpers.enumOrObjectToOpenapi(`Resource category`, resource),
} as const satisfies OA3.Variants
