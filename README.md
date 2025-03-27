# aws4embeddedlinux-ci-examples

This repository shows ways to use the [aws4embeddedlinux-ci](https://github.com/aws4embeddedlinux/aws4embeddedlinux-ci.git) library.

In order to use these examples, you must set up the [CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html), including
installing the CDK tool and bootstrapping the account you wish to deploy to. Additionally, you must have [Node](https://nodejs.org/en/) installed.

> [!NOTE]
> This library is tested against Node Versions 22. If these version is not available for your system, we recommend using [NVM](https://github.com/nvm-sh/nvm) to install a compatible version.

---

## Setup

### Setting environment variables

```bash
export AWS_PROFILE="default"
export AWS_DEFAULT_REGION=$(aws configure get region --profile ${AWS_PROFILE})
export AWS_DEFAULT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text --profile ${AWS_PROFILE})

echo "PROFILE : $AWS_PROFILE"
echo "ACCOUNT : $AWS_DEFAULT_ACCOUNT"
echo "REGION  : $AWS_DEFAULT_REGION"
```

### Clone the project

```bash
git clone https://github.com/aws4embeddedlinux/aws4embeddedlinux-ci-examples.git
cd aws4embeddedlinux-ci-examples
```

### Bootstrap CDK

> [!NOTE]
> Only required once unless you upgrade your cdk version

```bash
cdk bootstrap aws://$AWS_DEFAULT_ACCOUNT/$AWS_DEFAULT_REGION
```

### Install packages and build the stack

First move to the `cdk` folder:
 
```bash
cd cdk
```

Then you will need to install the CDK library including the `aws4embeddedlinux-ci` library either using `npm`:

```bash
npm install 
npm run build
```

of `yarn':

```bash
yarn install
yarn build
```

> If you are not familliar with Yarn, please refer to the [documentation](https://yarnpkg.com/getting-started).

> [!NOTE]
>
> While the CDK projects often do not require that you invoke the build command separately, doing so will ensure various assets in the library are packaged correctly.

### Deploying the base image pipeline stack

First, you will need to deploy the *base ubuntu* image pipeline (`aws4el-ci-pipeline-base-image`).

```bash
cdk deploy aws4el-ci-pipeline-base-image --require-approval never --progress bar
```

The created pipeline can be found in the AWS console under `Developer Tools > Pipeline - CodePipeline > Pipelines`. 

The newly created pipeline `aws4el-ci-pipeline-base-image` should start automatically. If not, you can start it manually.

> _NOTE_:
> The `aws4el-ci-pipeline-base-image` will need to be successfully completed before other pipelines can work correctly. 

**_Expected build times: 5 minutes_**

You can check that the pipeline completed sucessfully when the following command returns an ***imageIds** entry :

```bash
aws ecr list-images \
    --repository-name "aws4el-ci-$AWS_DEFAULT_ACCOUNT-$AWS_DEFAULT_REGION-repo" \
    --query "imageIds[?imageTag=='aws4el-ci-pipeline-base-image']"
```

Once the pipeline completes and the image is available in the ECR repository, the other `EmbeddedLinuxPipeline` stacks can be created and executed.

### Deploying the project pipeline stack

To deploy a specific pipeline type, you can use the following CDK deploy command:

```bash
cdk deploy <pipeline-id> --require-approval
```

where **\<pipeline-id\>** can be one or more of the following: 

| Name                | Pipeline stack id             |
|---------------------|-------------------------------|
| Poky                | `aws4el-ci-pipeline-poky`     |
| Poky Ami            | `aws4el-ci-pipeline-poky-ami` |
| Qemu Embedded Linux | `aws4el-ci-pipeline-qemu`     |
| Kas                 | `aws4el-ci-pipeline-kas`      |
| Renesas             | `aws4el-ci-pipeline-renesas`  |
| NXP-IMX             | `aws4el-ci-pipeline-nxp-imx`  |
| Custom              | `aws4el-ci-pipeline-custom`   |

Again, the created pipeline can be found in the AWS console under `Developer Tools > Pipeline - CodePipeline > Pipelines`. 

> ### **NXP-IMX**
> 
> The deployed pipeline for **NXP-IMX** will not complete as you should first accept the EULA and update the `build.buildspec.yml` file accordingly. See the [IMX Yocto Users Guide](https://www.nxp.com/docs/en/user-guide/IMX_YOCTO_PROJECT_USERS_GUIDE.pdf) for more detail.
>
> The source files are available in a S3 bucket that you can get with the following command:
>
> ```sh
> aws cloudformation describe-stacks \
>     --stack-name aws4el-ci-pipeline-nxp-imx \
>     --output text \
>     --query "Stacks[0].Outputs[?OutputKey=='SourceURI'].OutputValue"
> ```
>
> Once you have adjusted the content, you can update and upload the zip back to Amazon S3, and the pipeline will restart.
>

> ### **Renesas**
> 
> The deployed pipeline for **Renesas** will complete. However, it won't include the Multimedia and Graphics library and related Linux drivers. See the [Renesas](https://github.com/adadouche/aws4embeddedlinux-ci/blob/dev-adadouche/README.md#renesas) section for more detail.
> The source files are available in a S3 bucket that you can get with the following command:
>
> ```sh
>   aws cloudformation describe-stacks \
>     --stack-name aws4el-ci-pipeline-renesas \
>     --output text \
>     --query "Stacks[0].Outputs[?OutputKey=='SourceURI'].OutputValue"
> ```
>
> Once you have adjusted the content, you can update and upload the zip back to Amazon S3, and the pipeline will restart.
>

> ### **Custom Pipeline**
> 
> When using the **Custom** pipeline, you will need to provide your own `build.buildspec.yml` file. 
>
> To do so, you will provide a path in one of the `EmbeddedLinuxCodePipelineStack` props (`sourceCustomPath` property).
> This path repsent the folder where the `build.buildspec.yml` file is located.
> Make sure to use a full path instead of a relative path to avoid any issues.
>
> If the `build.buildspec.yml` file is not present in the provided folder path, the stack will fail to deploy.
>
> You can also provide any additional files need to execute your build in the same folder.
>

To deploy _all_ the example pipelines, you can use the CDK deploy command:

```bash
cdk deploy aws4el-ci-pipelines --require-approval never --concurrency 3
```

> [!NOTE] 
> 
> `aws4el-ci-pipelines`is an empty stack that depends on the other stacks, so that if you deploy it, it will deploy the others.
>

### Cleanup

The `cdk destroy` command can be used to remove individual pipelines and their related resources. This can also be done in the CloudFormation Console Page.

> **Do not delete stacks while a CodePipeline is running, this can lead to unexpected failures!**

To remove all the resources associated with this application:

```bash
cdk destroy --all --force
```

## Security

See [SECURITY](SECURITY.md) for more information.

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for more information.

## License

This library is licensed under the MIT-0 License. See the [LICENSE](LICENSE) file.
