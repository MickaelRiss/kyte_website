import GridBackground from "./components/GridBackground";
import DotBackground from "./components/DotBackground";
import HeroSection from "./components/sections/HeroSection";
import ProblemSection from "./components/sections/ProblemSection";
import SolutionSection from "./components/sections/SolutionSection";
import Demo from "./components/sections/DemoSection";
import SubscriptionPlan from "./components/sections/SubscriptionSection";
import DownloadSection from "./components/sections/DownloadSection";
import FaqSection from "./components/sections/FaqSection";

export default function Home() {
  return (
    <div>
      <div>
        <HeroSection />
        <DotBackground />
      </div>

      <div className="relative">
        <ProblemSection />
        <SolutionSection />
        <GridBackground />
        <Demo />
      </div>
      <SubscriptionPlan />
      <div className="relative">
        <DownloadSection />
        <FaqSection />
        <DotBackground />
      </div>
      {/* Footer */}
    </div>
  );
}
