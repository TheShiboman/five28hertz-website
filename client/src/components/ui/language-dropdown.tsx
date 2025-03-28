import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage, Language } from '@/contexts/LanguageContext';

interface LanguageOption {
  code: Language;
  label: string;
}

const LanguageDropdown: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  
  const languages: LanguageOption[] = [
    { code: 'en', label: 'English' },
    // Uncomment these when ready to support additional languages
    // { code: 'fr', label: 'Français' },
    // { code: 'ar', label: 'العربية' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300"
        >
          <Globe className="h-3.5 w-3.5 mr-1" />
          Language
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[120px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={`text-sm ${
              language === lang.code ? 'font-medium' : 'font-normal'
            } cursor-pointer`}
            onClick={() => setLanguage(lang.code)}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;