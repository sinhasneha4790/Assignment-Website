import { ButtonLink } from "@/components/ui/Button";

/** Shown on catalogue pages until a database is connected (first preview deploys). */
export function CatalogueUnavailable() {
  return (
    <div className="wrap py-24 flex flex-col items-start gap-4">
      <div className="eyebrow">Coming soon</div>
      <h1 className="serif text-[40px] leading-tight">The shop is being stocked.</h1>
      <p className="text-muted max-w-[480px]">Our catalogue isn’t connected yet. Please check back shortly.</p>
      <ButtonLink href="/">Back to home</ButtonLink>
    </div>
  );
}
