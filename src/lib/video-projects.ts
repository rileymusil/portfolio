export interface VideoStill {
  src: string;
  alt: string;
  caption: string;
}

export interface VideoProject {
  id: string;
  number: string;
  title: string;
  youtubeId: string;
  badges: string[];
  descriptionHtml: string;
  stills?: VideoStill[];
}

export function getYoutubeThumbnailUrl(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

export const narrativeProjects: VideoProject[] = [
  {
    id: "the-man-in-the-woods",
    number: "01",
    title: "The Man in the Woods",
    youtubeId: "YqYoziZZlg8",
    badges: ["Camera Operator", "Director", "Short Film"],
    descriptionHtml: `<p>This is a short film that I wrote in my second semester of College, filmed it in late fall of 2025. I served as the writer, storyboard artist, director, and cinematographer for this project. We shot this film with the <a href="https://global.canon/en/c-museum/product/cesc900.html" target="_blank" rel="noopener">Canon R5 C</a> and an <a href="https://www.usa.canon.com/shop/p/rf24-70mm-f2-8l-is-usm?color=Black&type=New" target="_blank" rel="noopener">RF24-70mm F2.8</a> lens. I had a fairly sizeable team for this shoot, which was extremely helpful considering we were having to haul all of our equipment through the woods. By the end of the first day of shooting, some of us had walked quite a few miles. One of the ways we tried to improve our efficiency with this shoot was by sending grips ahead to the next location while shooting a scene, so we wouldn't take us long setting up the next scene. Overall, that approach worked quite well. On the first day, we captured all of the scenes besides the scenes with the chicken coop, which were filmed in a different location on day two because of our lack of sunlight. I'm extremely happy with how this project came out. Everyone who was a part of our team worked so hard, and it really paid off. This specific edit of the film was fully created by my good friend Michelle Hernández, and I think she did an incredible job. I am currently working on a more refined version of my own edit, which I will host here eventually.</p>`,
    stills: [
      {
        src: "/video-stills/LocationScout1.jpg",
        alt: "Early location scouting in the woods",
        caption: "Early Location Scouting",
      },
      {
        src: "/video-stills/LocationScout2.jpg",
        alt: "Early location scouting, trail view",
        caption: "Early Location Scouting",
      },
      {
        src: "/video-stills/Storyboard1.jpg",
        alt: "Storyboard excerpt for The Man in the Woods",
        caption: "Storyboard Excerpt",
      },
      {
        src: "/video-stills/Script1.jpg",
        alt: "Script excerpt for The Man in the Woods",
        caption: "Script Excerpt",
      },
    ],
  },
  {
    id: "powwow-2023",
    number: "02",
    title: "Powwow Video Contest — 2023",
    youtubeId: "GGQ91WSZXIY",
    badges: ["Camera Operator", "Editor", "Top Submission"],
    descriptionHtml: `<p>This video was a submission on behalf of Royal Rangers Outpost 44 for the STXRR 2023 PowWow in April of that year. The contest is simply titled the "We Can't Wait for PowWow" video, where outposts are tasked with creating a short video showcasing why they're excited for the camp. I've attended this camp regularly since elementary school, and my friends and I loved working on our submission every year. This competition was a big reason I became so interested in media production at such an early age. Our concept for this video was simple; we had won the camp competition the previous year, so we used the trophy as our main set piece and created a short trailer for our next victory. We ended up not only winning first place in the competition with our submission, but that year we also won first place in the camp! Overall, this project was super fun and one of my earliest projects that I hold a lot of pride in. I'm really proud of what my friends and I were all able to accomplish; everyone really played their part perfectly. I filmed a decent percentage of the video; however, I was responsible for 99% of the editing on this project, and I think I was really able to push our idea to the next level.</p>`,
    stills: [
      {
        src: "/video-stills/Johno.jpg",
        alt: "Behind the scenes on set",
        caption: "BTS",
      },
    ],
  },
  {
    id: "family-dinner",
    number: "03",
    title: "Family Dinner",
    youtubeId: "5tpDpPqEXyU",
    badges: ["Camera Operator", "Gaffer"],
    descriptionHtml: `<p>This short, appropriately titled <em>Family Dinner</em> was a final collaborative project for my lighting class in my third semester of college. The script was written and directed by <a href="https://linktr.ee/probablyaves" target="_blank" rel="noopener">Avery Evans</a>, a great friend of mine and a fantastic writer. This project took a lot of planning. I was mostly responsible for cameras and lights. Avery and I worked together in pre-production to create set maps to make shooting easier, and Avery even scheduled a day for us to practice and experiment with our location before the actual shoot day with all the actors. All of our work ahead of the shoot really paid off, as it made shooting much more streamlined. Our actual filming all took place in the morning and afternoon, actually right before the shoot for my previously featured short film <em>"The Man in the Woods"</em> and filmed with the same <a href="https://global.canon/en/c-museum/product/cesc900.html" target="_blank" rel="noopener">Canon R5 C</a> and <a href="https://www.usa.canon.com/shop/p/rf24-70mm-f2-8l-is-usm?color=Black&type=New" target="_blank" rel="noopener">RF24-70mm F2.8</a> lens setup as that film. I'm really proud of my work adapting the space to capture the emotion that Avery envisioned in this project, and I think our whole crew did a truly amazing job, especially the girl with the red hair, AKA my incredible girlfriend, Lydia.</p>`,
    stills: [
      {
        src: "/video-stills/AverySetMap.jpg",
        alt: "Set planning sketch",
        caption: "Early Set Map",
      },
      {
        src: "/video-stills/KittyCat.jpg",
        alt: "Behind the scenes with cat",
        caption: "Kitty",
      },
      {
        src: "/video-stills/Set1.jpg",
        alt: "Testing the set setup",
        caption: "Test Setup",
      },
      {
        src: "/video-stills/Framing.jpg",
        alt: "Camera monitor showing framing",
        caption: "Testing Framing",
      },
      {
        src: "/video-stills/Set2.jpg",
        alt: "Testing lighting setup",
        caption: "Testing Lighting",
      },
    ],
  },
  {
    id: "powwow-2024",
    number: "04",
    title: "Powwow Video Contest — 2024",
    youtubeId: "3e0WRKEbBAQ",
    badges: ["Camera Operator", "Editor", "Top Submission"],
    descriptionHtml: `<p>This video was another submission on behalf of Royal Rangers Outpost 44, this time for the STXRR 2024 PowWow "We Can't Wait for PowWow" video competition. This time we had the idea of showcasing the events, games, and activities as if they were in a 1920's silent film era motion picture. I think we were very effective with our video. Similar to the previous year I was responsible for all editing and motion graphics, which I mostly composited in Adobe Premiere Pro.</p>`,
  },
  {
    id: "hostage-scene",
    number: "05",
    title: "Hostage Scene — Lighting Assignment",
    youtubeId: "9tvs-Rycvx8",
    badges: ["Gaffer", "Camera Operator"],
    descriptionHtml: `<p>This project was a lighting exercise for class; all the visuals were straight from the camera. Only sound manipulation and stabilizing techniques were applied.</p>`,
  },
];

export const commercialProjects: VideoProject[] = [
  {
    id: "youth-camp",
    number: "01",
    title: "NC Church Youth Camp Video",
    youtubeId: "9wd2dRwnwMc",
    badges: ["Camera Operator", "Editor"],
    descriptionHtml: `<p>This video is one of my all-time favorite projects that I've worked on. It started as a hobbyist project. I was working at North Central church as a part of an internship at the time, and as part of that, I had been previously tasked to create a short highlight of the church's 2023 Youth Camp. I really enjoyed making that short reel with the footage I had available, but I knew that next year I wanted to strive to do more. Now, with the 2024 camp coming up, knowing I would be attending, I made sure to come prepared. I packed my <a href="https://global.canon/en/c-museum/product/dslr801.html" target="_blank" rel="noopener">Canon T1i</a> and Sony DSC-H200 cameras as well as my ThinkPad P15s, all incredibly budget gear.</p><p>I find that the limitations of my equipment were actually my favorite part of creating this project. It shows my ability to adapt and problem-solve. Shooting was very straightforward; neither camera boasts very high recording specs, so I chose to focus more on the composition and framing of my shots. During post-production, I encountered most of my limitations. I had a two-week trip in Missouri directly after the camp, where I did not have a stable internet connection. Because of this, I had to figure out solutions to any problems that came up with only the knowledge I had already obtained in Premiere Pro by this point. This turned out to be a really great exercise, and it helped a lot with my creativity. For the music tracks in this video, I had to resort to walking up a hill to the highest point in the campground I was staying at just to get enough of a connection to download them. That was the only point, up to the finalization of the project, where anything besides what was in the program was needed. This video also took a LONG time. My setup was extremely limited; I was using an old TV from a friend's RV as a preview monitor, my laptop, which had an <a href="https://www.techpowerup.com/gpu-specs/quadro-p600-mobile.c3200" target="_blank" rel="noopener">NVIDIA Quadro P600</a> as its GPU, and because of this, I also opted to use the 2022 version of Adobe Premiere for stability. The limitations of my hardware forced me to render a lot, but in the end, I believe my patience truly paid off.</p><p>The North Texas chapter of AG, which ran the camp the NC church attended that year, created its own video for the camp, but I was really glad I created this project because I was able to capture all of the work our group and team put into the camp, as well as highlight more of our own smiling faces. Since the camp, I've been honored to have had NC Youth show my video at many of their services as a promo piece, and I'm really thankful to have had this experience to hone my craft.</p>`,
    stills: [
      {
        src: "/video-stills/SetupYouthVideo.jpg",
        alt: "Youth Camp video editing setup",
        caption: "Editing Setup — Youth Camp Video",
      },
    ],
  },
  {
    id: "wellspring-testimonial",
    number: "02",
    title: "All About Wellspring Birth Center — Testimonial",
    youtubeId: "iaY3fa-e92k",
    badges: ["Director", "Editor", "Camera Operator", "Producer"],
    descriptionHtml: `<p>This was a project where I was tasked with leading a small team in creating interview-style testimonials for the business. I was in charge of planning for all four of our shoot days, organizing our team, and carrying out the majority of post-production. My team consisted of Lydia W, <a href="https://boariperez.com/" target="_blank" rel="noopener">Boari Perez</a>, <a href="https://kamran-media.com/" target="_blank" rel="noopener">Kamran Malik</a>, <a href="https://www.linkedin.com/in/richellefloyd/" target="_blank" rel="noopener">Richelle Floyd</a>, <a href="https://www.linkedin.com/in/kristaedwards7368/" target="_blank" rel="noopener">Krista Edwards</a>, <a href="https://www.alexander-newman.com/" target="_blank" rel="noopener">Alexander Newman</a>, <a href="https://ivmediaeditor.myportfolio.com/home" target="_blank" rel="noopener">Isaac Velazquez</a>, and <a href="https://www.instagram.com/geno_mals/" target="_blank" rel="noopener">Geno Malio</a>.</p>`,
  },
  {
    id: "bawls-guarana",
    number: "03",
    title: "Bawls Guarana Mock Promo",
    youtubeId: "ZYVO7ubnHF8",
    badges: ["Gaffer", "Camera Operator"],
    descriptionHtml: `<p>This is a mockup promotional video I made for my lighting class; all color work came straight out of the camera, no post-processing was applied.</p>`,
  },
  {
    id: "inspire-event",
    number: "04",
    title: "Inspire Event Video",
    youtubeId: "h-zspHzXdMQ",
    badges: ["Event Coverage", "Editor"],
    descriptionHtml: `<p>This was a short recap video I was tasked with shooting and editing by North Central Church for the Inspire event they hosted for Carl Wunsche Sr. High School.</p>`,
  },
  {
    id: "design-a-thon-2025",
    number: "05",
    title: "Design-A-Thon 2025 — Lonestar College Kingwood",
    youtubeId: "MQYwugJX1F8",
    badges: ["Camera Operator"],
    descriptionHtml: `<p>This is an event recap video directed and produced by <a href="https://kamran-media.com/" target="_blank" rel="noopener">Kamran Malik</a> for Lone Star College Kingwood. I served as a shooter for some of the highlight footage in the project's intro.</p>`,
  },
  {
    id: "hannah-testimonial",
    number: "06",
    title: "Hannah Testimonial — Wellspring Birth Center",
    youtubeId: "3GHNIiwqSLE",
    badges: ["Camera Operator", "Director", "Editor"],
    descriptionHtml: `<p>This was a testimonial video I shot, edited, and produced for Wellspring Midwifery Care &amp; Birth Center.</p>`,
  },
  {
    id: "repentance-podcast",
    number: "07",
    title: "What Is Repentance? — Podcast Clip",
    youtubeId: "dFrVsn6G1io",
    badges: ["Producer", "Editor"],
    descriptionHtml: `<p>This was a clip I edited from a podcast recording I coordinated and recorded for North Central Church.</p>`,
  },
];
