import Link from "next/link";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post] = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  if (!post) notFound();

  return (
    <article className="space-y-5">
      <Link href="/app/learn" className="text-sm font-semibold text-brand-700">
        ← Health library
      </Link>
      <header className="card p-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">{post.category}</span>
        <h1 className="mt-2 text-2xl font-extrabold leading-tight">
          {post.emoji} {post.title}
        </h1>
        <p className="mt-2 text-sm text-slate-500">{post.readMinutes} min read · Reviewed by MyDoc247 clinicians</p>
      </header>
      <div className="card space-y-4 p-6 text-[15px] leading-relaxed text-slate-700">
        {post.body.split("\n").filter(Boolean).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
        <p className="text-sm text-slate-600">Still have questions about this?</p>
        <Link href="/app/doctors" className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white">
          Ask a doctor
        </Link>
      </div>
    </article>
  );
}
