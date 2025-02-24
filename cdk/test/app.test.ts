import * as cdk from "aws-cdk-lib";
import * as assertions from "aws-cdk-lib/assertions";
import { normalizedTemplateFromStack } from "./util";

describe("app", () => {
  // let stack: cdk.Stack, app: cdk.App, template: assertions.Template;
  // const props: PipelineResourcesProps = {
  //   resource_prefix: "test",
  //   env: DEFAULT_ENV,
  // };
  // beforeAll(() => {
  //   // GIVEN
  //   app = new cdk.App();
  //   stack = new PipelineResourcesStack(app, "MyTestStack", props);
  //   template = assertions.Template.fromStack(stack);
  // });

  // test("Snapshot", () => {
  //   /* We must change some randomly generated file names used in the S3 asset construct. */
  //   const templateWithConstKeys = normalizedTemplateFromStack(stack);
  //   expect(templateWithConstKeys).toMatchSnapshot();
  // });
});