// Collects GET requests from Capture to the tracker API and groups them by test, page and API path.
//
// This should help answer questions like
// - are we making duplicate requests?
// - are we making very similar requests?
// - are we making expensive requests?
//
// Running the Cypress tests https://github.com/dhis2/capture-app/wiki/Cypress#run-cypress-tests-locally generates ../../trackerRequests.json.
//
// You can slice and dice the data as you like. This shows you the top x pages ordered by the most
// requests made to the same API. Change the args, command to find your answers :)
//
// jq --arg top 10 --arg host http://localhost:8080/apps/capture -r 'to_entries | map(.key as $scenario | .value | to_entries | map(.key as $page | .value | to_entries | map({name: $scenario, page: $page, api: .key, count: .value.count}))[]) | flatten | sort_by(-.count) | .[0:($top|tonumber)] | .[] | "\(.count) requests by test: \(.name)\n   from page: \($host)\(.page)\n   to API: \(.api)"' trackerRequests.json
const requestsPerTests = {};
let currentPage = '';

beforeEach(() => {
    cy.on('url:changed', (href) => {
        // Node has issues parsing the url using new URL(href) saying its invalid while deno
        // can parse it just fine. So use this workaround to extract the page from the url.
        currentPage = href.split('#')[1] || '';
    });

    cy.intercept('GET', '/api/*/tracker/**', (req) => {
        const testName = Cypress.currentTest.titlePath.join(' > ');
        const requestsPerPage = requestsPerTests[testName] || {};
        const requestsPerPath = requestsPerPage[currentPage] || {};
        const url = new URL(req.url);
        const requests = requestsPerPath[url.pathname] || {};
        requests.count = requests.count || 0;
        requests.count++;
        requests.requests = requests.requests || [];
        // keeping the actual requests in an array as the order might be interesting
        requests.requests.push({
            href: url.href,
            path: url.pathname,
            query: req.query,
        });
        requestsPerPath[url.pathname] = requests;
        requestsPerPage[currentPage] = requestsPerPath;
        requestsPerTests[testName] = requestsPerPage;
    }).as('trackerGet');
});

afterEach(() => {
    cy.writeFile('trackerRequests.json', requestsPerTests);
});
