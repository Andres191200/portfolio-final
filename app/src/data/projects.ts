// The four projects shown in "Selected work". Replace the placeholders here:
// the section reads only this array. Leave `image` empty to show the local
// placeholder, and `url` empty to render the action without a link.

export type Project = {
  id: string;
  name: string; 
  category: string;
  description: string;
  contributions: string[];
  technologies: string[];
  // Path under /public, e.g. "/projects-media/my-app/cover.webp"
  image?: string;
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
    "A mobile app for truck drivers that export/import products, to allow them report the status of their shipments.",
  device: "mobile",
  image: "/projects-media/sgi-mobile/sgi-mobile-1.gif",
  imageAlt: "SGI Mobile app walking a driver through the steps of a trip to Terminal 4",
};

export const projects: Project[] = [
  { id: "project-one", name: "SGI Mobile", ...project1 },
  { id: "project-two", name: "Project Two", ...placeholder },
  { id: "project-three", name: "Project Three", ...placeholder },
  { id: "project-four", name: "Project Four", ...placeholder },
];
