import { UseCaseIllustration } from "@/components/use-cases/use-case-illustration";
import type { UseCase } from "@/types/use-cases";

/** One art strip per member side by side, up to three: several things, at a glance. */
export function GroupIllustration({
  members,
  fallbackCategories,
  className = "h-32",
}: {
  members: UseCase[];
  fallbackCategories: string[];
  className?: string;
}) {
  const shown = members.slice(0, 3);
  return (
    <div aria-hidden className={`flex divide-x-2 divide-background ${className}`}>
      {(shown.length ? shown.map((useCase) => useCase.categories) : [fallbackCategories]).map((categories, index) => (
        <UseCaseIllustration key={index} categories={categories} className="h-full flex-1" />
      ))}
    </div>
  );
}
