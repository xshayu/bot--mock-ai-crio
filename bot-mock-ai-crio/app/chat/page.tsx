'use client';

import { useConvoStore } from "@/stores/useConvoStore";
import sampleData from '@/sampleData.json';
import type { Prompt } from "@/models";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
const prompts = sampleData as Prompt[];


export default function ChatPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const id = searchParams.get('id');
    if (!id || id.length == 0) {
        router.push('/');
    };

    const conversation = useConvoStore(state => state.loadConvo(id!));

    return (
         <div>
         {JSON.stringify(conversation)}<br />
         {JSON.stringify(prompts.find(p => p.question == conversation?.chat[0].text))}
         </div>
    )
}