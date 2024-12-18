import ChatInitiator from "@/components/chatInitiator";
import sampleData from '@/sampleData.json';
import type { Prompt } from "@/models";
const prompts = sampleData as Prompt[];


export default function Home() {

  return (
    <>
      Hi
    {/* <ChatInitiator prompts={prompts} /> */}
    </>
  );
}
