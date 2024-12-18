export interface BaseMessage {
    text: string;
    timestamp: string; // dd/MM/yyyy_HH:mm:ss
};

export interface ModelMessage extends BaseMessage {
    by: 'model';
    liked: -1 | 0 | 1;
};

export interface UserMessage extends BaseMessage {
    by: 'user';
};

export type ChatMessage = ModelMessage | UserMessage;

export interface Review {
    rating?: 0 | 1 | 2 | 3 | 4 | 5;
    feedback?: string;
};

export interface Conversation {
    review?: Review;
    title: string; // first message text
    id: string; // first message timestamp
    chat: ChatMessage[]
};