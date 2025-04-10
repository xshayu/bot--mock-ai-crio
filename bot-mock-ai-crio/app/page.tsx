import ChatInitiator from "@/components/chatInitiator";
import sampleData from '@/sampleData.json';
import type { Prompt } from "@/models";
const prompts = sampleData as Prompt[];

export default function Home() {

  const AiAvatarSrc = 'https://avatars.githubusercontent.com/u/95334503';

  return (
    <main className="page-height px-4 pb-4 flex flex-col items-center justify-end gap-4">
      <h1 className="text-2xl use-primary-font">Hi, How Can I Help You Today</h1>
      <img src={AiAvatarSrc} alt="AI Avatar" className="h-16 w-16 rounded-full object-cover shadow-md" />
      <ChatInitiator prompts={prompts} />
    </main>
  );
}
