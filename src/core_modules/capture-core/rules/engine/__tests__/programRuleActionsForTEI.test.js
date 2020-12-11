import { RulesEngine } from '../index';

test('TEI rules engine effects with functions and effects', () => {
  // given
  const constants = [];
  const trackedEntityAttributes = {
    w75KJ2mc4zz: { id: 'w75KJ2mc4zz', valueType: 'TEXT' },
    zDhUuAYrxNC: { id: 'zDhUuAYrxNC', valueType: 'TEXT' },
    cejWyOfXge6: {
      id: 'cejWyOfXge6',
      valueType: 'TEXT',
      optionSetId: 'pC3N9N77UmT',
    },
    lZGmxYbs97q: { id: 'lZGmxYbs97q', valueType: 'NUMBER' },
  };
  const programRules = [
    {
      id: 'g82J3xsNer9',
      condition: 'true',
      displayName: 'Testing the functions!',
      programId: 'IpHINAT79UW',
      programRuleActions: [
        {
          id: 'Eeb7Ixr4Pvx',
          content: "d2:left('dhis', 3) = ",
          data: "d2:left('dhis', 3)",
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'lbIGJYVI57u',
          content: 'd2:zing( -2 ) = ',
          data: 'd2:zing( -2 )',
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'kwKhYpVRDyj',
          content: "d2:monthsBetween( '2020-01-28', V{enrollment_date}) = ",
          data: "d2:monthsBetween( '2020-01-28', V{enrollment_date})",
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'AFkfzcDf4Fs',
          content: "d2:inOrgUnitGroup('CHC') = ",
          data: "d2:inOrgUnitGroup('CHC')",
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'wmAQnxbs7V8',
          content: 'd2:round( 12.5 ) = ',
          data: 'd2:round( 12.5 )',
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'tFGwyDBQk3b',
          content: 'd2:round( 0 ) = ',
          data: 'd2:round( 0 )',
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'NSQV537qvyu',
          content: "d2:concatenate( 'dh', 'is', 2, 'is', 'rocking') = ",
          data: "d2:concatenate( 'dh', 'is', 2, 'is', 'rocking')",
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'M7vYMD5uNwD',
          content: 'd2:ceil(11.3) = ',
          data: 'd2:ceil(11.3)',
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'cgdUEJkqq0J',
          content: "d2:yearsBetween( '2010-01-28', V{enrollment_date}) = ",
          data: "d2:yearsBetween( '2010-01-28', V{enrollment_date})",
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'xZpYbFPXWG2',
          content: 'd2:zing( 1000 ) = ',
          data: 'd2:zing( 1000 )',
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'IGpzruAKVzk',
          content: "d2:split('these-are-testing-values', '-', 2) = ",
          data: "d2:split('these-are-testing-values', '-', 2)",
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'NLsawa3P5hc',
          content: "d2:substring('hello dhis 2', 6, 10) = ",
          data: "d2:substring('hello dhis 2', 6, 10)",
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'i0OgulFyVPQ',
          content: 'd2:oizp( -10000000 ) = ',
          data: 'd2:oizp( -10000000 )',
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'PqzKFmEMmuz',
          content: "d2:right('dhis', 3) = ",
          data: "d2:right('dhis', 3)",
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'v6SbO0fEZEc',
          content: "d2:daysBetween( '2020-01-28', V{enrollment_date}) = ",
          data: "d2:daysBetween( '2020-01-28', V{enrollment_date})",
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'xIUDr1lRV6N',
          content: "d2:addDays( '2018-04-20', 100 ) = ",
          data: "d2:addDays( '2018-04-20', 100 )",
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'RXmprywJ0Rb',
          content: 'd2:floor( 11.5 ) = ',
          data: 'd2:floor( 11.5 )',
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'cZQngI2IC1a',
          content: "d2:length( 'dhis2 rocks' ) = ",
          data: "d2:length( 'dhis2 rocks' )",
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'qSe8GmlwpgZ',
          content: "d2:weeksBetween('2020-01-28', V{enrollment_date} ) = ",
          data: "d2:weeksBetween('2020-01-28', V{enrollment_date} )",
          location: 'feedback',
          programRuleActionType: 'DISPLAYKEYVALUEPAIR',
        },
        {
          id: 'Tx4gHcLselM',
          content: 'd2:oizp( 10000000 ) = ',
          data: 'd2:oizp( 10000000 )',
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
        {
          id: 'f3MrrcCf1z2',
          content: 'd2:modulus( 12 , 100 ) = ',
          data: 'd2:modulus( 12 , 100 )',
          location: 'feedback',
          programRuleActionType: 'DISPLAYTEXT',
        },
      ],
    },
  ];
  const programRulesVariables = [];
  const optionSet = {};
  const teiValues = {};
  const orgUnit = { id: 'DiszpKrYNg8', name: 'Ngelehun CHC' };
  const enrollmentData = { enrollmentDate: '2020-05-14T22:00:00.000Z' };

  // when
  const rulesEffects = RulesEngine.programRuleEffectsForTEI(
    { programRulesVariables, programRules, constants },
    enrollmentData,
    teiValues,
    trackedEntityAttributes,
    orgUnit,
    optionSet,
  );

  // then
  expect(rulesEffects).toEqual([
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: {
        id: 'Eeb7Ixr4Pvx',
        message: "d2:left('dhis', 3) =  dhi",
      },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: { id: 'lbIGJYVI57u', message: 'd2:zing( -2 ) =  0' },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: {
        id: 'kwKhYpVRDyj',
        message: "d2:monthsBetween( '2020-01-28', V{enrollment_date}) =  3",
      },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: {
        id: 'AFkfzcDf4Fs',
        message: "d2:inOrgUnitGroup('CHC') =  ",
      },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: {
        id: 'wmAQnxbs7V8',
        message: 'd2:round( 12.5 ) =  13',
      },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: { id: 'tFGwyDBQk3b', message: 'd2:round( 0 ) =  0' },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: {
        id: 'NSQV537qvyu',
        message: "d2:concatenate( 'dh', 'is', 2, 'is', 'rocking') =  dhis2isrocking",
      },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: { id: 'M7vYMD5uNwD', message: 'd2:ceil(11.3) =  12' },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: {
        id: 'cgdUEJkqq0J',
        message: "d2:yearsBetween( '2010-01-28', V{enrollment_date}) =  10",
      },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: {
        id: 'xZpYbFPXWG2',
        message: 'd2:zing( 1000 ) =  1000',
      },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: {
        id: 'IGpzruAKVzk',
        message: "d2:split('these-are-testing-values', '-', 2) =  testing",
      },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: {
        id: 'NLsawa3P5hc',
        message: "d2:substring('hello dhis 2', 6, 10) =  dhis",
      },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: {
        id: 'i0OgulFyVPQ',
        message: 'd2:oizp( -10000000 ) =  0',
      },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: {
        id: 'PqzKFmEMmuz',
        message: "d2:right('dhis', 3) =  his",
      },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: {
        id: 'v6SbO0fEZEc',
        message: "d2:daysBetween( '2020-01-28', V{enrollment_date}) =  108",
      },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: {
        id: 'xIUDr1lRV6N',
        message: "d2:addDays( '2018-04-20', 100 ) =  2018-07-29",
      },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: {
        id: 'RXmprywJ0Rb',
        message: 'd2:floor( 11.5 ) =  11',
      },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: {
        id: 'cZQngI2IC1a',
        message: "d2:length( 'dhis2 rocks' ) =  11",
      },
    },
    {
      type: 'DISPLAYKEYVALUEPAIR',
      id: 'feedback',
      displayKeyValuePair: {
        id: 'qSe8GmlwpgZ',
        key: "d2:weeksBetween('2020-01-28', V{enrollment_date} ) = ",
        value: 15,
      },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: {
        id: 'Tx4gHcLselM',
        message: 'd2:oizp( 10000000 ) =  1',
      },
    },
    {
      type: 'DISPLAYTEXT',
      id: 'feedback',
      displayText: {
        id: 'f3MrrcCf1z2',
        message: 'd2:modulus( 12 , 100 ) =  12',
      },
    },
  ]);
});
