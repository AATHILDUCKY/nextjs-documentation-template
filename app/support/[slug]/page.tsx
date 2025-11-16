// app/support/[slug]/page.tsx
import { getAllPostsMeta, getPostBySlug } from "@/lib/posts";
import { SupportArticleContent } from "../../../components/SupportArticleContent";

type PageProps = {
  // In your Next.js version, params is a Promise
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPostsMeta();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function SupportArticlePage({ params }: PageProps) {
  const { slug } = await params;

  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <main className="mx-auto w-full px-4 py-8 md:py-10">
        <div className="mb-6 border-b border-slate-200 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1C3E66]">
            Support Writeup
          </p>
          <h1 className="mt-2 text-balance text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Article not found
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            We couldn&apos;t find this writeup. It may have been renamed or
            removed. Try going back to the knowledge base and searching again.
          </p>
        </div>
      </main>
    );
  }

  // ✅ Client-side component handles markdown rendering + TOC + scrollspy
  return <SupportArticleContent post={post} />;
}
