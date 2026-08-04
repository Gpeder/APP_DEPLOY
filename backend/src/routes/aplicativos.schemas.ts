const propriedadesPrincipais = {
  name: {
    type: "string",
    minLength: 1,
    maxLength: 160,
    pattern: "\\S",
  },
  repositoryProvider: {
    type: "string",
    enum: ["GITHUB", "GITLAB"],
  },
  repositoryUrl: {
    type: "string",
    format: "uri",
    minLength: 1,
    maxLength: 2048,
  },
  branch: {
    type: "string",
    minLength: 1,
    maxLength: 255,
    pattern: "\\S",
  },
} as const;

const propriedadesStatus = {
  active: {
    type: "boolean",
  },
  configurationValid: {
    type: "boolean",
  },
} as const;

export const schemaParametrosIdAplicativo = {
  type: "object",
  additionalProperties: false,
  required: ["id"],
  properties: {
    id: {
      type: "integer",
      minimum: 1,
    },
  },
} as const;

export const schemaCriacaoAplicativo = {
  type: "object",
  additionalProperties: false,
  required: ["name", "repositoryProvider", "repositoryUrl", "branch"],
  properties: {
    ...propriedadesPrincipais,
    ...propriedadesStatus,
  },
} as const;

export const schemaAtualizacaoAplicativo = {
  type: "object",
  additionalProperties: false,
  required: [
    "name",
    "repositoryProvider",
    "repositoryUrl",
    "branch",
    "active",
    "configurationValid",
  ],
  properties: {
    ...propriedadesPrincipais,
    ...propriedadesStatus,
  },
} as const;

export const schemaStatusAplicativo = {
  type: "object",
  additionalProperties: false,
  required: ["active"],
  properties: {
    active: propriedadesStatus.active,
  },
} as const;
