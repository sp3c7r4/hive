import AnimatedGrid from "@/components/AnimatedGrid";
import AnimatedHero from "@/components/AnimatedHero";
import BalancedBox, { type GridImages } from "@/components/BalancedBox";
import HeroSection from "@/components/HeroSection";
import LandingPageHeader from "@/components/LandingPageHeader";
import { searchPhotos } from "@/lib/pexels";

/* ------------------------------------------------------------------ */
/*  Fallback placeholders when Pexels is unavailable                  */
/* ------------------------------------------------------------------ */
const FALLBACKS: GridImages = {
  webDesign: "https://picsum.photos/seed/webdesign/400/600",
  motionDesign: "https://picsum.photos/seed/motion/400/500",
  digitalMarketing: "https://picsum.photos/seed/marketing/400/600",
  designSystem: "https://picsum.photos/seed/designsys/400/500",
  webDevelopment: "https://picsum.photos/seed/webdev/400/600",
};

/* ------------------------------------------------------------------ */
/*  Fetch a single portrait image for a search query                  */
/* ------------------------------------------------------------------ */
async function fetchPortrait(query: string): Promise<string | null> {
  try {
    const photos = await searchPhotos(query, {
      perPage: 1,
      orientation: "portrait",
    });
    if (photos.length > 0) return photos[0].src.portrait;
    return null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
export default async function Home() {
  const [webDesign, motionDesign, digitalMarketing, designSystem, webDevelopment] =
    await Promise.all([
      fetchPortrait("professional web designer portrait smiling"),
      fetchPortrait("motion designer portrait professional"),
      fetchPortrait("digital marketer professional portrait"),
      fetchPortrait("graphic designer professional portrait"),
      fetchPortrait("woman web developer portrait smiling professional"),
    ]);

  const images: GridImages = {
    webDesign: webDesign ?? FALLBACKS.webDesign,
    motionDesign: motionDesign ?? FALLBACKS.motionDesign,
    digitalMarketing: digitalMarketing ?? FALLBACKS.digitalMarketing,
    designSystem: designSystem ?? FALLBACKS.designSystem,
    webDevelopment: webDevelopment ?? FALLBACKS.webDevelopment,
  };

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black overflow-x-hidden">
      <LandingPageHeader />
      <AnimatedHero>
        <HeroSection />
      </AnimatedHero>
      <AnimatedGrid>
        <BalancedBox images={images} />
      </AnimatedGrid>
    </div>
  );
}
