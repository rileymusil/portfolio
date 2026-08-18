import { Badge } from "@/components/ui/badge";

interface SkillTagProps {
  children: React.ReactNode;
}

export function SkillTag({ children }: SkillTagProps) {
  return (
    <Badge
      variant="outline"
      className="rounded-full border-[#dce1e5] bg-muted px-3 py-1 text-[0.8rem] font-normal text-[#555]"
    >
      {children}
    </Badge>
  );
}
