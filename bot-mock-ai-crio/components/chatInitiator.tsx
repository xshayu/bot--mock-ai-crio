'use client';

import { useConvoStore } from '@/stores/useConvoStore';
import { useRouter } from 'next/navigation';
import { dayjs } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { DATE_FORMATS } from "@/models";
import type { Prompt } from '@/models';
import ChatForm from './chatForm';
import { LoaderCircle } from 'lucide-react';

interface ChatInitiatorProps {
    prompts: Prompt[];
};

export default function ChatInitiator({ prompts }: ChatInitiatorProps) {
    const [randomPrompts, setRandomPrompts] = useState<Prompt[]>([]);
    const createConvo = useConvoStore(state => state.createConvo);
    const router = useRouter();

    useEffect(() => { // Getting 4 random prompts from sampleData
        const randomSet = new Set<number>();
        while (randomSet.size < 4) {
            randomSet.add(Math.floor(prompts.length * Math.random()));
        };
        setRandomPrompts(Array.from(randomSet).map(index => prompts[index]));
    }, [prompts]);

    const handleInitiation = (text: string) => {
        if (!text || text.length == 0) return;

        const newConversation = createConvo({
            by: 'user',
            text,
            timestamp: dayjs().format(DATE_FORMATS.timestamp)
        });

        router.push(`/chat?id=${newConversation.id}`);
    };

    return (
            <>
            {
                !randomPrompts.length ?
                <LoaderCircle className="mx-auto my-6 animate-spin" />
                :
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {
                        randomPrompts.map(prompt =>
                            <button
                                key={prompt.id}
                                onClick={() => handleInitiation(prompt.question)}
                                className="rounded-lg shadow-sm bg-muted p-4 hover:shadow-md transition-shadow cursor-pointer">
                                <h2 className="font-medium mb-2">
                                    {prompt.question}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Get immediate (mock) AI generated response.
                                </p>
                            </button>
                        )
                    }
                </div>
            }
            <ChatForm onSubmit={handleInitiation} />
        </>
    )
}