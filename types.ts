enum API_VERSIONS {
  V1 = 1,
}

export enum BasedUrls {
  authUrl = "auth-url",
  tokens = "tokens",
  testUrl = "test-url", // check valid tokens
  refresh = "refresh",
  logout = "logout",
}

export interface IConfig {
  apiUrl: string;
  apiVersion?: API_VERSIONS;
  apiLib?: "fetch" | "axios" | "ky";
}
