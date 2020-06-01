import * as core from '@actions/core'

function run(): void {
  try {
    const masterPassword: string = core.getInput('maven-master-password')

    core.debug(`Got input master password ${masterPassword}`) // TODO remove
    core.debug(new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
