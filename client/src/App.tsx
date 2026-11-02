import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import ParentField from "@/pages/parent-field";
import PublishedPage from "@/pages/PublishedPage";
import MinimalIdentityShell from "@/components/layout/MinimalIdentityShell";
import QuietFooter from "@/components/layout/QuietFooter";
import { LanguageProvider } from "@/contexts/LanguageContext";

function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const path = (window.location.pathname.slice(base.length).replace(/\/$/, "") || "/");
  const parentSections = ["orientation","existing","architecture","expressions","evidence","lineage","contact"];
  const parentSection = path === "/" ? "orientation" : path.slice(1);
  const isParent = parentSections.includes(parentSection);
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <div className="min-h-screen bg-[#FCFAF6] text-[#17201D]">
          <MinimalIdentityShell />
          <main>
            {isParent ? <ParentField section={parentSection} /> : <PublishedPage path={path} />}
          </main>
          <QuietFooter />
        </div>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
