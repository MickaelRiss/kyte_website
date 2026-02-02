import GridBackground from "./components/GridBackground";
import DotBackground from "./components/DotBackground";
import HeroSection from "./components/HeroSection";
import ProblemSection from "./components/ProblemSection";
import SolutionSection from "./components/SolutionSection";

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
      </div>

      {/* Demo */}
      {/* Subscribe */}
      {/* Download */}
      {/* FAQ */}
      {/* Footer */}
      
    </div>
  );
}
