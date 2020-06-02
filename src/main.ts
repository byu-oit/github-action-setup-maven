import * as core from '@actions/core'

function run(): void {
  try {
    // const masterPassword: string = core.getInput('maven-master-password', {
    //   required: true
    // })
    const mavenHome = process.env['MAVEN_HOME'] || ''
    core.debug(`mavenHome ${mavenHome}`)

    core.debug(new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
