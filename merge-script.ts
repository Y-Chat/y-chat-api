import { merge, isErrorResult } from "openapi-merge";
import { load, dump } from "js-yaml";
import { readFileSync, writeFileSync } from "fs";
import { Swagger } from "atlassian-openapi";

export default function main() {
  const specAuth = load(
    readFileSync("./auth/openapi.yml", "utf-8")
  ) as Swagger.SwaggerV3;
  const specMedia = load(
    readFileSync("./media/openapi.yml", "utf-8")
  ) as Swagger.SwaggerV3;
  const specMessaging = load(
    readFileSync("./messaging/openapi.yml", "utf-8")
  ) as Swagger.SwaggerV3;
  const specNotification = load(
    readFileSync("./notification/openapi.yml", "utf-8")
  ) as Swagger.SwaggerV3;
  const specPayment = load(
    readFileSync("./payment/openapi.yml", "utf-8")
  ) as Swagger.SwaggerV3;
  const specSocial = load(
    readFileSync("./social/openapi.yml", "utf-8")
  ) as Swagger.SwaggerV3;

  const mergeResult = merge([
    {
      oas: specAuth,
      pathModification: {
        prepend: "/auth",
      },
    },
    {
      oas: specMedia,
      pathModification: {
        prepend: "/media",
      },
    },
    {
      oas: specMessaging,
      pathModification: {
        prepend: "/messaging",
      },
    },
    {
      oas: specNotification,
      pathModification: {
        prepend: "/notification",
      },
    },
    {
      oas: specPayment,
      pathModification: {
        prepend: "/payment",
      },
    },
    {
      oas: specSocial,
      pathModification: {
        prepend: "/social",
      },
      operationSelection: {
        excludeTags: ["Internal Endpoint"],
      },
    },
  ]);

  if (isErrorResult(mergeResult)) {
    console.error(`${mergeResult.message} (${mergeResult.type})`);
  } else {
    console.log(`Merge successful!`);
    const yamlString = dump(mergeResult.output);
    writeFileSync("./openapi.yml", yamlString);
    console.log("Wrote to openapi.yml");
  }
}

main();
