import ChatInitiator from "@/components/chatInitiator";
import sampleData from '@/sampleData.json';
import type { Prompt } from "@/models";
const prompts = sampleData as Prompt[];


export default function Home() {


  const AiAvatarSrc = 'https://s3-alpha-sig.figma.com/img/4b1c/47d6/93bc8af758e2de31a7de8493b52750af?Expires=1735516800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ENA~YSaf9THN5paaRkbIJjELW2iNRsBCFvM-id9EjLB-Fs1pUHNkN8RIq8zGwKNvhzTv4e5rR1zPKlfdODJwV~bRvYA1Aze26PIlbPAHL9MV9e~sc0igwzro-nv1NkUQBw0ST778qQmxh9i3iVvnpWjJX69wj3nRsHY~03aWo6K37hOU~ecwtfU7MUgHOxVGkdXl9W~im7LPOZzkU4nGS0hsmLwB-FFPStf887iGCx6cfWZU2R5FknqYqZZkkVhr12pdzT5-6lvPGKmY4U0XRZGtGKxaQGxzw2Bhrhmua7QalHaTv70G9yMCFG--23DrJmJ0Vqi8hUrDzxK88FGMnw__';

  return (
    <main className="page-height px-4 pb-4 flex flex-col items-center justify-end gap-4">
      <h1 className="text-2xl use-primary-font">Hi, How Can I Help You Today</h1>
      <img src={AiAvatarSrc} alt="AI Avatar" className="h-16 w-16 rounded-full object-cover shadow-md" />
      <ChatInitiator prompts={prompts} />
    </main>
  );
}
