'use client';

import { useConvoStore } from '@/stores/useConvoStore';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { useState, useEffect, FormEventHandler } from 'react';
import type { Prompt } from '@/models';
import { Textarea } from "@/components/ui/textarea"
import { Button } from './ui/button';
import { SendHorizonal, LoaderCircle } from 'lucide-react';
import type { KeyboardEvent } from 'react';

interface ChatInitiatorProps {
    prompts: Prompt[];
};

export default function ChatInitiator({ prompts }: ChatInitiatorProps) {
    const [randomPrompts, setRandomPrompts] = useState<Prompt[]>([]);
    const createChat = useConvoStore(state => state.createConvo);
    const router = useRouter();

    useEffect(() => {
        const randomSet = new Set<number>();
        while (randomSet.size < 4) {
            randomSet.add(Math.floor(prompts.length * Math.random()));
        };
        setRandomPrompts(Array.from(randomSet).map(index => prompts[index]));
    }, [prompts]);

    const handleInitiation = (text: string) => {
        if (!text || text.length == 0) return;

        const newConversation = createChat({
            by: 'user',
            text,
            timestamp: dayjs().format('DD/MM/YYYY_HH:mm:ss')
        });

        router.push(`/chat?id=${newConversation.id}`);
    };

    const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get('query') as string;
        if (query?.length) handleInitiation(query);
    };

    const handleTextAreaEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key == 'Enter') {
            const text = e.currentTarget.value.trim();
            if (text && text.length) {
                e.preventDefault();
                handleInitiation(text);
            }
        }
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
                                className="rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer">
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
            <form className="p-2 flex gap-2 w-full" onSubmit={handleFormSubmit}>
                <Textarea onKeyDown={handleTextAreaEnter} name="query" placeholder="Enter your question" className="resize-none" required />
                <Button title="Ask query" type="submit">
                    <SendHorizonal />
                </Button>
            </form>
        </>
    )
}