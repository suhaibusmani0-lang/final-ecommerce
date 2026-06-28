// components/footer/BrandSection.tsx
import { FaInstagram, FaXTwitter, FaFacebookF } from "react-icons/fa6";
import { socialLinks } from "@/data/footerData";

export function BrandSection() {
  const iconMap = {
    FaInstagram,
    FaXTwitter,
    FaFacebookF,
  };

  return (
    <div className="col-span-2 md:col-span-1">
      <p className="text-base sm:text-lg tracking-[0.2em] uppercase font-bold mb-3">
        Cosmopolitan Xccessories
      </p>
      <p className="text-xs sm:text-sm text-white/50 leading-relaxed max-w-[220px]">
        A curated blend of fashion and home — crafted for the way you live.
      </p>
      <div className="flex gap-4 mt-5">
        {socialLinks.map((social, i) => {
          const Icon = iconMap[social.icon as keyof typeof iconMap];
          return Icon ? (
            <a
              key={i}
              href={social.href}
              aria-label={social.label}
              className="text-white/50 hover:text-[#C17A56] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon size={17} />
            </a>
          ) : null;
        })}
      </div>
    </div>
  );
}