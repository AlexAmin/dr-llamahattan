import path from "path";
import fs from "fs";
import zodToJsonSchema from "zod-to-json-schema";
import {removePropertiesRecursively} from "../util/removePropertiesRecursively";

export function toLLMSchema(schema: any, printPath?: string): any {
    const jsonSchema = zodToJsonSchema(schema,
        {
            target: "openAi",
            $refStrategy: "none",
            allowedAdditionalProperties: undefined,
            rejectedAdditionalProperties: undefined
        }
    )
    // llama api will error out if $schema is set
    delete jsonSchema.$schema

    // Properties the LLM should not generate
    removePropertiesRecursively(jsonSchema, ["id", "createdAt", "updatedAt", "vector", "userId"]);

    if (printPath) printJSON(printPath, jsonSchema)

    return jsonSchema
}

export function printJSON(currentFilePath: string, json: any, printPrefix: string = "") {
    const currentFileName = path.parse(currentFilePath).name;
    const currentDir = path.dirname(currentFilePath);
    const outputPath = `${printPrefix}${currentFileName}.json`
    console.log("printed", outputPath)
    fs.writeFileSync(path.join(currentDir, outputPath), JSON.stringify(json, null, 4))
}
