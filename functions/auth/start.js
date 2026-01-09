export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return new Response("Missing ?shop=your-store.myshopify.com", { status: 400 });
  }

  // Minimal scopes for testing
  const scope = "read_metaobject_definitions,write_metaobject_definitions,read_metaobjects,write_metaobjects,read_orders,read_product_feeds,write_product_feeds,read_product_listings,write_product_listings,read_products,write_products,customer_read_metaobjects,unauthenticated_read_metaobjects";

  const redirectUri = encodeURIComponent(`${url.origin}/auth/callback`);
  const installUrl =
    `https://${shop}/admin/oauth/authorize` +
    `?client_id=${encodeURIComponent(env.SHOPIFY_CLIENT_ID)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&redirect_uri=${redirectUri}`;

  return Response.redirect(installUrl, 302);
}
