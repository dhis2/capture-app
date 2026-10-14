import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { DateField } from '../Date.component';

// Regression coverage for LIBS-763: useDatePicker (in @dhis2/multi-calendar-dates, used by
// @dhis2/ui's CalendarInput) rebuilt the year/month navigation lists and the day-cell grid
// on every render - including every keystroke in the date input while the calendar was open -
// which made typing a date noticeably slow.
global.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
});

afterEach(() => {
    act(() => root.unmount());
    document.body.innerHTML = '';
});

// Sets the value the way a user typing would, so React's onChange fires for the controlled input
const typeInto = (input, value) => {
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setValue.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
};

const renderOpenDateField = async (calendarType) => {
    act(() => {
        root.render(
            <DateField
                calendarType={calendarType}
                dateFormat="YYYY-MM-DD"
                onBlur={jest.fn()}
            />,
        );
    });
    const dateInput = container.querySelector('[data-test="dhis2-uicore-input"] input');
    await act(async () => {
        dateInput.focus();
    });
    expect(document.querySelector('[data-test="calendar"]')).not.toBeNull();
    return dateInput;
};

// For ICU-backed calendars the broken memoization showed up as hundreds of redundant
// Intl.DateTimeFormat constructions per keystroke. Counting them is deterministic and
// independent of machine speed, unlike timing.
const countDateTimeFormatUsage = (fn) => {
    const realResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
    let count = 0;
    Intl.DateTimeFormat.prototype.resolvedOptions = function resolvedOptions(...args) {
        count += 1;
        return realResolvedOptions.apply(this, args);
    };
    try {
        fn();
    } finally {
        Intl.DateTimeFormat.prototype.resolvedOptions = realResolvedOptions;
    }
    return count;
};

// Wall-clock assertions are flaky on shared CI runners, so the timing test is opt-in:
// CAPTURE_PERF_TIMING=1 yarn test DateField.performance
const itWithTiming = process.env.CAPTURE_PERF_TIMING ? it : it.skip;

describe('DateField typing performance (LIBS-763)', () => {
    it.each([
        ['gregory', '2024-10-1'],
        ['ethiopian', '2017-02-0'],
    ])('does not rebuild the calendar while typing (%s)', async (calendarType, typedValue) => {
        const dateInput = await renderOpenDateField(calendarType);

        const usage = countDateTimeFormatUsage(() => {
            act(() => typeInto(dateInput, typedValue));
        });

        expect(usage).toBeLessThan(10);
    });

    // Nepali is a custom (non-ICU) calendar, so the same problem shows up as redundant
    // custom date-conversion work instead of Intl usage - time it directly.
    itWithTiming('keeps typing fast (nepali)', async () => {
        const dateInput = await renderOpenDateField('nepali');

        const chars = '2081-07-01'.split('');
        const start = performance.now();
        chars.forEach((_, i) => {
            act(() => typeInto(dateInput, chars.slice(0, i + 1).join('')));
        });
        const elapsed = performance.now() - start;

        expect(elapsed).toBeLessThan(300);
    });
});
