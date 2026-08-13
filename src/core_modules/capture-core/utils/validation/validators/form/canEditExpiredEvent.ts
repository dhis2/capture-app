type Input = {
    hasEditExpiredAuthority: boolean,
    isEventWithinValidPeriod: boolean,
    isWithinCompleteExpiry: boolean,
};

export const canEditExpiredEvent = ({
    hasEditExpiredAuthority,
    isEventWithinValidPeriod,
    isWithinCompleteExpiry,
}: Input): boolean =>
    hasEditExpiredAuthority || (isEventWithinValidPeriod && isWithinCompleteExpiry);
