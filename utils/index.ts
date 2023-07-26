import { BasedUrls } from "../types";

export const isDetailResponse = function isDetailResponse(
  response: { [key: string]: any } | { detail: string }
): response is { detail: string } {
  return (response as { detail: string }).detail !== undefined;
};

export function encodeQueryString(params: { [key: string]: string }): string {
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

export function generateLinks<T extends keyof typeof BasedUrls>({
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

export const responseToJSon = async <T>(response: Response): Promise<T> => {
  return await response.json();
};
