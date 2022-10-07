const core = require('@actions/core');
const fetch = require('node-fetch');

const main = async () => {
    try {
        const params = {
            headers: {
                'Authorization': 'Basic ' + btoa(core.getInput('username') + ':' + core.getInput('password')),
            },
        };

        const url = [core.getInput('instance-url'), 'api/system/info?fields=version']
            .map(part => part.replace(/(^\/)|(\/$)/g, ''))
            .join('/');
        
        const response = await fetch(url, params);
        const detailedVersion = (await response.json()).version;
        const minorVersion = Number(/[.](\d+)/.exec(detailedVersion)[1]);
        core.info('output-version: ' + minorVersion);
        core.setOutput('version', minorVersion);

    } catch (error) {
        core.info('error:' + JSON.stringify(error));
        core.setFailed(error);
        core.setFailed(error.message);
    }
};

main();