// @flow
type Url = {
  programId?: string,
  orgUnitId?: string,
  trackedEntityTypeId?: string,
};

export const urlArguments = ({ programId, orgUnitId, trackedEntityTypeId }: Url): string => {
  const argArray = [];
  if (programId) {
    argArray.push(`programId=${programId}`);
  } else if (trackedEntityTypeId) {
    argArray.push(`trackedEntityTypeId=${trackedEntityTypeId}`);
  }
  if (orgUnitId) {
    argArray.push(`orgUnitId=${orgUnitId}`);
  }

  return argArray.join('&');
};
