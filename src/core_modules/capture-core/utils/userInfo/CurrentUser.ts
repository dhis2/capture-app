export type OrgUnitRef = {
    id: string;
    path: string;
};

export type CurrentUserType = {
    id: string;
    firstName: string;
    surname: string;
    username: string;
    uiLocale: string;
    organisationUnits: OrgUnitRef[];
    teiSearchOrganisationUnits: OrgUnitRef[];
};

export class CurrentUser {
    private static currentData: CurrentUserType = {
        id: '',
        firstName: '',
        surname: '',
        username: '',
        uiLocale: '',
        organisationUnits: [],
        teiSearchOrganisationUnits: [],
    };

    static set(data: CurrentUserType) {
        CurrentUser.currentData = data;
    }
    static get() {
        return CurrentUser.currentData;
    }
}
