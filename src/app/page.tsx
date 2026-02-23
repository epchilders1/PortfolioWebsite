import { api, HydrateClient } from "~/trpc/server";
import HeroSection from "~/app/pages/HeroSection/HeroSection";
import ProjectsSection from "~/app/pages/ProjectsSection/ProjectsSection";
import AboutSection from "~/app/pages/AboutSection/AboutSection";
import SkillsSection from "./pages/SkillsSection/SkillsSection";
import ContactSection from "./pages/ContactSection/ContactSection";
import type { BlogPost } from "~/app/types";

export default async function Home() {
  const homeInfo = await api.home.getAllInfo();
  return (
    <HydrateClient>
     <HeroSection/>
     <AboutSection/>
     <SkillsSection/>
     <ProjectsSection projects={homeInfo.projects}/>
      <ContactSection/>
    </HydrateClient>
  );
}
