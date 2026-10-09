import SiteProvider from "@/components/SiteProvider";
import SiteBackground from "@/components/SiteBackground";
import SvgDefs from "@/components/SvgDefs";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import SocialRail from "@/components/SocialRail";
import FloatingActions from "@/components/FloatingActions";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getSite } from "@/lib/site-data";

// admin se badlav turant dikhe
export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ profile?: string }>;
}) {
  const sp = await searchParams;
  const s = await getSite(sp.profile);

  return (
    <SiteProvider value={s.ctx}>
      <SiteBackground />
      <SvgDefs />
      <CustomCursor />
      <main>
        <Navbar />
        <SocialRail />
        <Hero hero={s.hero} stats={s.stats} />
        {s.flags.about && <About />}
        {s.flags.experience && <Experience />}
        {s.flags.skills && <Skills />}
        {s.flags.projects && <Projects projects={s.projects} />}
        {s.flags.education && <Education />}
        {s.flags.certificates && <Certificates items={s.certificates} />}
        {s.flags.contact && <Contact />}
        <Footer />
      </main>
      <FloatingActions />
    </SiteProvider>
  );
}