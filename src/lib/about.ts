export interface SkillGroup {
  title: string;
  tags: string[];
}

export interface ExperienceItem {
  dates: string;
  role: string;
  organization: string;
  bullets: string[];
}

export const aboutCopy = {
  bannerTitle: "About Me",
  bannerSubtitle: "Live Event Coverage Specialist & Creative Storyteller",
  role: "Live Event Coverage Specialist",
  intro: [
    "I'm a creative professional based in Houston, TX and a graduate of Lone Star College Kingwood, where I earned my Associate's degree in Visual Communication with a focus on Film and Video.",
    "I specialize in live event coverage. Whether I'm behind a camera at a large event or in the editing suite bringing footage to life, I bring the same enthusiasm and reliability to every project.",
  ],
  education: {
    title: "Associate's Degree — Visual Communication & Film and Video",
    school: "Lone Star College Kingwood",
  },
  fieldPhotos: [
    { src: "/AboutPage1.jpg", alt: "Riley Musil in the field" },
    { src: "/AboutPage2.jpg", alt: "Riley Musil with camera" },
    { src: "/AboutPage3.jpg", alt: "Riley Musil shooting" },
  ],
  honors: [
    "President's Honors List",
    "Design-a-Thon 2024/2025 Participant",
    "Volunteer, North Central Church Kid's Dept. (Aug 2022 – Nov 2024)",
  ],
  hobbies: [
    "Photography & videography outside of work",
    "Exploring new techniques in post-production",
  ],
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Software",
    tags: [
      "Premiere Pro",
      "After Effects",
      "Photoshop",
      "Lightroom",
      "Illustrator",
      "Audition",
      "OBS",
      "Excel",
    ],
  },
  {
    title: "Proficiencies",
    tags: [
      "Camera Operation",
      "Lighting Setup",
      "On-Set Audio Capture",
      "Post-Production",
    ],
  },
  {
    title: "Skills",
    tags: [
      "Eager to Learn",
      "Reliable",
      "Enthusiastic",
      "Strong Character",
      "Passionate",
    ],
  },
];

export const experience: ExperienceItem[] = [
  {
    dates: "Sept 2023 – Present",
    role: "Communications Team",
    organization: "STX Network Royal Rangers",
    bullets: ["Photograph and video events", "Plan outreach and social media posts"],
  },
  {
    dates: "Mar 2021 – Jul 2024",
    role: "Media Intern",
    organization: "North Central Church",
    bullets: [
      "Interned with Dr. William A. Horton, 4 hours weekly",
      "Created and edited social media posts and Sunday morning announcement videos",
      "Photographed and filmed church events",
    ],
  },
];
