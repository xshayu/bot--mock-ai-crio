export interface BaseMessage {
    text: string;
    timestamp: string; // DD/MM/YYYY_HH:mm:ss:SSS
};

export interface ModelMessage extends BaseMessage {
    by: 'model';
    liked: -1 | 0 | 1;
};

export interface UserMessage extends BaseMessage {
    by: 'user';
};

export type ChatMessage = ModelMessage | UserMessage;

export type Rating = 0 | 1 | 2 | 3 | 4 | 5;

export interface Review {
    rating?: Rating;
    feedback?: string;
};

export interface Conversation {
    review?: Review;
    title: string; // first message text
    id: string; // first message timestamp
    chat: ChatMessage[];
    finished: boolean;
};

export interface Prompt {
    id: number;
    question: string;
    response: string;
};