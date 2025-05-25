import LandingPageComponent from '@/components/landing/LandingPage';
import { Analytics } from "@vercel/analytics/next"

export default function LandingPage() {
  return (
    <>
      <LandingPageComponent />
      <Analytics />
    </>
  );
}
