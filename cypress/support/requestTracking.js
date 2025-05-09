// Collects GET requests from Capture to the tracker API and groups them by test, page and API path.
//
// This should help answer questions like
// - are we making duplicate requests?
// - are we making very similar requests?
// - are we making expensive requests?
//
// Running the Cypress tests https://github.com/dhis2/capture-app/wiki/Cypress#run-cypress-tests-locally
// generates ../../trackerRequests.json.
//
// This is how you can run a single spec:
//
// yarn start:forCypress # start the app
// yarn cypress run --spec cypress/e2e/EnrollmentPage/EnrollmentPageNavigation/EnrollmentPageNavigation.feature
//
// Double check the requests JSON contains all the features you would expect:
//
// jq 'keys | map(split(" > ")) | map(.[0]) | unique' trackerRequests.json
//
// You can slice and dice the data as you like using for example jq.
//
// This shows you the top x pages ordered by the total duration of requests made to the same API:
//
// jq --arg top 5 --arg host http://localhost:8080/apps/capture -r 'to_entries | map(.key as $scenario | .value | to_entries | map(.key as $page | .value | to_entries | map({name: $scenario, page: $page, api: .key, count: .value.count, totalDuration: .value.duration}))[]) | flatten | sort_by(-.totalDuration) | .[0:($top|tonumber)] | .[] | "\(.count) requests (\(.totalDuration)ms total) by test: \(.name)\n   from page: \($host)\(.page)\n   to API: \(.api)"' trackerRequests.json
//
// This shows you the top x pages ordered by the most requests made to the same API:
//
// jq --arg top 5 --arg host http://localhost:8080/apps/capture -r 'to_entries | map(.key as $scenario | .value | to_entries | map(.key as $page | .value | to_entries | map({name: $scenario, page: $page, api: .key, count: .value.count, totalDuration: .value.duration}))[]) | flatten | sort_by(-.count) | .[0:($top|tonumber)] | .[] | "\(.count) requests (\(.totalDuration)ms total) by test: \(.name)\n   from page: \($host)\(.page)\n   to API: \(.api)"' trackerRequests.json

// this will contain the requests per spec as cypress does not share globals between specs (see afterEach)
const requestsPerTest = {};
let currentPage = '';

beforeEach(() => {
    cy.on('url:changed', (href) => {
        // Node has issues parsing the url using new URL(href) saying its invalid while deno
        // can parse it just fine. So use this workaround to extract the page from the url.
        currentPage = href.split('#')[1] || '';
    });

    cy.intercept('GET', '/api/*/tracker/**', (req) => {
        const testName = Cypress.currentTest.titlePath.join(' > ');
        const requestsPerPage = requestsPerTest[testName] || {};
        const requestsPerPath = requestsPerPage[currentPage] || {};
        const url = new URL(req.url);
        const requests = requestsPerPath[url.pathname] || {};
        requests.count = requests.count || 0;
        requests.count += 1;
        requests.requests = requests.requests || [];
        requests.duration = requests.duration || 0;

        const startTime = Date.now();
        // capture the response time of the request
        // https://docs.cypress.io/api/commands/intercept#Response-phase
        req.on('response', (res) => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            requests.duration += duration;

            // keeping the actual requests in an array as the order might be interesting
            requests.requests.push({
                href: url.href,
                path: url.pathname,
                query: req.query,
                duration,
                status: res.statusCode,
            });
        });

        requestsPerPath[url.pathname] = requests;
        requestsPerPage[currentPage] = requestsPerPath;
        requestsPerTest[testName] = requestsPerPage;
    }).as('trackerGet');
});

afterEach(() => {
    // this is a slow and ugly workaround!
    // globals are not shared between specs, alternatives like
    // https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/server-communication__pass-value-between-specs
    // are so painful or don't even work at all
    // https://github.com/cypress-io/cypress/issues/7667
    // so merge the requests of the global which contains requests for a single spec into the existing file
    // the file must already exist, otherwise cy.readFile will fail
    // https://docs.cypress.io/api/commands/writefile#Append-contents-to-the-end-of-a-file
    //
    // to start fresh do:
    //
    // echo '{}' > trackerRequests.json
    cy.readFile('trackerRequests.json').then((existingData) => {
        // Merge the new requests with existing data
        const mergedData = {
            ...existingData,
            ...requestsPerTest,
        };
        cy.writeFile('trackerRequests.json', mergedData);
    });
});
