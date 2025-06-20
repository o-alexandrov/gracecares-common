import * as items from "@gracecares-ai/data-schema/src/schemas/item"
import * as commonHelpers from "@gracecares-ai/helpers"
import * as StatusCodes from "http-status-codes"

export const definition = {
  summary: `Send data for a prompt`,
  requestBody: {
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
          },
        },
        description: `List of care network collaborators`,
      },
    },
  },
  responses: {
    [StatusCodes.OK]: {
      schema: {
        type: "object",
        _dangerousUndocumentedProperties: {
          summary: {
            type: "object",
            description: "Summary of the clinical document",
            _dangerousUndocumentedProperties: {
              patientName: {
                type: "string",
                description: "Name of the patient",
                example: "Marie Chen",
              },
              noteType: {
                type: "string",
                description: "Type of clinical document",
                example: "Discharge Plan",
              },
              diagnosis: {
                type: "string",
                description: "Medical diagnosis or condition",
                example: "Post-surgical knee replacement recovery",
              },
              keyInstructions: {
                type: "array",
                items: { type: "string" },
                description: "Key care instructions",
                example: ["Keep incision dry", "Take prescribed medications"],
              },
              nextSteps: {
                type: "array",
                items: { type: "string" },
                description: "Next steps in care plan",
                example: [
                  "Begin gentle walking Day 2",
                  "Follow-up appointment in 2 weeks",
                ],
              },
              findings: {
                type: "array",
                items: { type: "string" },
                description: "Medical findings from labs/imaging",
                example: ["WBC 12.3 K/µL"],
              },
              recommendations: {
                type: "array",
                items: { type: "string" },
                description: "Clinical recommendations",
                example: [
                  "Refer to physical therapy",
                  "Repeat X-ray in 4 weeks",
                ],
              },
              safetyAndEscalation: {
                type: "array",
                items: { type: "string" },
                description: "Safety concerns and escalation triggers",
                example: [
                  "Call 911 if severe chest pain",
                  "Contact doctor if fever > 101°F",
                ],
              },
            },
          },
          extractedRecoveryDetails: {
            type: "object",
            description:
              "Detailed recovery information extracted from document",
            _dangerousUndocumentedProperties: {
              medications: {
                type: "array",
                items: {
                  type: "object",
                  _dangerousUndocumentedProperties: {
                    name: {
                      type: "string",
                      description: "Medication name",
                      example: "Ibuprofen",
                    },
                    dose: {
                      type: "string",
                      description: "Medication dosage",
                      example: "400mg",
                    },
                    frequency: {
                      type: "string",
                      description: "How often to take medication",
                      example: "Every 6 hours",
                    },
                    knownSideEffects: {
                      type: "array",
                      items: { type: "string" },
                      description: "Known side effects",
                      example: ["Nausea", "Dizziness"],
                    },
                  },
                },
                description: "List of medications",
              },
              followUpAppointments: {
                type: "array",
                items: {
                  type: "object",
                  _dangerousUndocumentedProperties: {
                    date: {
                      type: "string",
                      description: "Appointment date in YYYY-MM-DD format",
                      example: "2025-07-15",
                    },
                    provider: {
                      type: "string",
                      description: "Healthcare provider name",
                      example: "Dr. Smith",
                    },
                    purpose: {
                      type: "string",
                      description: "Purpose of the appointment",
                      example: "Post-surgical follow-up",
                    },
                  },
                },
                description: "Follow-up appointments",
              },
              therapyInstructions: {
                type: "array",
                items: { type: "string" },
                description: "Physical therapy or rehabilitation instructions",
                example: ["Range of motion exercises 3x daily"],
              },
              dietAndActivityInstructions: {
                type: "array",
                items: { type: "string" },
                description: "Diet and activity guidelines",
                example: [
                  "No heavy lifting over 10 lbs",
                  "Increase protein intake",
                ],
              },
              monitoringOrEscalationTriggers: {
                type: "array",
                items: { type: "string" },
                description: "Symptoms to monitor and escalation triggers",
                example: [
                  "Monitor for signs of infection",
                  "Call if swelling increases",
                ],
              },
            },
          },
          prescriptionDetails: {
            type: "array",
            items: {
              type: "object",
              _dangerousUndocumentedProperties: {
                name: {
                  type: "string",
                  description: "Prescription medication name",
                  example: "Hydrocodone",
                },
                dose: {
                  type: "string",
                  description: "Prescribed dosage",
                  example: "5mg",
                },
                frequency: {
                  type: "string",
                  description: "Dosing frequency",
                  example: "Every 4-6 hours as needed",
                },
                formulation: {
                  type: "string",
                  description: "Medication formulation",
                  example: "Tablet",
                },
                specialInstructions: {
                  type: "string",
                  description: "Special instructions for taking medication",
                  example: "Take with food to reduce nausea",
                },
              },
            },
            description: "Detailed prescription information",
          },
          taskList: {
            type: "array",
            items: {
              type: "object",
              _dangerousUndocumentedProperties: {
                taskName: {
                  type: "string",
                  description: "Name of the care task",
                  example: "Give morning medication",
                },
                scheduledDate: {
                  type: "string",
                  description: "Scheduled date for task in YYYY-MM-DD format",
                  example: "2025-06-21",
                },
                assignedTo: {
                  type: "string",
                  description: "Name of person assigned to task",
                  example: "John Smith",
                },
                smsMessage: {
                  type: "string",
                  description: "SMS message for task reminder (≤160 chars)",
                  example:
                    "Hi John, please give Mom her morning medication at 8am today. Thanks! 💊",
                },
              },
            },
            description: "List of care coordination tasks with SMS reminders",
          },
        },
      },
    },
  },
} as const satisfies OA3.Path
