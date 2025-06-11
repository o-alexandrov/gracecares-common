# GitHub Actions

- [Understanding GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions)

## How to develop/debug locally

We use [act (click to see info)](https://github.com/nektos/act#how-does-it-work)

### Prerequisites

- [act](https://github.com/nektos/act#installation)
- [Docker](https://docs.docker.com/get-docker)

### CMDs we use

```sh
# flags list: https://github.com/nektos/act#flags

# to run all workflows
act --pull --reuse

# to run a specific workflow
act --pull --reuse --workflows .github/workflows/example.yml
```
