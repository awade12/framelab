import { STYLES } from "./constants";

interface SidebarSectionProps {
  title: string;
  meta?: string;
  divided?: boolean;
  children: React.ReactNode;
}

export const SidebarSection = ({
  title,
  meta,
  divided = true,
  children,
}: SidebarSectionProps) => (
  <section className={`${STYLES.block} ${divided ? STYLES.divider : ""}`}>
    <div className={STYLES.labelRow}>
      <h2 className="text-[11px] font-medium text-zinc-500">{title}</h2>
      {meta && <span className={STYLES.meta}>{meta}</span>}
    </div>
    {children}
  </section>
);
