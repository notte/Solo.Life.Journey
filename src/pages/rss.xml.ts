import rss from "@astrojs/rss";
import { AppConfig } from "@/utils/AppConfig";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = import.meta.glob("./posts/**/*_post.md");
  const items = await Promise.all(
    Object.values(posts).map(async (post) => {
      const { frontmatter } = (await post()) as { frontmatter: any };
      return {
        title: frontmatter.title,
        pubDate: frontmatter.pubDate,
        description: frontmatter.excerpt,
        link: frontmatter.url,
      };
    }),
  );
  return rss({
    title: AppConfig.title,
    description: AppConfig.description,
    site: context.site!,
    items,
  });
}
