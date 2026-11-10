// The four projects shown in "Selected work". Replace the placeholders here:
// the section reads only this array. Leave `images` empty to show the local
// placeholder, and `url` empty to render the action without a link.

export type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  successBadge?: string;
  infoBadge?: string;
  contributions: string[];
  technologies: string[];
  // Paths under /public, e.g. ["/projects-media/my-app/cover.webp"].
  // More than one image turns the preview into a slider.
  images?: string[];
  imageAlt: string;
  // "mobile" shows the image inside a phone frame instead of filling the preview
  device?: "desktop" | "mobile";
  url?: string;
};

const placeholder: Omit<Project, "id" | "name"> = {
  category: "",
  description: "A short description of the product and the problem it solves.",
  contributions: ["Figma", "Flutter", "NodeJS", "NATS", "Typescript"],
  technologies: [],
  imageAlt: "",
  url: "",
};

const project1: Omit<Project, "id" | "name"> = {
  ...placeholder,
  description:
    "A mobile app for truck drivers that export/import products, to allow them report the status of their shipments",
  successBadge:
    "This replaced the problem about signing physically the documents, and allowed the company to have a better control of the shipments, and automatized the whole process.",
  infoBadge:
    "I leaded the project from the UX/UI design to the development, distribution  of the mobile app, and the backend services that support it.",
  device: "mobile",
  images: ["/projects-media/sgi-mobile/sgi-mobile-1.gif"],
  imageAlt:
    "SGI Mobile app walking a driver through the steps of a trip to Terminal 4",
};

const project2: Omit<Project, "id" | "name"> = {
  ...placeholder,
  contributions: ["ReactJS", "Claude Design", "Typescript", "AI Skills"],
  description:
    "Access control system for a self-service laundromat. Customers scan a QR code at the entrance, sign up, and confirm their identity via email or SMS. Once verified, the backend authorizes entry and triggers the electronic door lock, with no staff required on site.",
  successBadge:
    "This allowed the laundromat to operate without staff, and the customers to have a better experience, with no need to wait for someone to open the door.",
  infoBadge: "I leaded the UX/UI design and the development of it, in Flutter",
  // The screenshots already show several phone screens, so they fill the preview
  device: "desktop",
  images: [
    "/projects-media/laverap/laverap-1.png",
    "/projects-media/laverap/laverap-2.png",
  ],
  imageAlt:
    "Laverap sign-up flow: entering the WhatsApp code, showing the QR access key and the door unlocked screen",
};

export const projects: Project[] = [
  { id: "project-one", name: "SGI Mobile", ...project1 },
  { id: "project-two", name: "Laverap Smart", ...project2 },
  { id: "project-three", name: "Project Three", ...placeholder },
  { id: "project-four", name: "Project Four", ...placeholder },
];
