import * as fs from "fs";
import { InterfaceDeclaration, Project } from "ts-morph";

const inputPath = "interfaces/interface.ts"; // file đầu vào
const outputPath = "entities/entity.ts"; // file đầu ra

const project = new Project({
  tsConfigFilePath: "./tsconfig.json",
});

const sourceFile = project.addSourceFileAtPath(inputPath);

function mapTypeToDecorator(type: string): string[] {
  switch (type) {
    case "string":
      return ["@IsString()"];
    case "number":
      return ["@IsNumber()"];
    case "boolean":
      return ["@IsBoolean()"];
    case "any[]":
    case "Array<any>":
      return ["@IsArray()"];
    default:
      if (type.endsWith("[]")) {
        const baseType = type.slice(0, -2);
        return [
          "@IsArray()",
          "@ValidateNested({ each: true })",
          `@Type(() => ${baseType})`,
        ];
      }
      return [`@ValidateNested()`, `@Type(() => ${type})`];
  }
}

function generateEntityClass(iface: InterfaceDeclaration): string {
  const name = iface.getName();
  const props = iface.getProperties();

  const classLines: string[] = [];
  classLines.push(`export class ${name} {`);

  for (const prop of props) {
    const propName = prop.getName();
    const isOptional = prop.hasQuestionToken();
    const typeNode = prop.getTypeNodeOrThrow();
    const typeText = typeNode.getText();

    const decorators = mapTypeToDecorator(typeText);

    if (isOptional) {
      classLines.push("  @IsOptional()");
    }

    for (const d of decorators) {
      classLines.push(`  ${d}`);
    }

    classLines.push(`  ${propName}${isOptional ? "?" : ""}: ${typeText};`);
    classLines.push("");
  }

  classLines.push("}");
  return classLines.join("\n");
}

// ===== RUN TOOL =====

const interfaces = sourceFile.getInterfaces();

const header = `import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';\n`;

const output = interfaces.map(generateEntityClass).join("\n\n");

fs.writeFileSync(outputPath, header + "\n" + output);
console.log(`✅ Entity created at: ${outputPath}`);
