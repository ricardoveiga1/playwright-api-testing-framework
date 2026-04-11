// docs https://playwright.dev/docs/test-advanced#global-setup-and-teardown

import { FullConfig } from "@playwright/test";
import dotenv from "dotenv";

async function globalSetup(config: FullConfig) {
  
  if(process.env.TEST_ENV) {
    // Use env-specific config
    dotenv.config({
      path: `.env.${process.env.TEST_ENV}`,
      override: true
    })
  } else {
    // Load default .env file
    dotenv.config()
  }

}

export default globalSetup;