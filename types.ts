enum API_VERSIONS {
  V1 = 1,
}

export enum BasedUrls {
  authUrl = "auth_url",
  tokens = "tokens",
  testUrl = "test_url", // check valid tokens
  refresh = "refresh",
  logout = "logout",
}

export interface IConfig {
  apiUrl: string;
  apiVersion?: API_VERSIONS;
}
