import { isEqual } from '../valueEqualityChecker';

it('objects are equal', () => {
    const objA = {
        propA: 'test',
    };

    const objB = {
        propA: 'test',
    };

    expect(isEqual(objA, objB)).toBeTruthy();
});

it('objects are different', () => {
    const objA = {
        propA: 'test2',
    };

    const objB = {
        propA: 'test1',
    };

    expect(isEqual(objA, objB)).toBeFalsy();
});

it('objects within objects are equal', () => {
    const objA = {
        propA: {
            propInner: 1,
        },
    };

    const objB = {
        propA: {
            propInner: 1,
        },
    };

    expect(isEqual(objA, objB)).toBeTruthy();
});

it('objects within objects are different', () => {
    const objA = {
        propA: {
            propInner: 1,
        },
    };

    const objB = {
        propA: {
            propInner: 2,
        },
    };

    expect(isEqual(objA, objB)).toBeFalsy();
});

it('array within objects are equal', () => {
    const objA = {
        propA: {
            propInner: [
                'element1',
                'element2',
            ],
        },
    };

    const objB = {
        propA: {
            propInner: [
                'element1',
                'element2',
            ],
        },
    };

    expect(isEqual(objA, objB)).toBeTruthy();
});

it('array within objects are different', () => {
    const objA = {
        propA: {
            propInner: [
                'element1',
                'element2',
            ],
        },
    };

    const objB = {
        propA: {
            propInner: [
                'element1',
                'element3',
            ],
        },
    };

    expect(isEqual(objA, objB)).toBeFalsy();
});

it('object compositions are different', () => {
    const objA = {
        propA: {
            propInner: [
                'element1',
                'element2',
            ],
        },
    };

    const objB = {
        propA: {
            propInner: [
                'element1',
                'element2',
            ],
            propFound: true,
        },
    };

    expect(isEqual(objA, objB)).toBeFalsy();
});


it('string arrays are equal', () => {
    const arrA = [
        'element1',
        'element2',
    ];

    const arrB = [
        'element1',
        'element2',
    ];

    expect(isEqual(arrA, arrB)).toBeTruthy();
});

it('string arrays are different', () => {
    const arrA = [
        'element1',
        'element2',
    ];

    const arrB = [
        'element1',
        'element3',
    ];

    expect(isEqual(arrA, arrB)).toBeFalsy();
});

it('strings are equal', () => {
    const stringA = 'stringEqual';
    const stringB = 'stringEqual';

    expect(isEqual(stringA, stringB)).toBeTruthy();
});

it('strings are different', () => {
    const stringA = 'stringA';
    const stringB = 'stringB';

    expect(isEqual(stringA, stringB)).toBeFalsy();
});

it('numbers are equal', () => {
    const numberA = 1;
    const numberB = 1;

    expect(isEqual(numberA, numberB)).toBeTruthy();
});

it('numbers are different', () => {
    const numberA = 1;
    const numberB = 2;

    expect(isEqual(numberA, numberB)).toBeFalsy();
});

it('booleans true are equal', () => {
    const boolA = true;
    const boolB = true;

    expect(isEqual(boolA, boolB)).toBeTruthy();
});

it('booleans false are equal', () => {
    const boolA = false;
    const boolB = false;

    expect(isEqual(boolA, boolB)).toBeTruthy();
});

it('booleans are different', () => {
    const boolA = false;
    const boolB = true;

    expect(isEqual(boolA, boolB)).toBeFalsy();
});

it('null are equal', () => {
    const a = null;
    const b = null;

    expect(isEqual(a, b)).toBeTruthy();
});

it('null and undefined are different', () => {
    const a = null;
    const b = undefined;

    expect(isEqual(a, b)).toBeFalsy();
});

it('null and string are different', () => {
    const a = null;
    const b = 'stringB';

    expect(isEqual(a, b)).toBeFalsy();
});


it('null and object are different', () => {
    const a = null;
    const b = {};

    expect(isEqual(a, b)).toBeFalsy();
});
