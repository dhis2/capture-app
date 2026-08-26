const PERIOD_TYPE_MAP: { [apiName: string]: string } = {
    Daily: 'DAILY',

    Weekly: 'WEEKLY',
    WeeklyWednesday: 'WEEKLYWED',
    WeeklyThursday: 'WEEKLYTHU',
    WeeklySaturday: 'WEEKLYSAT',
    WeeklySunday: 'WEEKLYSUN',

    BiWeekly: 'BIWEEKLY',
    Monthly: 'MONTHLY',
    BiMonthly: 'BIMONTHLY',
    Quarterly: 'QUARTERLY',
    QuarterlyNov: 'QUARTERLYNOV',

    SixMonthly: 'SIXMONTHLY',
    SixMonthlyApril: 'SIXMONTHLYAPRIL',
    SixMonthlyNov: 'SIXMONTHLYNOV',

    Yearly: 'YEARLY',

    FinancialApril: 'FYAPRIL',
    FinancialJuly: 'FYJULY',
    FinancialSep: 'FYSEP',
    FinancialOct: 'FYOCT',
    FinancialNov: 'FYNOV',
};

export const serverToClientExpiryPeriod = (apiName?: string) =>
    (apiName ? PERIOD_TYPE_MAP[apiName] : undefined);
