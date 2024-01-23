#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { addDependency } from "aws-cdk-lib/core/lib/deps";
import {
  EmbeddedLinuxPipelineStack,
  BuildImageDataStack,
  BuildImagePipelineStack,
  BuildImageRepoStack,
  PipelineNetworkStack,
  ImageKind,
  ProjectKind,
} from "aws4embeddedlinux-cdk-lib";
import * as s3 from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';

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
 * Set up networking to allow us to securely attach EFS to our CodeBuild instances.
 */
const vpc = new PipelineNetworkStack(app, {
  ...defaultProps,
});

/**
 * Set up shared Artifacts and ArtifactAccessLogging Bucket for all example pipelines.
 * Using Pipeline Network Stack as a container for the buckets.
 */

const accessLoggingBucket = new s3.Bucket(vpc, 'ArtifactAccessLogging', {
  versioned: true,
  enforceSSL: true,
});

const encryptionKey = new kms.Key(vpc, 'PipelineArtifactKey', {
  removalPolicy: RemovalPolicy.DESTROY,
  enableKeyRotation: true,
});

const artifactBucket = new s3.Bucket(vpc, 'PipelineArtifacts', {
  versioned: true,
  enforceSSL: true,
  serverAccessLogsBucket: accessLoggingBucket,
  serverAccessLogsPrefix: "PipelineArtifacts",
  encryptionKey,
  encryption: s3.BucketEncryption.KMS,
  blockPublicAccess: new s3.BlockPublicAccess(
    s3.BlockPublicAccess.BLOCK_ALL
  ),
});

const outputBucket = new s3.Bucket(vpc, 'PipelineOutput', {
  versioned: true,
  enforceSSL: true,
  serverAccessLogsBucket: accessLoggingBucket,
  serverAccessLogsPrefix: "PipelineOutput",
});

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

const buildImagePipeline = new BuildImagePipelineStack(app, "BuildImagePipeline", {
  ...defaultProps,
  dataBucket: buildImageData.bucket,
  repository: buildImageRepo.repository,
  imageKind: ImageKind.Ubuntu22_04,
  accessLoggingBucket: accessLoggingBucket,
  serverAccessLogsPrefix: "BuildImagePipeline",
  artifactBucket: artifactBucket,
});

/**
 * Create a poky distribution pipeline.
 */
const pokyPipeline = new EmbeddedLinuxPipelineStack(app, "PokyPipeline", {
  ...defaultProps,
  imageRepo: buildImageRepo.repository,
  imageTag: ImageKind.Ubuntu22_04,
  vpc: vpc.vpc,
  accessLoggingBucket: accessLoggingBucket,
  serverAccessLogsPrefix: "PokyPipeline",
  artifactBucket: artifactBucket,
  outputBucket: outputBucket,
  subDirectoryName: "PokyPipeline",
});
pokyPipeline.addDependency(buildImagePipeline)

/**
 * Create a meta-aws-demos pipeline for the Qemu example.
 */
const qemuEmbeddedLinuxPipeline = new EmbeddedLinuxPipelineStack(app, "QemuEmbeddedLinuxPipeline", {
  ...defaultProps,
  imageRepo: buildImageRepo.repository,
  imageTag: ImageKind.Ubuntu22_04,
  vpc: vpc.vpc,
  layerRepoName: "qemu-demo-layer-repo",
  projectKind: ProjectKind.MetaAwsDemo,
  accessLoggingBucket: accessLoggingBucket,
  serverAccessLogsPrefix: "QemuEmbeddedLinuxPipeline",
  artifactBucket: artifactBucket,
  outputBucket: outputBucket,
  subDirectoryName: "QemuEmbeddedLinuxPipeline",
});
qemuEmbeddedLinuxPipeline.addDependency(buildImagePipeline)

/**
 * Create an AMI based on Poky.
 */
const pokyAmiPipeline = new EmbeddedLinuxPipelineStack(app, "PokyAmiPipeline", {
  ...defaultProps,
  imageRepo: buildImageRepo.repository,
  imageTag: ImageKind.Ubuntu22_04,
  vpc: vpc.vpc,
  layerRepoName: "ec2-ami-poky-layer-repo",
  projectKind: ProjectKind.PokyAmi,
  accessLoggingBucket: accessLoggingBucket,
  serverAccessLogsPrefix: "PokyAmiPipeline",
  artifactBucket: artifactBucket,
  subDirectoryName: "PokyAmiPipeline",
});
pokyAmiPipeline.addDependency(buildImagePipeline)

/**
 * Create an kas based image.
 */
const kasPipeline = new EmbeddedLinuxPipelineStack(app, "KasPipeline", {
  ...defaultProps,
  imageRepo: buildImageRepo.repository,
  imageTag: ImageKind.Ubuntu22_04,
  vpc: vpc.vpc,
  layerRepoName: "biga-kas-layer-repo",
  projectKind: ProjectKind.Kas,
  accessLoggingBucket: accessLoggingBucket,
  serverAccessLogsPrefix: "KasPipeline",
  artifactBucket: artifactBucket,
  outputBucket: outputBucket,
  subDirectoryName: "KasPipeline",
});
kasPipeline.addDependency(buildImagePipeline)

/**
 * Create an renesas image.
 */
const renesasPipeline = new EmbeddedLinuxPipelineStack(app, "RenesasPipeline", {
  ...defaultProps,
  imageRepo: buildImageRepo.repository,
  imageTag: ImageKind.Ubuntu22_04,
  vpc: vpc.vpc,
  layerRepoName: "renesas-layer-repo",
  projectKind: ProjectKind.Renesas,
  accessLoggingBucket: accessLoggingBucket,
  serverAccessLogsPrefix: "RenesasPipeline",
  artifactBucket: artifactBucket,
  outputBucket: outputBucket,
  subDirectoryName: "RenesasPipeline",
});
renesasPipeline.addDependency(buildImagePipeline)

/**
 * Create an nxp image.
 */
const nxpImxPipeline = new EmbeddedLinuxPipelineStack(app, "NxpImxPipeline", {
  ...defaultProps,
  imageRepo: buildImageRepo.repository,
  imageTag: ImageKind.Ubuntu22_04,
  vpc: vpc.vpc,
  layerRepoName: "nxp-imx-layer-repo",
  projectKind: ProjectKind.NxpImx,
  accessLoggingBucket: accessLoggingBucket,
  serverAccessLogsPrefix: "NxpImxPipeline",
  artifactBucket: artifactBucket,
  outputBucket: outputBucket,
  subDirectoryName: "NxpImxPipeline",
});
nxpImxPipeline.addDependency(buildImagePipeline)
