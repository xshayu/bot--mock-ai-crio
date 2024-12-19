export const DATE_FORMATS = {
    timestamp: 'DD/MM/YYYY_HH:mm:ss:SSS',
    display: 'D/M/YY h:mm a'
};

export const PAGE_LIMIT = 10;

export interface BaseMessage {
    text: string;
    timestamp: string; // DATE_FORMATS.timestamp
};

export interface ModelMessage extends BaseMessage {
    by: 'model';
    liked: -1 | 0 | 1;
};

export interface UserMessage extends BaseMessage {
    by: 'user';
};

export type ChatMessage = ModelMessage | UserMessage;

export type Rating = 0 | 1 | 2 | 3 | 4 | 5 | undefined;

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

export interface PaginatedResponse {
    data: Conversation[];
    metadata: {
        currPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }
};