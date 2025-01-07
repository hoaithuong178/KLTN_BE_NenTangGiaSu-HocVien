# Be

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/nest?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/BfQdUhgANO)

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve be
```

To create a production bundle:

```sh
npx nx build be
```

To see all available targets to run for a project, run:

```sh
npx nx show project be
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/nest:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/node:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/nest?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

```bash
docker run --name api-gateway -p 4000:4000 -e PORT=4000 -e RABBIT_MQ_URL=amqps://xlrmcknw:L-atmZP80_S3IwEtY9lTyeKN5pzgWI1z@armadillo.rmq.cloudamqp.com/xlrmcknw -e JWT_ACCESS_SECRET=5118dc7e93cf28d9b5ff7ca4fc48420348160a13e45f7e3e1cb6e253239285ce -e JWT_ACCESS_EXPIRATION=7d -e JWT_REFRESH_SECRET=98be34600863595b2fb649f265f872fd35dec938c2de7ddf3ffb844af687e9897af2f546f04fcf41b91c600646c76fc7c27415798468c600aaf0bca47d90f4e1a612b428e92bbf2eedd136eee0283ebf6275e58f2e0e76befd6d53104782631c5ec2a4e1e91bc52d4e56773dbb80e784c8811daa773354f7ae3e9e86063cb60c -e JWT_REFRESH_EXPIRATION=14d -d apigateway
```

```bash
docker run --name user-service -p 4001:4001 -e PORT=4000 -e RABBIT_MQ_URL=amqps://xlrmcknw:L-atmZP80_S3IwEtY9lTyeKN5pzgWI1z@armadillo.rmq.cloudamqp.com/xlrmcknw -e JWT_ACCESS_SECRET=5118dc7e93cf28d9b5ff7ca4fc48420348160a13e45f7e3e1cb6e253239285ce -e JWT_ACCESS_EXPIRATION=7d -e JWT_REFRESH_SECRET=98be34600863595b2fb649f265f872fd35dec938c2de7ddf3ffb844af687e9897af2f546f04fcf41b91c600646c76fc7c27415798468c600aaf0bca47d90f4e1a612b428e92bbf2eedd136eee0283ebf6275e58f2e0e76befd6d53104782631c5ec2a4e1e91bc52d4e56773dbb80e784c8811daa773354f7ae3e9e86063cb60c -e JWT_REFRESH_EXPIRATION=14d -e DATABASE_URL="postgresql://user-service_owner:0Eiwmk5OWxRr@ep-polished-cherry-a10lr4ex.ap-southeast-1.aws.neon.tech/user-service?sslmode=require" -d userservice
```
