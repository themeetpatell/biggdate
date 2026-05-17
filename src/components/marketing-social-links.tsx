import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
  Youtube,
} from "lucide-react";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

export function MediumIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("size-4", className)}
      {...props}
    >
      <path
        d="M5 7.5c1.7 0 3 2 3 4.5s-1.3 4.5-3 4.5-3-2-3-4.5 1.3-4.5 3-4.5Zm8 0c2.3 0 4 2 4 4.5s-1.7 4.5-4 4.5-4-2-4-4.5 1.7-4.5 4-4.5Zm7 1.2c.8 0 1.5 1.5 1.5 3.3s-.7 3.3-1.5 3.3-1.5-1.5-1.5-3.3.7-3.3 1.5-3.3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type MarketingSocialLink = {
  label: string;
  href?: string;
  Icon: ComponentType<{ className?: string }>;
};

export const MARKETING_SOCIAL_LINKS: readonly MarketingSocialLink[] = [
  {
    label: "Email",
    href: "mailto:meet@biggventures.com",
    Icon: Mail,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/biggdate",
    Icon: Linkedin,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/biggdates",
    Icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/biggdate",
    Icon: Facebook,
  },
  {
    label: "Twitter",
    href: "https://twitter.com/biggdates",
    Icon: Twitter,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/biggdate",

    Icon: Youtube,
  },
  {
    label: "Medium",
    href: "https://medium.com/@biggdate",

    Icon: MediumIcon,
  },
] as const;
