'use client';

import { useConvoStore, useConvos } from "@/stores/useConvoStore";
import { ThumbsUp, ThumbsDown, Star, SendHorizonal, LoaderCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
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
import dayjs from "dayjs";
import ChatForm from "@/components/chatForm";
 
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
    const [showActions, setShowActions] = useState(false);
    
    const isUser = message.by === 'user';
    const bubbleClass = isUser ? 'bg-primary text-primary-foreground' : 'bg-muted';

    return (
        <div
            className="relative p-4 rounded-lg max-w-[80%] mx-auto"
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className={`${bubbleClass} p-4 rounded-lg`}>
                {message.text}
            </div>
            {!isUser && showActions && onLike && (
                <div className="absolute right-0 top-0 -mt-8 flex gap-2 bg-background p-2 rounded-lg shadow-lg">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onLike(1)}
                        className={message.liked === 1 ? 'text-green-500' : ''}
                    >
                        <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onLike(-1)}
                        className={message.liked === -1 ? 'text-red-500' : ''}
                    >
                        <ThumbsDown className="h-4 w-4" />
                    </Button>
                </div>
            )}
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
    const [rating, setRating] = useState<Rating>(0);
    const [feedback, setFeedback] = useState('');
    
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
                            <Star className={`h-6 w-6 ${rating >= value ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                    ))}
                </div>
                
                <Textarea
                    placeholder="Any additional feedback?"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[100px]"
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

    const id = searchParams.get('id');
    if (!id || id.length == 0) { // If id isn't present, redirect to new chat
        router.push('/');
    };

    const conversation = loadConvo(id!);
    if (!conversation) {
        router.push('/');
        return null;
    };

    useEffect(() => { // Initial response by AI if this is a fresh chat
        if (conversation.chat.length === 1 && conversation.chat[0].by === 'user') {
            const userQuestion = conversation.chat[0].text;
            const response = responseOnNewQuestion(userQuestion);

            const modelMessage: ChatMessage = {
                by: 'model',
                text: response,
                timestamp: dayjs().format('D/MM/YYYY_HH:mm:ss:SSS'),
                liked: 0
            };
            
            newMessage(conversation, modelMessage);
        }
    }, [conversation.id]);

    const handleNewMessage = (text: string) => {
        const userMessage: ChatMessage = {
            by: 'user',
            text,
            timestamp: dayjs().format('D/MM/YYYY_HH:mm:ss:SSS')
        };

        let updatedConvo = newMessage(conversation, userMessage);

        setTimeout(() => { // Mocking an AI response, later could make it look streamed like in chatGPT
            const modelMessage: ChatMessage = {
                by: 'model',
                text: responseOnNewQuestion(text),
                timestamp: dayjs().add(2, 'second').format('D/MM/YYYY_HH:mm:ss:SSS'),
                liked: 0
            };
            newMessage(updatedConvo, modelMessage);
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
        <main className="container page-height px-4 pb-1 flex flex-col justify-end">
            <div className="flex-1 overflow-y-auto spacing-y-4">
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
            <div className="sticky bottom-0 bg-background p-4 border-t">
                {
                    conversation.finished ? 
                    <>
                        <div className="h-6 overflow-y-auto">
                            {conversation.review?.feedback ?
                                <p>{conversation.review.feedback}</p>
                                :
                                <p className="text-center">No feedback.</p>
                            }
                        </div>
                        <div className="p-4 flex items-center justify-center">
                            {conversation.review?.rating ?
                                Array.from({length: conversation.review.rating}).map((_, key) =>
                                    <Star key={key} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                                )                                    
                                :
                                <span>No rating.</span>
                            }
                        </div>
                    </>
                    :
                    <>
                        <ChatForm onSubmit={handleNewMessage} />
                        <button onClick={() => setShowRating(true)} className="text-xs py-2 underline text-center hover:brightness-125 transition-all">
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