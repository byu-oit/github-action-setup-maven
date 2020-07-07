![CI](https://github.com/byu-oit/github-action-setup-maven/workflows/CI/badge.svg)
![Test](https://github.com/byu-oit/github-action-setup-maven/workflows/Test/badge.svg)

# ![BYU logo](https://www.hscripts.com/freeimages/logos/university-logos/byu/byu-logo-clipart-128.gif) github-action-setup-maven
A GitHub Action for setting up a workflow to use BYU's maven environment

This action will create the maven `settings.xml` file along with the `security-settings.xml` file to allow your workflow to access the BYU maven repository.

**Note:** This action does not install maven, nor java (both are already included in workflows by default). 
If you need to install a different version of java you can use the [setup-java action](https://github.com/actions/setup-java).

## Usage
```yaml
on: push
# ...
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    # ... 
    - name: Setup Maven
      uses: byu-oit/github-action-setup-maven@v1
      with:
        maven-master-password: ${{ secrets.maven_master_password }}
    - run: mvn install
```

After this step your workflow should have access to the BYU maven repository (Artifactory).
Your normal `mvn` commands will work just fine.

### Example with caching
```yaml
on: push
# ...
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    # ... 
    - name: Setup Maven
      uses: byu-oit/github-action-setup-maven@v1
      with:
        maven-master-password: ${{ secrets.maven_master_password }}
    - name: Caching Maven
      id: cache-maven
      uses: actions/cache@v2
      with:
        path: ~/.m2/repository
        key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}
        restore-keys: |
          ${{ runner.os }}-maven- 
    - name: Resolve Maven Dependencies
      if: steps.cache-maven.outputs.cache-hit != 'true'
      run: mvn dependency:resolve
    - run: mvn install
```

## Inputs
* `maven-master-password` - (**required**) pass in the encrypted maven master password that was used to create the encrypted secrets in the maven settings file.
Use GitHub secrets, **NEVER** commit the password in plaintext.

## Contributing
Hopefully this is useful to others at BYU.
Feel free to ask me some questions about it, but I make no promises about being able to commit time to support it.

GitHub Actions will run the entry point from the action.yml.
In our case, that happens to be /dist/index.js.

Actions run from GitHub repos.
We don't want to check in node_modules. Hence, we package the app using `yarn run pack`.

### Modifying Source Code
Just run `yarn install` locally.
There aren't many files here, so hopefully it should be pretty straightforward.

### Cutting new releases
Push your code up to a feature branch.
Create a pull request to the `v1` branch (if it's a non breaking change).

After it's merged into the `v1` branch then, be sure to create a new GitHub release, following SemVer.
Then merge `v1` into `master`.