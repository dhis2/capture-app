export type OrgUnitRef = {
    id: string;
    path: string;
};

export type CurrentUserType = {
    firstName: string;
    surname: string;
    username: string;
    uiLocale: string;
    userRoles: string[];
    organisationUnits: OrgUnitRef[];
    teiSearchOrganisationUnits: OrgUnitRef[];
};

export class CurrentUser {
    private static currentData: CurrentUserType = {
        firstName: '',
        surname: '',
        username: '',
        uiLocale: '',
        userRoles: [],
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
