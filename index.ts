enum API_VERSIONS {
  V1 = 1,
}

interface IConfig {
  apiUrl: string;
  apiVersion: API_VERSIONS;
}

const endPoints = ({ fullPath: string }) => ({
  authUrl: "auth_url",
});

const createAuth = (config: IConfig) => {};

export {};
