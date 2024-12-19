'use client';

import { useConvoStore, useConvos } from "@/stores/useConvoStore";
import { ThumbsUp, ThumbsDown, Star, LoaderCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, memo, useCallback, useMemo, useRef } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

function MessageBubble({
    message,
    onLike
}: {
    message: ChatMessage;
    onLike?: (liked: -1 | 0 | 1) => void;
}) {
    console.log('message bubble rendered');
    const isUser = message.by === 'user';
    const avatar = isUser ?
        'https://avatars.githubusercontent.com/u/45749740?s=400&v=4'
        : 'https://s3-alpha-sig.figma.com/img/4b1c/47d6/93bc8af758e2de31a7de8493b52750af?Expires=1735516800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ENA~YSaf9THN5paaRkbIJjELW2iNRsBCFvM-id9EjLB-Fs1pUHNkN8RIq8zGwKNvhzTv4e5rR1zPKlfdODJwV~bRvYA1Aze26PIlbPAHL9MV9e~sc0igwzro-nv1NkUQBw0ST778qQmxh9i3iVvnpWjJX69wj3nRsHY~03aWo6K37hOU~ecwtfU7MUgHOxVGkdXl9W~im7LPOZzkU4nGS0hsmLwB-FFPStf887iGCx6cfWZU2R5FknqYqZZkkVhr12pdzT5-6lvPGKmY4U0XRZGtGKxaQGxzw2Bhrhmua7QalHaTv70G9yMCFG--23DrJmJ0Vqi8hUrDzxK88FGMnw__';
    

    return (
        <div
            className={`p-4 rounded-lg max-w-[80%] mx-auto my-4 group shadow-md ${isUser ? 'bg-secondary text-secondary-foreground' : 'bg-[var(--theme)] text-primary dark:text-secondary'}`}
        >
            <div className={`border-b-[0.5px] pb-6 flex gap-4 ${isUser ? 'border-b-muted-foreground' : 'border-b-primary dark:border-b-secondary'}`}>
                <img src={avatar} className="h-8 w-8 rounded-full object-cover shadow-sm" />
                <div>
                    <h2 className="font-bold">{isUser ? 'You' : 'Bot AI'}</h2>
                    <p>{message.text}</p>
                </div>
            </div>
            <div className={`pt-2 flex items-center justify-between text-xs ${isUser ? 'text-muted-foreground' : ''}`}>
                <span>
                    {dayjs(message.timestamp, DATE_FORMATS.timestamp).format(DATE_FORMATS.display)}
                </span>
                {
                    !isUser && onLike ?
                    <span className={`gap-3 ${message.liked == 0 ? 'group-hover:inline-flex hidden' : 'inline-flex'}`}>
                        <ThumbsUp
                            onClick={() => onLike(message.liked < 1 ? 1 : 0)}
                            className={`h-3 w-3 ${message.liked === 1 ? 'text-green-500' : ''}`}
                            role="button"
                        />
                        <ThumbsDown
                            onClick={() => onLike(message.liked > -1 ? -1 : 0)}
                            className={`h-3 w-3 ${message.liked === -1 ? 'text-red-500' : ''}`}
                            role="button"
                        />
                    </span>
                    :
                    <></>
                }
            </div>
        </div>
    );
}

function RatingDialog({ 
    isOpen, 
    onClose,
    onSubmit 
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: Rating, feedback: string) => void;
}) {
    const [rating, setRating] = useState<Rating>();
    const [feedback, setFeedback] = useState('');
    console.log('rating dialog rendered');
    
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Rate this conversation</AlertDialogTitle>
                    <AlertDialogDescription>
                        How would you rate your experience?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                <div className="flex justify-center gap-2 my-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <Button
                            key={value}
                            variant="ghost"
                            size="sm"
                            onClick={() => setRating(value as Rating)}
                        >
                            <Star className={`h-6 w-6 ${rating && rating >= value ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                    ))}
                </div>
                
                <Textarea
                    placeholder="Any additional feedback?"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[100px] resize-none"
                />
                
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={() => onSubmit(rating, feedback)}
                        disabled={rating === 0}
                    >
                        Submit
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default function ChatPage() {
    const { loadConvo } = useConvos();
    const { newMessage, updateMessageLike, finishConvo } = useConvoStore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [showRating, setShowRating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const messageContainerRef = useRef<HTMLDivElement>(null);

    console.log('Chat page rendered');

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