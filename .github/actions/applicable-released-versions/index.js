const core = require('@actions/core');

try {
    const devVersion = Number(core.getInput('dev-version'));
    let versions = [];
    for (let index = 38; index < devVersion; index++) {
        versions.push(index);
    }
    core.info('output-versions: ' + JSON.stringify(versions));
    core.setOutput('versions', versions);
} catch (error) {
    core.setFailed(error.message);
}