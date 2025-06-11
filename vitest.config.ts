import { defineConfig } from "vitest/config"

import { getConfig } from "./tdd-unit-testing/vitest.config"

export default defineConfig(
  getConfig({
    env: {
      addAWSCredentials: false,
    },
  }),
)
