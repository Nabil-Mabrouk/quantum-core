# Quantum Core

This repository contains the source code for Quantum Core, an Engineering OS for process simulation and optimization.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

-   `apps/studio`: a [Next.js](https://nextjs.org/) application that provides the main user interface for Quantum Core.
-   `apps/engine`: a [Python](https://www.python.org/) application that contains the core simulation and optimization engine.
-   `docs/user-guide`: a [Nextra](https://nextra.site/) site for the user documentation.
-   `packages/database`: a [Prisma](https://www.prisma.io/) package for database management.
-   `packages/ui`: a stub React component library shared by the `studio` application.
-   `packages/eslint-config`: `eslint` configurations.
-   `packages/typescript-config`: `tsconfig.json`s used throughout the monorepo.

### Documentation

The documentation for this project is located in the `docs` directory.

-   [User Guide](./docs/user-guide): For users of the Quantum Core platform.
-   [Developer Documentation](./docs/dev-docs): For developers contributing to the project.

### Development

To develop all apps and packages, run the following command:

```
pnpm dev
```

### Build

To build all apps and packages, run the following command:

```
pnpm build
```
