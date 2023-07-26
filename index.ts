import { IConfig } from "./types";
import {
  generateLinks,
  encodeQueryString,
  responseToJSon,
  isDetailResponse,
} from "./utils";

const createAuth = (config: IConfig) => {
  const { testUrl, authUrl, tokens, refresh, logout } = generateLinks({
    fullPath: `${config.apiUrl}/api/v${config.apiVersion}/auth`,
  });

  // for ex https://test.com/keyclock-login -- here check param "code" and send in tokens as param code: code
  const loginReq = async ({ redirect_uri }: { redirect_uri: string }) => {
    try {
      const response = await fetch(
        authUrl + encodeQueryString({ redirect_uri })
      );

      const jsonResponse = await responseToJSon<{
        url: string;
      }>(response);

      window.location.href = jsonResponse.url;
    } catch (error) {
      throw new Error(error);
    }
  };

  // set refresh to cookies & get access token to manage
  const tokenReq = async ({
    code,
    redirect_uri,
  }: {
    code: string;
    redirect_uri: string;
  }): Promise<
    | {
        access_token: string;
      }
    | Error
  > => {
    try {
      const response = await fetch(
        tokens + encodeQueryString({ code, redirect_uri })
      );

      const jsonResponse = await responseToJSon<{
        access_token: string;
      }>(response);

      return {
        access_token: jsonResponse.access_token,
      };
    } catch (error) {
      throw new Error(error);
    }
  };

  // check valid access token
  const testTokenReq = async (): Promise<
    | {
        detail: string;
      }
    | Error
  > => {
    try {
      const response = await fetch(testUrl);

      const jsonResponse = await responseToJSon<{
        detail: string;
      }>(response);

      return {
        detail: jsonResponse.detail,
      };
    } catch (error) {
      throw new Error(error);
    }
  };

  const refreshReq = async (): Promise<
    | {
        detail: string;
      }
    | {
        access_token: string;
      }
    | Error
  > => {
    try {
      const response = await fetch(refresh);

      const jsonResponse = await responseToJSon<
        | {
            detail: string;
          }
        | {
            access_token: string;
          }
      >(response);

      if (isDetailResponse(jsonResponse)) {
        return {
          detail: jsonResponse.detail,
        };
      } else {
        return {
          access_token: jsonResponse.access_token,
        };
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const logoutReq = async (): Promise<any> => {
    try {
      await fetch(logout);

      return;
    } catch (error) {
      throw new Error(error);
    }
  };

  return {
    loginReq,
    tokenReq,
    testTokenReq,
    refreshReq,
    logoutReq,
  };
};

export { createAuth };
