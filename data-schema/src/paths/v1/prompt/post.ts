import * as items from "@gracecares-ai/data-schema/src/schemas/item"
import * as commonHelpers from "@gracecares-ai/helpers"
import * as StatusCodes from "http-status-codes"

export const definition = {
  summary: `Send data for a prompt`,
  requestBody: {
    properties: {
      id: {
        descriptionAdditional: [
          `Identifier of the uploaded document`,
          `- user can skip uploading a document (so it's optional)`,
        ],
      },
    },
    _dangerousUndocumentedProperties: {
      // Page 2: Authentication
      phoneNumber: {
        type: `string`,
        description: `Phone number of the user`,
        example: `+1234567890`,
      },

      // Page 4: Role Confirmation
      selectedRole: {
        type: `string`,
        description: `Selected role of the user in the care network`,
        example: `Primary Caregiver`,
      },
      primaryCaregiverName: {
        type: `string`,
        description: `Name of the primary caregiver`,
        example: `John Smith`,
      },

      // Page 5: Care Recipient Setup
      careRecipient: {
        type: `object`,
        description: `Care recipient details`,
        _dangerousUndocumentedProperties: {
          fullName: {
            type: `string`,
            description: `Full name of the care recipient`,
            example: `Marie Chen`,
          },
          nickname: {
            type: `string`,
            description: `Preferred nickname for the care recipient`,
            example: `Mom`,
          },
          relationship: {
            type: `string`,
            description: `Relationship to the care recipient`,
            example: `Mother`,
          },
          address: {
            type: `string`,
            description: `Address of the care recipient`,
            example: `123 Main St, City, State 12345`,
          },
          phoneNumber: {
            type: `string`,
            description: `Phone number of the care recipient`,
            example: `+1234567890`,
          },
          notes: {
            type: `string`,
            description: `Additional notes about the care recipient`,
            example: `Prefers to be called by nickname, has hearing difficulties`,
          },
        },
      },

      // Page 6: Health Context
      healthContext: {
        type: `object`,
        description: `Health context of the care recipient`,
        _dangerousUndocumentedProperties: {
          selectedTags: {
            type: `array`,
            items: {
              type: `string`,
            },
            description: `Selected health tags/conditions`,
            example: [`Knee Surgery`, `Mobility Issues`],
          },
          journeySelected: {
            type: `string`,
            description: `Selected care journey type`,
            example: `Post-Surgery Recovery`,
          },
          otherNotes: {
            type: `string`,
            description: `Additional health notes`,
            example: `Requires assistance with daily activities`,
          },
          whenStarted: {
            type: `string`,
            description: `When the health journey started`,
            example: `May 2025`,
          },
          healthDescription: {
            type: `string`,
            description: `Detailed health description`,
            example: `Recovering from knee replacement surgery`,
          },
        },
      },

      // Page 7: Add Collaborators
      collaborators: {
        type: `array`,
        items: {
          type: `object`,
          _dangerousUndocumentedProperties: {
            name: {
              type: `string`,
              description: `Name of the collaborator`,
              example: `Sarah Johnson`,
            },
            phone: {
              type: `string`,
              description: `Phone number of the collaborator`,
              example: `+1987654321`,
            },
            notes: {
              type: `string`,
              description: `Additional notes about the collaborator`,
              example: `Available weekdays only, prefers text messages`,
            },
          },
        },
        description: `List of care network collaborators`,
      },
    },
  },
  responses: {
    [StatusCodes.OK]: {
      schema: {
        type: `object`,
        properties: {
          id: {
            required: true,
            descriptionAdditional: [`Identifier of a thread`],
          },
        },
        _dangerousUndocumentedProperties: {
          runId: {
            type: `string`,
            description: `Identifier of the prompt run`,
            example: `run_1234567890abcdef`,
          },
          assistantId: {
            type: `string`,
            description: `Identifier of the assistant`,
            example: `asst_1234567890abcdef`,
          },
          fileId: {
            type: `string`,
            description: `Identifier of the uploaded file (if any)`,
            example: `file_1234567890abcdef`,
          },
        },
      },
    },
  },
} as const satisfies OA3.Path
