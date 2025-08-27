const variant = `task` satisfies OA3.VariantOptions

export const definition = {
  id: {
    required: true,
    descriptionAdditional: `Unique identifier within the network`,
  },
  assigneeID: {
    required: true,
    descriptionAdditional: `User's identifier who needs to complete the task`,
  },
  label: { required: true },
  created: { variant: `seconds`, required: true },
  msg: {
    required: true,
    descriptionAdditional: `Text message content for assignee`,
  },
  due: {
    variant: `seconds`,
    descriptionAdditional: [
      `The time by which the task should be completed`,
      `  - optional to let some tasks to be done whenever the assignee decides to`,
    ],
  },
  updated: { variant: `seconds` },
  done: { variant: `seconds` },
  sent: {
    variant: `seconds`,
    descriptionAdditional: `The time when the message was sent`,
  },
} as const satisfies OA3.Properties
