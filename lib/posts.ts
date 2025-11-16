import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category?: string;
  thumbnail?: string;
  keywords?: string[];
};

export type Post = PostMeta & {
  content: string; // raw Markdown / MDX content
};

// content/ at the project root (same level as app/, lib/, etc.)
const postsDirectory = path.join(process.cwd(), "content");

function getMarkdownFiles(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
}

export function getAllPostsMeta(): PostMeta[] {
  const files = getMarkdownFiles();

  const posts = files.map((fileName) => {
    // e.g. "troubleshoot-login-failures.mdx" → "troubleshoot-login-failures"
    const slug = fileName.replace(/\.mdx?$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      title: (data.title as string) ?? slug,
      description: (data.description as string) ?? "",
      date: (data.date as string) ?? new Date().toISOString(),
      tags: (data.tags as string[]) ?? [],
      category: data.category as string | undefined,
      thumbnail: data.thumbnail as string | undefined,
      keywords: (data.keywords as string[]) ?? [],
    };
  });

  // newest first
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Look up a single post by slug.
 * Slug is always a simple string (e.g. "troubleshoot-login-failures").
 */
export function getPostBySlug(slug: string): Post | null {
  if (!slug) return null;

  const safeSlug = slug.replace(/[/\\]/g, "").trim();
  if (!safeSlug) return null;

  const mdxPath = path.join(postsDirectory, safeSlug + ".mdx");
  const mdPath = path.join(postsDirectory, safeSlug + ".md");

  let fullPath: string | null = null;
  if (fs.existsSync(mdxPath)) {
    fullPath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    fullPath = mdPath;
  }

  if (!fullPath) {
    console.warn("[getPostBySlug] No file for slug:", safeSlug);
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const meta: PostMeta = {
    slug: safeSlug,
    title: (data.title as string) ?? safeSlug,
    description: (data.description as string) ?? "",
    date: (data.date as string) ?? new Date().toISOString(),
    tags: (data.tags as string[]) ?? [],
    category: data.category as string | undefined,
    thumbnail: data.thumbnail as string | undefined,
    keywords: (data.keywords as string[]) ?? [],
  };

  return {
    ...meta,
    content, // raw markdown (rendered later with react-markdown)
  };
}
