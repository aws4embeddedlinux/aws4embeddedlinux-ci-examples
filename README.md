# aws4embeddedlinux-ci-examples 

TODO - This is work in progress 

## Quickstart
TODO

### Setting Up

#### clone repo


#### install npm packages:

```bash
npm install .
```

#### updating - if you have an already have packages installed before
```bash
npm update
```

#### build:

```bash
npm run build
```

#### deploy cloud resources for all demo pipelines:
```bash
# only required once
cdk bootstrap

cdk deploy --all
```

The newly created pipeline `ubuntu_22_04BuildImagePipeline` from the CodePipeline console will start automatically.

After that completes, the DemoPipeline in the CodePipeline console page is ready to run.


#### destroy cloud resources for all demo pipelines:
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

TODO: Notes contribution process (pre-commit, running tests, formatting and test standards, etc)
