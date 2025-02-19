import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

/**
 * Remove hashed asset values and put a normalized name in instead.
 */
export function normalizedTemplateFromStack(stack: cdk.Stack): Template {
  const templateWithRandomKeys = Template.fromStack(stack);
  const templateWithConstKeys = JSON.parse(
    JSON.stringify(templateWithRandomKeys.toJSON()).replace(
      /[a-z0-9]{64}\.(zip|sh)/g,
      "arbitrary-file.ext",
    ),
  );

  return templateWithConstKeys;
}

export const DEFAULT_ENV = {
  account: "111111111111",
  region: "eu-central-1",
};
