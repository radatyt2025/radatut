import { AboutUs } from '@/components/shared/about-us';
import { ChatBot } from '@/components/shared/chat-bot';
import { Events } from '@/components/shared/events';
import { Hero } from '@/components/shared/hero';
import { Team } from '@/components/shared/team';

export default function Home() {
  return (
    <>
      <Hero />
      <AboutUs />
      <Team />
      <Events />
      <ChatBot />
    </>
  );
}
