#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import {
  EmbeddedLinuxPipelineStack,
  BuildImageDataStack,
  BuildImagePipelineStack,
  BuildImageRepoStack,
  PipelineNetworkStack,
  ImageKind,
  ProjectKind,
} from "aws4embeddedlinux-cdk-lib";

const app = new cdk.App();

/* See https://docs.aws.amazon.com/sdkref/latest/guide/access.html for details on how to access AWS. */
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
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
 * Set up the Stacks that create our Build Host.
 */
const buildImageData = new BuildImageDataStack(app, "BuildImageData", {
  ...defaultProps,
  bucketName: `build-image-data-${env.account}-${env.region}`,
});

const buildImageRepo = new BuildImageRepoStack(app, "BuildImageRepo", {
  ...defaultProps,
});

new BuildImagePipelineStack(app, "BuildImagePipeline", {
  ...defaultProps,
  dataBucket: buildImageData.bucket,
  repository: buildImageRepo.repository,
  imageKind: ImageKind.Ubuntu22_04,
});

/**
 * Set up networking to allow us to securely attach EFS to our CodeBuild instances.
 */
const vpc = new PipelineNetworkStack(app, {
  ...defaultProps,
});

/**
 * Create a poky distribution pipeline.
 */
new EmbeddedLinuxPipelineStack(app, "PokyPipeline", {
  ...defaultProps,
  imageRepo: buildImageRepo.repository,
  imageTag: ImageKind.Ubuntu22_04,
  vpc: vpc.vpc,
});

/**
 * Create a meta-aws-demos pipeline for the Qemu example.
 */
new EmbeddedLinuxPipelineStack(app, "QemuEmbeddedLinuxPipeline", {
  ...defaultProps,
  imageRepo: buildImageRepo.repository,
  imageTag: ImageKind.Ubuntu22_04,
  vpc: vpc.vpc,
  layerRepoName: "qemu-demo-layer-repo",
  projectKind: ProjectKind.MetaAwsDemo,
});

/**
 * Create an AMI based on Poky.
 */
new EmbeddedLinuxPipelineStack(app, "PokyAmiPipeline", {
  ...defaultProps,
  imageRepo: buildImageRepo.repository,
  imageTag: ImageKind.Ubuntu22_04,
  vpc: vpc.vpc,
  layerRepoName: "ec2-ami-poky-layer-repo",
  projectKind: ProjectKind.PokyAmi,
});

/**
 * Create an kas based image.
 */
new EmbeddedLinuxPipelineStack(app, "KasPipeline", {
  ...defaultProps,
  imageRepo: buildImageRepo.repository,
  imageTag: ImageKind.Ubuntu22_04,
  vpc: vpc.vpc,
  layerRepoName: "biga-kas-layer-repo",
  projectKind: ProjectKind.Kas,
});

/**
 * Create an renesas image.
 */
new EmbeddedLinuxPipelineStack(app, "RenesasPipeline", {
  ...defaultProps,
  imageRepo: buildImageRepo.repository,
  imageTag: ImageKind.Ubuntu22_04,
  vpc: vpc.vpc,
  layerRepoName: "renesas-layer-repo",
  projectKind: ProjectKind.Renesas,
});

/**
 * Create an nxp image.
 */
new EmbeddedLinuxPipelineStack(app, "NxpImxPipeline", {
  ...defaultProps,
  imageRepo: buildImageRepo.repository,
  imageTag: ImageKind.Ubuntu22_04,
  vpc: vpc.vpc,
  layerRepoName: "nxp-imx-layer-repo",
  projectKind: ProjectKind.NxpImx,
});
