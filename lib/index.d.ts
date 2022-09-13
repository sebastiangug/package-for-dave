interface Schema {
    file: string;
    version: string;
}
interface Schemas {
    name: string;
    files: Array<Schema>;
    latestVersion: string;
}
declare const getSchemas: () => Promise<Schemas[]>;
declare const getSchema: (_name: string, _version?: string) => Object;
export { getSchema, getSchemas };
