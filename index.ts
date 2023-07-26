import { IConfig } from "./types";
import {
  generateLinks,
  encodeQueryString,
  responseToJSon,
  isDetailResponse,
} from "./utils";

const createAuth = (config: IConfig) => {
  const { testUrl, authUrl, tokens, refresh, logout } = generateLinks({
    fullPath: `${config.apiUrl}/auth`,
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
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error(error as string);
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
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error(error as string);
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
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error(error as string);
    }
  };

  const refreshReq = async (): Promise<
    | {
        detail: string;
        status?: number;
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
        localStorage.setItem("access", jsonResponse.access_token);
        return {
          access_token: jsonResponse.access_token,
        };
      }
    } catch (error) {
      if (error instanceof Response) {
        if (error.status === 401) {
          return {
            detail: "not auth",
            status: 401,
          };
        } else throw new Error(await error.json());
      }
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error(error as string);
    }
  };

  const logoutReq = async (): Promise<any> => {
    try {
      await fetch(logout);

      return;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error(error as string);
    }
  };

  async function authGuard(target: any, propertyName: any, descriptor: any) {
    if (!localStorage.getItem("access")) {
      throw new Error("no acces in local");
    }
    const method = descriptor.value;
    descriptor.value = async function (...args: any) {
      try {
        const responseReq = await method.apply(target, args);
        return responseReq;
      } catch (error) {
        if (error instanceof Response) {
          if (error.status === 401) {
            await refreshReq();
            return method.apply(target, args);
          }
        } else throw new Error(JSON.stringify(error));
      }
    };
  }

  return {
    loginReq,
    tokenReq,
    testTokenReq,
    refreshReq,
    logoutReq,
    authGuard,
  };
};

export { createAuth };
