import GridBackground from "./components/GridBackground";
import DotBackground from "./components/DotBackground";
import HeroSection from "./components/HeroSection";
import ProblemSection from "./components/ProblemSection";
import SolutionSection from "./components/SolutionSection";
import Demo from "./components/Demo";
import SubscriptionPlan from "./components/SubscriptionPlan";

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


      {/* Subscribe */}
      {/* Download */}
      {/* FAQ */}
      {/* Footer */}
      
    </div>
  );
}
