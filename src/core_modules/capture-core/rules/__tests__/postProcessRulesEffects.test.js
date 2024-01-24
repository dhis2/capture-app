import { postProcessRulesEffects } from '../index';
import { RenderFoundation, Section, DataElement, dataElementTypes } from '../../metaData';

test('Post process rules effects', () => {
    // given
    const rulesEffects = [
        {
            type: 'DISPLAYTEXT',
            id: 'feedback',
            displayText: { id: 'Eeb7Ixr4Pv6', message: 'd2:floor((5+5) / 2) =  5' },
        },
        { type: 'HIDEPROGRAMSTAGE', id: 'PUZaKR0Jh2k' },
        { id: 'SWfdBhglX0fk', type: 'HIDESECTION' },
        { id: 'w75KJ2mc4zz', type: 'ASSIGN', value: 'true' },
        { id: 'wasdJ2mc4zz', type: 'ASSIGN', value: 'true' },
        {
            id: 'w75KJ2mc4zz',
            message: ' true',
            type: 'ERRORONCOMPLETE',
        },
        {
            id: 'w75KJ2mc4zz',
            message: ' true',
            type: 'WARNINGONCOMPLETE',
        },
        {
            id: 'w75KJ2mc4zz',
            type: 'SETMANDATORYFIELD',
        },
        {
            content: undefined,
            id: 'zDhUuAYrxNC',
            targetDataType: 'trackedEntityAttribute',
            type: 'HIDEFIELD',
            hadValue: true,
            name: undefined,
        },
        {
            content: undefined,
            id: 'unknown',
            type: 'HIDEFIELD',
        },
        {
            displayKeyValuePair: {
                id: 'khy8GmlwpgZ',
                key: "d2:weeksBetween('2020-01-28', V{unknown} ) = ",
                value: '',
            },
            id: 'feedback',
            type: 'DISPLAYKEYVALUEPAIR',
        },
    ];

    const foundation = new RenderFoundation(() => {});
    const section1 = new Section((initSection) => {
        initSection.id = 's1Id';
        initSection.name = 'section1';
        const dataElement1 = new DataElement((o) => {
            o.id = 'w75KJ2mc4zz';
            o.name = 'dataElement1';
            o.type = dataElementTypes.TEXT;
            o.optionSet = {
                id: 'optionSet',
                name: 'optionSet',
                code: 'optionSet',
                options: [{ option: { value: false } }],
            };
        });

        const dataElement2 = new DataElement((o) => {
            o.id = 'wasdJ2mc4zz';
            o.name = 'dataElement1';
            o.type = dataElementTypes.NUMBER;
            o.compulsory = true;
        });
        initSection.addElement(dataElement1);
        initSection.addElement(dataElement2);
    });

    const section2 = new Section((initSection) => {
        initSection.id = 'SWfdBhglX0fk';
        initSection.name = 'section2';
        const dataElement = new DataElement((o) => {
            o.id = 'da1Id';
            o.name = 'dataElement1';
            o.type = dataElementTypes.TEXT;
        });

        initSection.addElement(dataElement);
    });

    foundation.addSection(section1);
    foundation.addSection(section2);

    // when
    const processedRulesEffects = postProcessRulesEffects(rulesEffects, foundation);

    // then
    expect(processedRulesEffects).toEqual([
        {
            displayText: {
                id: 'Eeb7Ixr4Pv6',
                message: 'd2:floor((5+5) / 2) =  5',
            },
            id: 'feedback',
            type: 'DISPLAYTEXT',
        },
        {
            id: 'PUZaKR0Jh2k',
            type: 'HIDEPROGRAMSTAGE',
        },
        {
            id: 'w75KJ2mc4zz',
            message: ' true',
            type: 'ERRORONCOMPLETE',
        },
        {
            id: 'w75KJ2mc4zz',
            message: ' true',
            type: 'WARNINGONCOMPLETE',
        },
        {
            id: 'w75KJ2mc4zz',
            type: 'SETMANDATORYFIELD',
        },
        {
            displayKeyValuePair: {
                id: 'khy8GmlwpgZ',
                key: "d2:weeksBetween('2020-01-28', V{unknown} ) = ",
                value: '',
            },
            id: 'feedback',
            type: 'DISPLAYKEYVALUEPAIR',
        },
        {
            content: undefined,
            id: 'unknown',
            type: 'HIDEFIELD',
        },
        {
            id: 'da1Id',
            type: 'HIDEFIELD',
        },
        {
            id: 'unknown',
            type: 'ASSIGN',
            value: null,
        },
        {
            id: 'w75KJ2mc4zz',
            type: 'ASSIGN',
            value: null,
        },
        {
            id: 'wasdJ2mc4zz',
            type: 'ASSIGN',
            value: 'true',
        },
    ]);
});

test('the rules effects are not defined', () => {
    // given

    const foundation = new RenderFoundation(() => {});
    const section1 = new Section((initSection) => {
        initSection.id = 's1Id';
        initSection.name = 'section1';
        const dataElement1 = new DataElement((o) => {
            o.id = 'da1Id';
            o.name = 'dataElement1';
            o.type = dataElementTypes.TEXT;
        });

        initSection.addElement(dataElement1);
    });

    foundation.addSection(section1);

    // when
    const processedRulesEffects = postProcessRulesEffects(undefined, foundation);

    // then
    expect(processedRulesEffects).toEqual([]);
});

test('HIDESECTION effect sectionId do not match the formFoundation sectionId', () => {
    // given
    const rulesEffects = [{ id: 'SWfdBhglX0fk', type: 'HIDESECTION' }];

    const foundation = new RenderFoundation(() => {});
    const section1 = new Section((initSection) => {
        initSection.id = 's1Id';
        initSection.name = 'section1';
        const dataElement1 = new DataElement((o) => {
            o.id = 'da1Id';
            o.name = 'dataElement1';
            o.type = dataElementTypes.TEXT;
        });

        initSection.addElement(dataElement1);
    });

    foundation.addSection(section1);

    // when
    const processedRulesEffects = postProcessRulesEffects(rulesEffects, foundation);

    // then
    expect(processedRulesEffects).toEqual([]);
});
