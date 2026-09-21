export type databaseTypes = 'postgres' | 'mongodb';

export function isDatabaseType (value: string): value is databaseTypes {
    return value === 'postgres' || value === 'mongodb';
}
