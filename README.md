# Matterport Developer Support Examples

A place for the Matterport Support Team for SDK to share example code for customer use cases

A Monorepo with Vite / React / Typescript

## Setup Guide.

1. Install [pnpm](https://pnpm.io/installation)
2. pnpm install
3. cp .sdk_examples.config.example.json .sdk_examples.config.json
4. Add your SDK Key to the config file
5. pnpm dev

## Examples

### Hello World

This example bootstraps the WebComponent within a React Application.

```
pnpm --filter hello-world dev
```

### 3D Tags

This example replaces Tags with 3D Spheres and provides resources for using strongly typed Scene Components.

```
pnpm --filter 3d-tags dev
```

## License

The example code in this repository is released under the MIT license. For the license for the Showcase SDK itself, please see [these terms](https://matterport.com/legal/platform-subscription-agreement).
