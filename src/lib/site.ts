export interface NavLinkItem {
  href: string;
  label: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  subtitle: string;
  email: string;
  phoneDisplay: string;
  phoneHref: string;
  location: string;
  bookNowUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  resumeUrl: string;
  showReelYoutubeId: string;
}

export const site = {
  name: "Riley Musil",
  tagline: "Capturing the Moment.",
  subtitle: "Event Video & Photography Coverage | Post-Production & Editing",
  email: "rileymusil2006@gmail.com",
  phoneDisplay: "(832) 303-3162",
  phoneHref: "tel:+18323033162",
  location: "Houston, TX",
  bookNowUrl: "http://rileymusil.square.site/",
  linkedinUrl: "https://www.linkedin.com/in/riley-musil-402786332",
  instagramUrl: "https://instagram.com/rileymusil",
  resumeUrl:
    "https://drive.google.com/file/d/1qyKpHzOBAEuwsj0gfhm9iafWd5cBGbZd/view?usp=sharing",
  showReelYoutubeId: "GYFBoC3VqJU",
} as const satisfies SiteConfig;

export const navLinks: NavLinkItem[] = [
  { href: "/video", label: "Video" },
  { href: "/photography", label: "Photography" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
