enum API_VERSIONS {
  V1 = 1,
}

enum BasedUrls {
  authUrl = "auth_url",
  tokens = "tokens",
  testUrl = "test_url", // check valid tokens
  refresh = "refresh",
  logout = "logout",
}

interface IConfig {
  apiUrl: string;
  apiVersion: API_VERSIONS;
}

function encodeQueryString(params) {
  const keys = Object.keys(params);
  return keys.length
    ? "?" +
        keys
          .map(
            (key) =>
              encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
          )
          .join("&")
    : "";
}

function generateLinks<T extends keyof typeof BasedUrls>({
  fullPath,
}: {
  fullPath: string;
}): Record<T, string> {
  const fullPathLinks = {} as Record<T, string>;
  for (const [key, value] of Object.entries(BasedUrls)) {
    fullPathLinks[key] = `${fullPath}/${value}`;
  }

  return fullPathLinks;
}

const createAuth = (config: IConfig) => {
  const { testUrl, authUrl, tokens, refresh, logout } = generateLinks({
    fullPath: `/api/v${config.apiVersion}/auth/`,
  });

  const testUrlReq = ({ redirect_uri }: { redirect_uri: string }) => {
    fetch(authUrl + encodeQueryString({ redirect_uri }));
  };
};

export { createAuth };
