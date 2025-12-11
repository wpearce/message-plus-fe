export async function onRequest(context: any): Promise<Response> {
  const { request } = context;

  const incomingUrl = new URL(request.url);

  const backendUrl = new URL(request.url);

  backendUrl.hostname = "messageplus.fly.dev";
  backendUrl.protocol = "https:";
  backendUrl.port = ""; // 443 is implied, no need to set

  console.log(
    "Proxying",
    incomingUrl.toString(),
    "->",
    backendUrl.toString()
  );

  // Preserve method, headers, body, etc. while changing only the URL
  const proxiedRequest = new Request(backendUrl.toString(), request);

  return fetch(proxiedRequest);
}
