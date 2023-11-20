# aws4embeddedlinux-ci-examples
This repo is a showcase for the capabilities of [aws4embeddedlinux-ci](https://github.com/aws4embeddedlinux/aws4embeddedlinux-ci.git) cdk library.

## Examples
After a sucessful setup you will have those example pipelines ready to run.

### A Simple Poky Based Pipeline
This example will build a Yocto core-image-minimal based on a manifest.xml using the repo tool. Also enable CVE checking for it.

See AWS CodeBuild pipeline: PokyPipeline-DemoPipeline*

#### A slightly modified version using KAS tool instead of repo:
See AWS CodeBuild pipeline: KasPipeline-DemoPipeline*

#### A slightly modified version building a qemu pipeline:
See AWS CodeBuild pipeline: QemuDemoPipeline-DemoPipeline*

### A Simple Poky Based Pipeline
This example will build a Yocto core-image-minimal based on a manifest.xml using the repo tool. Also enable CVE checking for it.

See AWS CodeBuild pipeline: PokyPipeline-DemoPipeline*


### A Poky Based EC2 AMI Pipeline
Yocto can be used to create an EC2 AMI. This example demonstrates using this library to create a pipeline which builds an AMI and registers it in your account.

See AWS CodeBuild pipeline: PokyAmiPipeline-DemoPipeline*

### Using pre-build, proprietary artifacts in a Pipeline

This example is based on this [work](https://elinux.org/R-Car/Boards/Yocto-Gen3/v5.9.0) to build an image for Renesas R-Car-H3 Starter Kit Premier (unofficial name - H3ULCB) board including the proprietary graphics and multimedia drivers from Renesas.

You need to download Multimedia and Graphics library and related Linux drivers, please from the following link (registration necessary):
https://www.renesas.com/us/en/application/automotive/r-car-h3-m3-h2-m2-e2-documents-software

#### Download two files:

R-Car_Gen3_Series_Evaluation_Software_Package_for_Linux-20220121.zip
R-Car_Gen3_Series_Evaluation_Software_Package_of_Linux_Drivers-20220121.zip

Graphic drivers are required for Wayland. Multimedia drivers are optional.

#### Steps to build the image

Create a folder named `proprietary` in the root of the source repo. Put those two downloaded files into this folder. After you did deploy the build pipeline and uncomment the `#TODO` in the build.sh file.

Now a build should automatically start, succeed and you will get an image containing the proprietary graphics and multimedia drivers.

See AWS CodeBuild pipeline: RenesasPipeline-DemoPipeline*

##

## How to get started?

### clone repo
```bash
git clone https://github.com/aws4embeddedlinux/aws4embeddedlinux-ci-examples.git
```

### install npm packages:

```bash
cd aws4embeddedlinux-ci-examples
npm install .
```

### updating
Only if you had already packages installed before or the aws4embeddedlinux-ci library changed.
```bash
npm update
```

### build:

```bash
npm run build
```

### deploy cloud resources for all demo pipelines:
#### pre-requisites: follow the [cdk guide on bootstrapping](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html#bootstrapping-customizing:~:text=the%20legacy%20bucket.-,Customizing%20bootstrapping,-There%20are%20two) your resources

e.g.
```bash
cdk bootstrap
```

#### deploy

```bash
cdk deploy --all
```

The newly created pipeline `ubuntu_22_04BuildImagePipeline` from the CodePipeline console will start automatically.

After that completes, the DemoPipeline in the CodePipeline console page is ready to run.


### destroy cloud resources for all demo pipelines:
```bash
cdk destroy --all
```

## Useful commands

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

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for more information.

## License

This library is licensed under the MIT-0 License. See the [LICENSE](LICENSE) file.
