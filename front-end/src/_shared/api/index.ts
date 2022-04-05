import { message } from "antd";

export async function fetchClient(
  endpoint: string,
  { body, ...customConfig }: any = {}
) {
  try {
    const defaultHeaders: Record<string, string> = {
      "content-type": "application/json",
    };

    const config: Record<string, any> = {
      method: body ? "POST" : "GET",
      ...customConfig,
      headers: {
        ...defaultHeaders,
        ...customConfig.headers,
      },
    };

    if (body) {
      config.body = body instanceof FormData ? body : JSON.stringify(body);
    }
    const response = await fetch(endpoint, config);
    const data = await response.json();
    return data;
  } catch (e: any) {
    message.error("API error");
  }
}
