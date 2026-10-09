import { notFound } from "next/navigation";
import ObjectEditor from "@/components/admin/ObjectEditor";
import ListEditor from "@/components/admin/ListEditor";
import { getAdminCtx } from "@/lib/admin-data";
import { SECTIONS } from "@/lib/admin-schemas";
import type { SectionKey } from "@/lib/content-types";

export const dynamic = "force-dynamic";

const ANCHOR: Record<string, string> = {
  about: "about",
  experience: "experience",
  skills: "skills",
  projects: "projects",
  education: "education",
  certificates: "certificates",
};

export default async function SectionAdmin({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const cfg = SECTIONS[section];
  if (!cfg) notFound();

  const ctx = await getAdminCtx();
  const label = ctx.meta.profiles.find((p) => p.id === ctx.pid)?.label ?? ctx.pid;
  const key = cfg.global ? "global" : `${ctx.pid}:${section}`;
  const eyebrow = cfg.global ? "Site-wide" : `Editing - ${label}`;
  const data = (cfg.global
    ? ctx.global
    : ctx.content[section as keyof typeof ctx.content]) as unknown;
  const isCustom = cfg.global ? "global" in ctx.store : ctx.custom[section as SectionKey];

  const base = cfg.global ? "/" : `/?profile=${ctx.pid}`;
  const previewHref = ANCHOR[section] ? `${base}#${ANCHOR[section]}` : base;

  if (cfg.kind === "object") {
    return (
      <ObjectEditor
        key={key}
        sectionKey={key}
        eyebrow={eyebrow}
        title={cfg.title}
        description={cfg.description}
        fields={cfg.fields}
        initial={data as Record<string, unknown>}
        isCustom={isCustom}
        previewHref={previewHref}
      />
    );
  }

  return (
    <ListEditor
      key={key}
      sectionKey={key}
      eyebrow={eyebrow}
      title={cfg.title}
      description={cfg.description}
      noun={cfg.noun ?? "item"}
      fields={cfg.fields}
      initial={data as Record<string, unknown>[]}
      blank={cfg.blank ?? {}}
      titleKey={cfg.titleKey ?? "title"}
      subtitleKey={cfg.subtitleKey}
      thumbKey={cfg.thumbKey}
      isCustom={isCustom}
      previewHref={previewHref}
    />
  );
}