// @flow
import programs from '../programs.apiSpecification';

it('programs converter', () => {
    const id = '1';
    const programStages = {
        toArray: () =>
            [
                {
                    dataValues: {
                        id: 'ps1',
                        programStageSections: {
                            toArray: () => [
                                {
                                    id: 'pss1',
                                },
                            ],
                        },
                        notificationTemplates: {
                            toArray: () => [
                                {
                                    id: 'not1',
                                },
                            ],
                        },
                        programStageDataElements: [],
                    },
                },
                {
                    dataValues: {
                        id: 'ps1',
                        sortOrder: 1,
                        programStageSections: {
                            toArray: () => [
                                {
                                    id: 'pss1',
                                },
                            ],
                        },
                        notificationTemplates: {
                            toArray: () => [
                                {
                                    id: 'not1',
                                },
                            ],
                        },
                        programStageDataElements: [],
                    },
                },
                {
                    dataValues: {
                        id: 'ps2',
                        sortOrder: 2,
                        programStageSections: {
                            toArray: () => [
                                {
                                    id: 'pss1',
                                },
                            ],
                        },
                        notificationTemplates: {
                            toArray: () => [
                                {
                                    id: 'not1',
                                },
                            ],
                        },
                        programStageDataElements: [],
                    },
                },
                {
                    dataValues: {
                        id: 'ps1',
                        programStageSections: {
                            toArray: () => [
                                {
                                    id: 'pss1',
                                },
                            ],
                        },
                        notificationTemplates: {
                            toArray: () => [
                                {
                                    id: 'not1',
                                },
                            ],
                        },
                        programStageDataElements: [],
                    },
                },
            ],
    };
    const objects = [{
        id,
        programStages,
        organisationUnits: {
            toArray: () => [
                {
                    id: 'org1',
                },
            ],
        },
    }];
    const convertedData = programs.converter(objects);
    expect(convertedData[0].id).toEqual(id);

    const convertedEmptyObject = programs.converter();
    expect(convertedEmptyObject).toBeNull();
});
