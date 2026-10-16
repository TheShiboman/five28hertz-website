import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import ParentField from "@/pages/parent-field";
import MinimalIdentityShell from "@/components/layout/MinimalIdentityShell";
import QuietFooter from "@/components/layout/QuietFooter";
import { LanguageProvider } from "@/contexts/LanguageContext";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <div className="min-h-screen bg-[#F6F2EA] text-[#17201D]">
          <MinimalIdentityShell />
          <main>
            <ParentField />
          </main>
          <QuietFooter />
        </div>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
