export type OrgUnitRef = {
    id: string;
    path: string;
};

export type CurrentUserType = {
    firstName: string;
    surname: string;
    uiLocale: string;
    userRoles: string[];
    organisationUnits: OrgUnitRef[];
    teiSearchOrganisationUnits: OrgUnitRef[];
};

export class CurrentUser {
    private static currentData: CurrentUserType | null = null;

    static set(data: CurrentUserType) {
        CurrentUser.currentData = data;
    }
    static get(): CurrentUserType {
        if (!CurrentUser.currentData) {
            throw new Error('CurrentUser accessed before initialization');
        }
        return CurrentUser.currentData;
    }
}
