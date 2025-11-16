import { getAllPostsMeta } from "@/lib/posts";
import { SupportHome } from "@/components/SupportHome";

export default async function Page() {
  const posts = getAllPostsMeta();

  return <SupportHome posts={posts} />;
}
