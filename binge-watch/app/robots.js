export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://binge-watch.example/sitemap.xml",
  };
}
