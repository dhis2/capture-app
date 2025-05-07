// Collects GET requests from Capture to the tracker API and groups them by page, path and test name.
// TODO think about how to organize the data to then more easily answer
// on the same page
// - are we making duplicate requests?
// - are we making very similar requests?
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
