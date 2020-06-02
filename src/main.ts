import * as core from '@actions/core'
import * as httpm from '@actions/http-client'
import * as fs from 'fs'

async function run(): Promise<void> {
  try {
    // const masterPassword: string = core.getInput('maven-master-password', {
    //   required: true
    // })

    const http = new httpm.HttpClient('setup-maven', undefined, {
      allowRetries: true,
      maxRetries: 3
    })
    const mavenSettingsUrl =
      'https://byu-oit.github.io/byu-apps-custom-cicd-resources/maven-settings.xml'
    const resp = await http.get(mavenSettingsUrl)
    fs.writeFileSync('$HOME/.m2/settings.xml', await resp.readBody())
    core.debug(new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
