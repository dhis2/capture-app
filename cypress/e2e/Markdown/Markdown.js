import {Given, Then, defineStep as And} from '@badeball/cypress-cucumber-preprocessor';

const LONG_TIMEOUT = { timeout: 120000 };

const getFeedbackDiv = () =>
    cy.get('[data-test="feedback-widget"]', LONG_TIMEOUT);

// SHARED

Given(/^user lands on the enrollment edit event page by having typed (.*)$/, (url) => {
    cy.visit(url, LONG_TIMEOUT);
    getFeedbackDiv().should('exist');
});

Then('the feedback widget should be visible', () => {
    getFeedbackDiv().should('be.visible');
});

Then('the list should contain {int} items', (expectedCount) => {
    getFeedbackDiv()
        .find('[data-test="widget-contents"]', LONG_TIMEOUT)
        .find('ul')
        .find('li')
        .should('have.length', expectedCount);
});

const getListItem = (n) =>
    getFeedbackDiv()
        .find('[data-test="widget-contents"]', LONG_TIMEOUT)
        .find('ul li')
        .eq(n - 1);

const ordinalToIndex = { first: 1, second: 2, third: 3, fourth: 4 };

And('the {word} list item should contain {word} with text {string}', (ordinal, tag, text) => {
    getListItem(ordinalToIndex[ordinal])
        .find(tag)
        .should('have.text', text);
});

Then('the {word} list item {word} should contain italic text {string}', (ordinal, tag, text) => {
    getListItem(ordinalToIndex[ordinal])
        .find(tag)
        .find('em')
        .should('have.text', text);
});

And('the {word} list item table should match:', (ordinal, dataTable) => {
    const [headerRow, ...bodyRows] = dataTable.raw();

    getListItem(ordinalToIndex[ordinal]).find('table').within(() => {
        cy.get('thead th').each(($th, i) => {
            expect($th.text()).to.equal(headerRow[i]);
        });

        cy.get('tbody tr').each(($tr, rowIndex) => {
            bodyRows[rowIndex].forEach((cell, colIndex) => {
                expect($tr.find('td').eq(colIndex).text()).to.equal(cell);
            });
        });
    });
});


// FOURTH FEEDBACK ELEMENT

Then('the fourth list item left section should have {word} with text {string}', (tag, text) => {
    getListItem(4).find('> div > div').first().find(tag).should('have.text', text);
});

And('the fourth list item right section color indicator should be {string}', (color) => {
    getListItem(4).find('> div > div').last().find('span').should('have.css', 'background-color', color);
});

And('the fourth list item right section should have {word} with text {string}', (tag, text) => {
    getListItem(4).find('> div > div').last().find(tag).should('have.text', text);
});
