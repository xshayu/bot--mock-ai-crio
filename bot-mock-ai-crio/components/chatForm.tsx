'use client';

import type { KeyboardEvent, FormEventHandler } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { Button } from './ui/button';
import { SendHorizonal, LoaderCircle } from 'lucide-react';

interface ChatFormProps {
    onSubmit: (text: string) => void;
    disabled?: boolean;
}

export default function ChatForm({ disabled = false, onSubmit = (text: string) => { console.log(text); return } }: ChatFormProps) {

    const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get('query') as string;
        if (query?.length) {
            onSubmit(query);
            e.currentTarget.value = '';
        }
    };

    const handleTextAreaEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key == 'Enter') {
            const text = e.currentTarget.value.trim();
            if (text && text.length) {
                e.preventDefault();
                onSubmit(text);
                e.currentTarget.value = '';
            }
        }
    };

    return (
        <form className="p-2 flex gap-2 w-full" onSubmit={handleFormSubmit}>
            <Textarea
                onKeyDown={handleTextAreaEnter}
                name="query"
                placeholder="Enter your question"
                disabled={disabled}
                className="resize-none bg-secondary"
                required
            />
            <Button size="icon" title="Ask query" type="submit" disabled={disabled}>
                {disabled ?
                    <LoaderCircle className="animate-spin" />
                    :
                    <SendHorizonal /> 
                }
            </Button>
        </form>
    )
}