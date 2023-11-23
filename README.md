# aws4embeddedlinux-ci-examples

## Getting Started
This repository shows ways to use the [aws4embeddedlinux-ci](https://github.com/aws4embeddedlinux/aws4embeddedlinux-ci.git) library.

In order to use these examples, you must set up the [CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html), including
installing the CDK tool and bootstrapping the account you wish to deploy to. Additionally, you must have [Node](https://nodejs.org/en/) installed.

> [!NOTE]
> This library is tested against Node Versions 16, 18, and 20. If these versions are not available for your system, we recommend
> using [NVM](https://github.com/nvm-sh/nvm) to install a compatible version.

### Clone and Setup NPM Project
```bash
git clone https://github.com/aws4embeddedlinux/aws4embeddedlinux-ci-examples.git
cd aws4embeddedlinux-ci-examples
npm install .
npm run build
```

Note that while the CDK projects often do not require that you invoke the build command separately, doing so will ensure various assets
in the library are packaged correctly.

### Deploying

To deploy _all_ the pipeline examples, you can use the CDK deploy command:

```bash
cdk deploy --all
```

Alternatively to deploy just a specific pipeline example, you can use the CDK deploy command:

EXAMPLE can be one or more of those: PokyPipeline, QemuEmbeddedLinuxPipeline, PokyAmiPipeline, KasPipeline, RenesasPipeline, NxpImxPipeline

```bash
cdk deploy <EXAMPLE>
```

The pipelines can be found in the `Developer Tools > Code Pipeline > Pipelines` Console page. The newly created
pipeline `ubuntu_22_04BuildImagePipeline` should start automatically. If not, it will need to be run before other
pipelines will work correctly. Once it is complete, the EmbeddedLinuxPipeline in the CodePipeline console page is ready to run.

### Removing Pipelines
The `cdk destroy` command can be used to remove individual pipelines and their related resources. This can also be done in the CloudFormation Console Page.
**Do not delete stacks while a CodePipeline is running, this can lead to unexpected failures!**

To remove all the resources associated with this application:
```bash
cdk destroy --all
```

## Examples
Several example pipelines are provided. Each one demonstrates a different aspect of how to build a Yocto image with AWS.

### A Simple Poky Based Pipeline
This example will build the `core-image-minimal` image from Poky using the repo tool to manage layers. CVE checking is also enabled in the buildspec file.

The recommended place to view this is from the `Developer Tools > Code Pipeline > Pipelines` page. The pipeline will start with `PokyPipeline-`
followed by some unique identifier. From the pipeline page, you can find the CodeCommit source repository, the CodeBuild Project (with build logs),
and the S3 bucket that the image is uploaded to, at the end.

Example stack name: PokyPipeline

#### Using Kas
The Kas example shows how to use a [Kas Config](https://github.com/aws4embeddedlinux/aws4embeddedlinux-ci/blob/main/source-repo/kas/kas.yml) to manage
layers. This tool can help programatically manage layers and config with tighter Yocto integration than Git Submodules or the Repo tool.

See the AWS CodeBuild pipeline: KasPipeline-EmbeddedLinuxPipeline*

Example stack name: KasPipeline

#### A slightly modified version building a qemu pipeline:
This example builds a Qemu based image using [meta-aws-demos](https://github.com/aws4embeddedlinux/meta-aws-demos). The Qemu image can be run in
the CodeBuild environment. Using SLIRP networking, [OEQA testing](https://docs.yoctoproject.org/singleindex.html#performing-automated-runtime-testing)
such as ptest can be run in the pipeline.

See the AWS CodeBuild pipeline: QemuEmbeddedLinuxPipeline-EmbeddedLinuxPipeline*

### A Poky Based EC2 AMI Pipeline
Yocto can be used to create an EC2 AMI. This example builds an AMI based on Poky and meta-aws and exports it to your AMI registry using
the [VM Import/Export Service](https://docs.aws.amazon.com/vm-import/latest/userguide/what-is-vmimport.html).

The pipeline name starts with `PokyAmiPipeline-` in the CodePipeline page.

Example stack name: PokyAmiPipeline

### A NXP / IMX Pipeline
This example will build an image for
the [i.MX 6ULL EVK](https://www.nxp.com/design/development-boards/i-mx-evaluation-and-development-boards/evaluation-kit-for-the-i-mx-6ull-and-6ulz-applications-processor:MCIMX6ULL-EVK) board.

NXP requires users to accept and comply with a EULA in order to build and as such the buildspec will require modification before the build succeeds. See the [IMX Yocto Users Guide](https://www.nxp.com/docs/en/user-guide/IMX_YOCTO_PROJECT_USERS_GUIDE.pdf) for more detail.

The pipeline name starts with `NxpImxPipeline-` in the CodePipeline page.

Example stack name: NxpImxPipeline

### Using pre-built, proprietary artifacts in a Pipeline

This example is based on this [work](https://elinux.org/R-Car/Boards/Yocto-Gen3/v5.9.0) to build an image for Renesas R-Car-H3 Starter Kit
Premier board (unofficial name - H3ULCB) including the proprietary graphics and multimedia drivers from Renesas.

Download the Multimedia and Graphics library and related Linux drivers from the following link (registration necessary):
https://www.renesas.com/us/en/application/automotive/r-car-h3-m3-h2-m2-e2-documents-software

#### Download two files:

- R-Car_Gen3_Series_Evaluation_Software_Package_for_Linux-20220121.zip
- R-Car_Gen3_Series_Evaluation_Software_Package_of_Linux_Drivers-20220121.zip

Graphic drivers are required for Wayland. Multimedia drivers are optional.

#### Steps to build the image

1. Create a folder named `proprietary` in the root of the source repo, and put those two downloaded files into this folder.
1. Deploy the build pipeline and uncomment the `#TODO` in the build.sh file.
1. A build should automatically start. Once it succeeds you will get an image containing the proprietary graphics and multimedia drivers.

See the AWS CodeBuild pipeline: RenesasPipeline-EmbeddedLinuxPipeline*

Example stack name: RenesasPipeline

---

## Useful NPM and CDK commands

-   `npm run build` compile typescript to js
-   `npm run watch` watch for changes and compile
-   `npm run test` perform the jest unit tests
-   `cdk deploy` deploy this stack to your default AWS account/region
-   `cdk diff` compare deployed stack with current state
-   `cdk synth` emits the synthesized CloudFormation template

Project Specific:
-   `npm run format` runs prettier and eslint on the repository
-   `npm run zip-data` bundles the files for creating build host containers
-   `npm run check` checks for lint and format issues
-   `npm run docs` to generate documentation

## Security

See [SECURITY](SECURITY.md) for more information.

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for more information.

## License

This library is licensed under the MIT-0 License. See the [LICENSE](LICENSE) file.
