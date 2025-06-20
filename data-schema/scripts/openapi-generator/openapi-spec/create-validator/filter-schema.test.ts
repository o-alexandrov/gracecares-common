import { filterSchema } from "./filter-schema"

/** unused */
describe.skip(``, () => {
  it(`filters out unwanted fields`, () => {
    const before = {
      additionalProperties: false,
      type: `object`,
      properties: {
        end: { type: `number`, format: `int32`, example: 1648999378 },
        title: {
          type: `string`,
          example: `80 chars. The tale started with a simple dream. Lorem Ipsum's simply dummy text.`,
          preprocess: `trim`,
          pattern: `(?=^.{1,}$)(?=^.{0,80}$)`,
        },
        r18: {
          type: `string`,
          default: `0`,
          enum: [`0`, `1`],
          description: [
            `Whether content is NSFW (18+):`,
            `- \`0\` (notR18)`,
            `- \`1\` (r18)`,
          ],
        },
        employeeID: {
          type: `string`,
          example: `0123456789ABCDEFGHIJK`,
          pattern: `(?=^.{21}$)(?=^[\\w~.-]+$)`,
        },
      },
      required: [`price`, `title`, `desc`, `r18`],
    }

    filterSchema(before)

    expect(before).toEqual({
      additionalProperties: false,
      type: `object`,
      properties: {
        end: { type: `number`, format: `int32` },
        title: {
          type: `string`,
          preprocess: `trim`,
          pattern: `(?=^.{1,}$)(?=^.{0,80}$)`,
        },
        r18: {
          default: `0`,
          enum: [`0`, `1`],
        },
        employeeID: {
          type: `string`,
          pattern: `(?=^.{21}$)(?=^[\\w~.-]+$)`,
        },
      },
      required: [`price`, `title`, `desc`, `r18`],
    })
  })
})
