export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const code = url.searchParams.get("code");

  if (!shop || !code) {
    return new Response("Missing shop or code. This endpoint must be used as Shopify OAuth redirect_uri.", { status: 400 });
  }

  // Exchange code -> access token
  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.SHOPIFY_CLIENT_ID,
      client_secret: env.SHOPIFY_CLIENT_SECRET,
      code,
    }),
  });

  const tokenJson = await tokenRes.json();

  if (!tokenRes.ok) {
    return new Response(`Token exchange failed:\n${JSON.stringify(tokenJson, null, 2)}`, { status: 500 });
  }

  // Display token ONCE for testing (don’t do this in production)
  return new Response(
    `SUCCESS\n\nAccess token:\n${tokenJson.access_token}\n\nScope:\n${tokenJson.scope}\n`,
    { headers: { "Content-Type": "text/plain" } }
  );
}
