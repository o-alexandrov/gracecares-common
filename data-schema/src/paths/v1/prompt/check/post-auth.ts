import * as items from "@gracecares-ai/data-schema/src/schemas/item"
import * as commonHelpers from "@gracecares-ai/helpers"
import * as StatusCodes from "http-status-codes"

const threadRequest = {
  _dangerousUndocumentedProperties: {
    id: {
      required: true,
      type: `string`,
      description: `Identifier of the LLM thread (required)`,
      example: `thread_1234567890abcdef`,
    },
    runId: {
      required: true,
      type: `string`,
      description: `Identifier of the LLM run`,
      example: `run_1234567890abcdef`,
    },
    assistantId: {
      required: true,
      type: `string`,
      description: `Identifier of the assistant`,
      example: `asst_1234567890abcdef`,
    },
  },
} satisfies OA3.Path["requestBody"]

export const definition = {
  summary: `Retrieve the LLM's summary`,
  requestBody: {
    properties: {
      ...commonHelpers.pick(items.network.definition, ["userID", "created"]),
    },
    _dangerousUndocumentedProperties: {
      ...threadRequest._dangerousUndocumentedProperties,
      fileId: {
        type: `string`,
        description: `Identifier of the uploaded file (if any)`,
        example: `file_1234567890abcdef`,
      },
      waitForCompletion: {
        type: `boolean`,
        description: `Whether to wait for completion or return immediately`,
      },
      resources: {
        type: `object`,
        description: `Local resources identifiers`,
        ...threadRequest,
      },
    },
  },
  responses: {
    [StatusCodes.OK]: {
      schema: {
        type: `object`,
        _dangerousUndocumentedProperties: {
          id: {
            type: `string`,
            description: `Identifier of the LLM thread`,
            example: `thread_1234567890abcdef`,
          },
          status: {
            type: `string`,
            description: `Current status of the run`,
            example: `completed`,
          },
          completed: {
            type: `boolean`,
            description: `Whether the run has completed`,
          },
          summary: {
            type: `object`,
            description: `Summary of the clinical document (only present if completed)`,
            _dangerousUndocumentedProperties: {
              noteType: {
                type: `string`,
                description: `Type of clinical document`,
                example: `Discharge Plan`,
              },
              diagnosis: {
                type: `string`,
                description: `Medical diagnosis or condition`,
                example: `Post-surgical knee replacement recovery`,
              },
              keyInstructions: {
                type: `array`,
                items: { type: `string` },
                description: `Key care instructions`,
                example: [`Keep incision dry`, `Take prescribed medications`],
              },
              nextSteps: {
                type: `array`,
                items: { type: `string` },
                description: `Next steps in care plan`,
                example: [
                  `Begin gentle walking Day 2`,
                  `Follow-up appointment in 2 weeks`,
                ],
              },
              findings: {
                type: `array`,
                items: { type: `string` },
                description: `Medical findings from labs/imaging`,
                example: [`WBC 12.3 K/µL`],
              },
              recommendations: {
                type: `array`,
                items: { type: `string` },
                description: `Clinical recommendations`,
                example: [
                  `Refer to physical therapy`,
                  `Repeat X-ray in 4 weeks`,
                ],
              },
              safetyAndEscalation: {
                type: `array`,
                items: { type: `string` },
                description: `Safety concerns and escalation triggers`,
                example: [
                  `Call 911 if severe chest pain`,
                  `Contact doctor if fever > 101°F`,
                ],
              },
            },
          },
          extractedRecoveryDetails: {
            type: `object`,
            description: `Detailed recovery information extracted from document`,
            _dangerousUndocumentedProperties: {
              medications: {
                type: `array`,
                items: {
                  type: `object`,
                  _dangerousUndocumentedProperties: {
                    name: {
                      type: `string`,
                      description: `Medication name`,
                      example: `Ibuprofen`,
                    },
                    dose: {
                      type: `string`,
                      description: `Medication dosage`,
                      example: `400mg`,
                    },
                    frequency: {
                      type: `string`,
                      description: `How often to take medication`,
                      example: `Every 6 hours`,
                    },
                    knownSideEffects: {
                      type: `array`,
                      items: { type: `string` },
                      description: `Known side effects`,
                      example: [`Nausea`, `Dizziness`],
                    },
                  },
                },
                description: `List of medications`,
              },
              followUpAppointments: {
                type: `array`,
                items: {
                  type: `object`,
                  _dangerousUndocumentedProperties: {
                    date: {
                      type: `string`,
                      description: `Appointment date in YYYY-MM-DD format`,
                      example: `2025-07-15`,
                    },
                    provider: {
                      type: `string`,
                      description: `Healthcare provider name`,
                      example: `Dr. Smith`,
                    },
                    purpose: {
                      type: `string`,
                      description: `Purpose of the appointment`,
                      example: `Post-surgical follow-up`,
                    },
                  },
                },
                description: `Follow-up appointments`,
              },
              therapyInstructions: {
                type: `array`,
                items: { type: `string` },
                description: `Physical therapy or rehabilitation instructions`,
                example: [`Range of motion exercises 3x daily`],
              },
              dietAndActivityInstructions: {
                type: `array`,
                items: { type: `string` },
                description: `Diet and activity guidelines`,
                example: [
                  `No heavy lifting over 10 lbs`,
                  `Increase protein intake`,
                ],
              },
              monitoringOrEscalationTriggers: {
                type: `array`,
                items: { type: `string` },
                description: `Symptoms to monitor and escalation triggers`,
                example: [
                  `Monitor for signs of infection`,
                  `Call if swelling increases`,
                ],
              },
            },
          },
          prescriptionDetails: {
            type: `array`,
            items: {
              type: `object`,
              _dangerousUndocumentedProperties: {
                name: {
                  type: `string`,
                  description: `Prescription medication name`,
                  example: `Hydrocodone`,
                },
                dose: {
                  type: `string`,
                  description: `Prescribed dosage`,
                  example: `5mg`,
                },
                frequency: {
                  type: `string`,
                  description: `Dosing frequency`,
                  example: `Every 4-6 hours as needed`,
                },
                formulation: {
                  type: `string`,
                  description: `Medication formulation`,
                  example: `Tablet`,
                },
                specialInstructions: {
                  type: `string`,
                  description: `Special instructions for taking medication`,
                  example: `Take with food to reduce nausea`,
                },
              },
            },
            description: `Detailed prescription information`,
          },
          taskList: {
            required: true,
            type: `array`,
            description: `List of care coordination tasks with SMS reminders`,
            items: {
              type: `object`,
              properties: commonHelpers.pick(items.task.definition, [
                "assigneeID",
                "due",
                "msg",
                "label",
                "created",
              ]),
            },
          },
        },
      },
    },
  },
} as const satisfies OA3.Path
