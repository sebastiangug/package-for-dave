import { ContainerClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";
const getSchemas = async function () {
    const blobContainer = new ContainerClient("https://blob-container-url/schemas/", new DefaultAzureCredential());
    const schemas = [];
    for await (const item of blobContainer.listBlobsByHierarchy("/")) {
        const schema = {
            name: item.name,
            files: [],
            latestSemver: "",
        };
        if (item.kind === "prefix") {
            for await (const child of blobContainer.listBlobsByHierarchy("/", {
                prefix: item.name,
            })) {
                const findSemverRegexp = new RegExp(/\.(?<semver>.*)\.json/g);
                const version = child.name.match(findSemverRegexp);
                console.log(version);
                schema.files.push({
                    name: child.name,
                    version: version.groups.semver,
                });
            }
        }
        schema["latestVersion"] = "";
        schemas.push(schema);
    }
    return schemas;
};
const getSchema = function (_name, _version = "latest") {
    return [];
};
export { getSchema, getSchemas };
//# sourceMappingURL=index.js.map
