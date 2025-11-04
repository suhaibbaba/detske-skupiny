// app/template.tsx
import { Suspense } from "react";
import Loading from "@/components/ui/Loading";

export default function Template({ children }: { children: React.ReactNode }) {
  // return <Suspense fallback={<Loading />}>{children}</Suspense>;
  return children;
}
