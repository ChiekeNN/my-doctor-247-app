import Link from "next/link";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Health library" };

export default async function LearnPage() {
  const posts = await db.select().from(articles).orderBy(desc(articles.publishedAt));
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Health library</h1>
        <p className="text-sm text-slate-500">
          Plain-language guides written by Nigerian doctors. Saved offline once opened.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((p) => (
          <Link key={p.id} href={`/app/learn/${p.slug}`} className="card p-5 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-2xl">
                {p.emoji}
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">{p.category}</span>
                <h2 className="mt-1 font-bold leading-snug">{p.title}</h2>
                <p className="mt-1.5 text-sm text-slate-600">{p.excerpt}</p>
                <p className="mt-2 text-xs text-slate-400">{p.readMinutes} min read</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
