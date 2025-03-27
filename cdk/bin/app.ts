#!/usr/bin/env node
import * as path from "path";

import * as cdk from "aws-cdk-lib";
import {
  EmbeddedLinuxCodePipelineBaseImageStack,
  EmbeddedLinuxCodePipelineStack,
  EmbeddedLinuxCodeBuildProjectStack,
  PipelineResourcesStack,
  ProjectType,
} from "aws4embeddedlinux-cdk-lib";

const resource_prefix = "aws4el-ci";

const app = new cdk.App();

/* See https://docs.aws.amazon.com/sdkref/latest/guide/access.html for details on how to access AWS. */
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || process.env.AWS_DEFAULT_REGION,
};

/**
 * Use these default props to enable termination protection and tag related AWS
 * Resources for tracking purposes.
 */
const defaultProps: cdk.StackProps = {
  tags: { PURPOSE: "META-AWS-BUILD" },
  terminationProtection: false, // TODO: enable or remove.
  env,
};

/**
 * Set up networking and other reources to allow us to securely attach EFS to our CodeBuild instances.
 */
const pipelineResourcesStack = new PipelineResourcesStack(
  app,
  `${resource_prefix}-resources`,
  {
    ...defaultProps,
    resource_prefix: resource_prefix,
  },
);

const baseImageStack = new EmbeddedLinuxCodePipelineBaseImageStack(
  app,
  `${resource_prefix}-pipeline-base-image`,
  {
    ...defaultProps,
    pipelineSourceBucket: pipelineResourcesStack.pipelineSourceBucket,
    pipelineArtifactBucket: pipelineResourcesStack.pipelineArtifactBucket,
    ecrRepository: pipelineResourcesStack.ecrRepository,
    encryptionKey: pipelineResourcesStack.encryptionKey,
  },
);

/**
 * Create a codebuild project.
 */
new EmbeddedLinuxCodeBuildProjectStack(
  app,
  `${resource_prefix}-codebuild-project`,
  {
    ...defaultProps,
    ecrRepository: baseImageStack.ecrRepository,
    ecrRepositoryImageTag: baseImageStack.ecrRepositoryImageTag,
    vpc: pipelineResourcesStack.vpc,
    encryptionKey: pipelineResourcesStack.encryptionKey,
  },
);

/**
 * Create project pipelines.
 */
const pipelines = new cdk.Stack(app, `${resource_prefix}-pipelines`);

const projectTypes: ProjectType[] = [
  ProjectType.Poky,
  ProjectType.PokyAmi,
  ProjectType.QEmu,
  ProjectType.Kas,
  ProjectType.Renesas,
  ProjectType.NxpImx,
];
for (const projectType of projectTypes) {
  const projectPipeline = new EmbeddedLinuxCodePipelineStack(
    app,
    `${resource_prefix}-pipeline-${projectType}`,
    {
      ...defaultProps,
      projectType: projectType,
      ecrRepository: baseImageStack.ecrRepository,
      ecrRepositoryImageTag: baseImageStack.ecrRepositoryImageTag,
      pipelineSourceBucket: pipelineResourcesStack.pipelineSourceBucket,
      pipelineArtifactBucket: pipelineResourcesStack.pipelineArtifactBucket,
      pipelineOutputBucket: pipelineResourcesStack.pipelineOutputBucket,
      pipelineArtifactPrefix: `pipeline-${projectType}`,
      vpc: pipelineResourcesStack.vpc,
      encryptionKey: pipelineResourcesStack.encryptionKey,
    },
  );
  projectPipeline.addDependency(pipelineResourcesStack);
  pipelines.addDependency(projectPipeline);
}

/**
 * Create custom project pipeline.
 */
const projectType = ProjectType.Custom;

const sourceCustomPath: string = path.join(
  __dirname,
  "..",
  "source-repo",
  projectType,
);
console.log(`Using custom source path: ${sourceCustomPath}`);

const projectPipeline = new EmbeddedLinuxCodePipelineStack(
  app,
  `${resource_prefix}-pipeline-${projectType}`,
  {
    ...defaultProps,
    projectType: projectType,
    ecrRepository: baseImageStack.ecrRepository,
    ecrRepositoryImageTag: baseImageStack.ecrRepositoryImageTag,
    pipelineSourceBucket: pipelineResourcesStack.pipelineSourceBucket,
    pipelineArtifactBucket: pipelineResourcesStack.pipelineArtifactBucket,
    pipelineOutputBucket: pipelineResourcesStack.pipelineOutputBucket,
    pipelineArtifactPrefix: `pipeline-${projectType}`,
    vpc: pipelineResourcesStack.vpc,
    encryptionKey: pipelineResourcesStack.encryptionKey,
    sourceCustomPath: sourceCustomPath,
  },
);
projectPipeline.addDependency(pipelineResourcesStack);
pipelines.addDependency(projectPipeline);

// Synthetize the app
app.synth();
