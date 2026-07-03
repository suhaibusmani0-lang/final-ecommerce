// components/footer/LegalBar.tsx
import { legalLinks } from "@/data/footerData";

export function LegalBar() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-white/40">
        <p>© {currentYear}  All rights reserved by Cosmopolitan Xccessories . Developed by <a href="https://zarnetic.com" className="hover:text-white" target="_blank" rel="noopener noreferrer">Zarnetic</a></p>
        <div className="flex gap-4">
          {legalLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}