'use client';

import { useConvoStore } from '@/stores/useConvoStore';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import type { Prompt } from '@/models';

interface ChatInitiatorProps {
    prompts: Prompt[];
};

export default function ChatInitiator({ prompts }: ChatInitiatorProps) {
    const createChat = useConvoStore(state => state.createConvo);
    const router = useRouter();

    const AiAvatarSrc = 'https://s3-alpha-sig.figma.com/img/4b1c/47d6/93bc8af758e2de31a7de8493b52750af?Expires=1735516800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ENA~YSaf9THN5paaRkbIJjELW2iNRsBCFvM-id9EjLB-Fs1pUHNkN8RIq8zGwKNvhzTv4e5rR1zPKlfdODJwV~bRvYA1Aze26PIlbPAHL9MV9e~sc0igwzro-nv1NkUQBw0ST778qQmxh9i3iVvnpWjJX69wj3nRsHY~03aWo6K37hOU~ecwtfU7MUgHOxVGkdXl9W~im7LPOZzkU4nGS0hsmLwB-FFPStf887iGCx6cfWZU2R5FknqYqZZkkVhr12pdzT5-6lvPGKmY4U0XRZGtGKxaQGxzw2Bhrhmua7QalHaTv70G9yMCFG--23DrJmJ0Vqi8hUrDzxK88FGMnw__';
    
    const randomPrompts = useMemo(() => {
        const randomSet = new Set<number>();
        while (randomSet.size < 4) {
            randomSet.add(Math.floor(prompts.length * Math.random()));
        }

        console.log({randomSet});

        return Array.from(randomSet).map(index => prompts[index]);
    }, [prompts]);

    const handleInitiation = useCallback((prompt: Prompt) => {
        const newConversation = createChat({
            by: 'user',
            text: prompt.question,
            timestamp: dayjs().format('DD/MM/YYYY_HH:mm:ss')
        });

        router.push(`/chat?id=${newConversation.id}`);
    }, [createChat, router]);

    return (
        <div className="min-h-screen px-4 pt-[20vh] pb-4 flex flex-col items-center justify-end">
            <h1 className="text-2xl use-primary-font">Hi, How Can I Help You Today</h1>
            <img src={AiAvatarSrc} alt="AI Avatar" className="h-16 w-16 rounded-full object-cover" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {
                    randomPrompts.map(prompt =>
                        <button
                            key={prompt.id}
                            onClick={() => handleInitiation(prompt)}
                            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                            <h2 className="text-lg font-medium mb-2">
                                {prompt.question}
                            </h2>
                            <p className="text-sm text-gray-500">
                                Get immediate (mock) AI generated response.
                            </p>
                        </button>
                    )
                }
            </div>
        </div>
    )
}