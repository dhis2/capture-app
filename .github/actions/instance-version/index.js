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
        if (!response.ok) {
            throw new Error(`HTTP Error Response: ${response.status} ${response.statusText}`);
        }
        const detailedVersion = (await response.json()).version;
        const minorVersion = Number(/[.](\d+)/.exec(detailedVersion)[1]);
        core.info('output-version: ' + minorVersion);
        core.setOutput('version', minorVersion);

    } catch (error) {
        core.setFailed(error.message);
    }
};

main();