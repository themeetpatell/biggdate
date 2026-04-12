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

export function WhatsAppIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("size-4", className)}
      {...props}
    >
      <path
        d="M20.5 11.8a8.5 8.5 0 0 1-12.2 7.6L4 20l.7-4A8.5 8.5 0 1 1 20.5 11.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 8.9c.2-.5.4-.5.7-.5h.6c.2 0 .5 0 .7.5l.3 1c.1.4.1.6-.1.8l-.4.5c-.1.1-.2.3 0 .6.3.5.9 1.1 1.4 1.4.3.2.5.1.6 0l.5-.4c.2-.2.4-.2.8-.1l1 .3c.5.2.5.5.5.7v.6c0 .3 0 .5-.5.7-.6.2-1.3.2-1.8 0-.9-.3-2-.9-3.1-2-.9-.9-1.5-1.9-1.8-2.7-.2-.6-.2-1.3 0-1.9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
    label: "WhatsApp",
    href: "https://api.whatsapp.com/send?text=Hello%20BiggDate",
    Icon: WhatsAppIcon,
  },
  {
    label: "Email",
    href: "mailto:hello@biggdate.com",
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
    href: "https://twitter.com/biggdate",
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
