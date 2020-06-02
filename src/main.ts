import * as core from '@actions/core'
import * as httpm from '@actions/http-client'
import * as fs from 'fs'
import * as path from 'path'

async function run(): Promise<void> {
  try {
    const masterPassword: string = core.getInput('maven-master-password', {
      required: true
    })

    const http = new httpm.HttpClient('setup-maven', undefined, {
      allowRetries: true,
      maxRetries: 3
    })

    const homeDir = process.env['HOME'] || '/home/runner'
    const mavenHome = path.join(homeDir, '.m2')
    fs.mkdirSync(mavenHome)
    core.debug(`Created maven home as '${mavenHome}'`)

    const mavenSettingsUrl =
      'https://byu-oit.github.io/byu-apps-custom-cicd-resources/maven-settings.xml'
    const resp = await http.get(mavenSettingsUrl)
    core.debug('Downloaded maven-settings.xml file')

    const mavenSettingsFilePath = path.join(mavenHome, 'settings.xml')
    fs.writeFileSync(mavenSettingsFilePath, await resp.readBody())
    core.debug(
      `Wrote contents of downloaded maven-settings.xml to ${mavenSettingsFilePath}`
    )

    const mavenSecuritySettings = `<settingsSecurity><master>${masterPassword}</master></settingsSecurity>`
    const mavenSecuritySettingsFilePath = path.join(
      mavenHome,
      'settings-security.xml'
    )
    fs.writeFileSync(mavenSecuritySettingsFilePath, mavenSecuritySettings)
    core.debug(`Added ${mavenSecuritySettingsFilePath}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
