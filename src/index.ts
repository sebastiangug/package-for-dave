import { ContainerClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

interface Schema {
  file: string;
  version: string;
}

interface Schemas {
  name: string;
  files: Array<Schema>;
  latestVersion: string;
}

/**
 * Get a list of all the available schemas
 * @returns {Array<Schemas>} json schema
 */
const getSchemas = async function (): Promise<Schemas[]> {
  const blobContainer = new ContainerClient(
    "https://something.net/schemas/"
    new DefaultAzureCredential()
  );

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

/**
 * Get a single schema
 * @param {string} _name Get a schema by name
 * @param {string} [_version="latest"] Get a specific version of the schema
 * @returns {Object}
 */
const getSchema = function (
  _name: string,
  _version: string = "latest"
): Object {
  return [];
};

export { getSchema, getSchemas };
