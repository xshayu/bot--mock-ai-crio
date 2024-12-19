'use client';

import RatingDialog from "./ratingDialog";
import MessageBubble from "./messageBubble";
import { useConvoStore, useConvos } from "@/stores/useConvoStore";
import { Star, LoaderCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from 'react';
import { dayjs } from '@/lib/utils';
import ChatForm from "@/components/chatForm";
import { DATE_FORMATS } from "@/models";
 
import sampleData from '@/sampleData.json';
import type { Prompt, ChatMessage, Rating } from "@/models";
const prompts = [
    { id: 999, question: 'Hi', response: 'Hello there, how can I help you?' },
    { id: 9999, question: 'Hello', response: 'Hi there, how can I help you?' },
    { id: 99999, question: 'How are you', response: 'Hi, as a (mock) AI model, I have no idea.' },
    ...sampleData
] as Prompt[];

const responseOnNewQuestion = (userQuery: string) => {
    const matchingPrompt = prompts.find(p => p.question.toLowerCase() === userQuery.toLowerCase());
    return matchingPrompt?.response || "As a (mock) AI model, I cannot answer that.";
};

export default function ChatPage() {
    const { loadConvo } = useConvos();
    const { newMessage, updateMessageLike, finishConvo } = useConvoStore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [showRating, setShowRating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const messageContainerRef = useRef<HTMLDivElement>(null);

    const id = searchParams.get('id');
    const conversation = id ? loadConvo(id!) : null;

    const scrollToBottom = useCallback((behavior: 'auto' | 'smooth' = 'auto') => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTo({ top: messageContainerRef.current.scrollHeight, behavior })
        }
    }, [])

    useEffect(() => {
        if (!id || id.length === 0 || !conversation) {
            router.push('/');
            return;
        } else if (isLoading) { // So there's no flash of loading if fast-loads
            setTimeout(() => {
                setIsLoading(false);
                setTimeout(scrollToBottom, 100);
            }, 100);
    
        }

    }, [id, conversation, router]);

    useEffect(() => { // Initial response by AI if this is a fresh chat
        if (!isLoading && !conversation) {
            router.push('/');
            return;
        }

        if (conversation && conversation.chat.length === 1 && conversation.chat[0].by === 'user') {
            const userQuestion = conversation.chat[0].text;
            const response = responseOnNewQuestion(userQuestion);

            const modelMessage: ChatMessage = {
                by: 'model',
                text: response,
                timestamp: dayjs().format(DATE_FORMATS.timestamp),
                liked: 0
            };
            
            newMessage(conversation, modelMessage);
        }
    }, [conversation, newMessage]);

    if (isLoading || !conversation) {
        return (
            <main className="page-height flex items-center justify-center">
                <LoaderCircle className="animate-spin" />
            </main>
        );
    }

    const handleNewMessage = (text: string) => {
        const userMessage: ChatMessage = {
            by: 'user',
            text,
            timestamp: dayjs().format(DATE_FORMATS.timestamp)
        };

        const updatedConvo = newMessage(conversation, userMessage);
        setTimeout(() => scrollToBottom('smooth'), 100);

        setTimeout(() => { // Mocking an AI response, later could make it look streamed like in chatGPT
            const modelMessage: ChatMessage = {
                by: 'model',
                text: responseOnNewQuestion(text),
                timestamp: dayjs().format(DATE_FORMATS.timestamp),
                liked: 0
            };
            newMessage(updatedConvo, modelMessage);
            setTimeout(() => scrollToBottom('smooth'), 100);
        }, 1000);

    }

    const handleLike = (messageTimestamp: string, liked: -1 | 0 | 1) => {
        updateMessageLike(conversation.id, messageTimestamp, liked);
    };

    const handleRatingSubmit = (rating: Rating | undefined, feedback: string) => {
        finishConvo(conversation.id, { rating, feedback }, () => {
            router.push('/history');
        });
    };

    return (
        <main className="container page-height px-4 pb-1 flex flex-col justify-end overflow-hidden">
            <div className="flex-1 overflow-y-auto spacing-y-4" ref={messageContainerRef}>
                {conversation.chat.map((message) => (
                    <MessageBubble
                        key={message.timestamp}
                        message={message}
                        onLike={message.by === 'model' ? 
                            (liked) => handleLike(message.timestamp, liked) : 
                            undefined}
                    />
                ))}
            </div>
            <div className="md:px-4 py-2 border-t border-muted-foreground">
                {
                    conversation.finished ? 
                    <>
                        <div className="overflow-y-auto text-sm">
                            <h2 className="font-semibold">Review</h2>
                            {conversation.review?.feedback ?
                                <p>{conversation.review.feedback}</p>
                                :
                                <p className="text-center">No feedback.</p>
                            }
                        </div>
                        <div className="flex items-center gap-1 pt-1">
                            {conversation.review?.rating ?
                                Array.from({length: conversation.review.rating}).map((_, key) =>
                                    <Star key={key} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                )                                    
                                :
                                <span>No rating.</span>
                            }
                        </div>
                    </>
                    :
                    <>
                        <ChatForm onSubmit={handleNewMessage} />
                        <button onClick={() => setShowRating(true)} className="text-xs w-full underline text-center hover:brightness-125 transition-all">
                            End conversation and submit feedback.
                        </button>
                    </>
                }
            </div>

            <RatingDialog
                isOpen={showRating}
                onClose={() => setShowRating(false)}
                onSubmit={handleRatingSubmit}
            />
        </main>
    )
}