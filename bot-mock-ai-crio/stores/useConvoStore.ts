import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Conversation, UserMessage, ChatMessage, Review, PaginatedResponse } from '@/models';
import { PAGE_LIMIT } from '@/models';

// Storing conversations in localStorage
// Creating helper functions for easy maintainability and ease of feature-iteration

interface ConvoStoreState {
    convos: Conversation[];
    getConvoId: (conversation: Conversation) => string;
    getAllConvos: (page?: number, rating?: number) => PaginatedResponse;
    getAllConvoIds: () => { id: string; title: string; }[];
    createConvo: (message: UserMessage) => Conversation;
    loadConvo: (id: string) => Conversation | undefined;
    finishConvo: (id: string, review?: Review, onSave?: () => void) => void;
    newMessage: (conversation: Conversation, message: ChatMessage) => Conversation;
    updateMessageLike: (conversationId: string, messageTimestamp: string, liked: -1 | 0 | 1) => void;
};

export const useConvoStore = create<ConvoStoreState>()(
    persist(
        (set, get) => ({
            convos: [],

            getConvoId: (conversation) => {
                return conversation.chat[0]!.timestamp;
            },

            getAllConvos: (page = 1, rating) => {
                let filteredConvos = get().convos;
                if (typeof rating == 'number' && !Number.isNaN(rating)) {
                    filteredConvos = filteredConvos.filter((conv) => conv.review?.rating && (conv.review.rating >= rating!));
                };
                
                const totalPages = Math.ceil(filteredConvos.length / PAGE_LIMIT);
                const currPage = Math.min(Math.max(1, page), totalPages);
                const startIdx = (currPage - 1) * PAGE_LIMIT;
                const endIdx = startIdx + PAGE_LIMIT;

                return {
                    data: filteredConvos.slice(startIdx, endIdx),
                    metadata: {
                        currPage,
                        totalPages,
                        hasNextPage: currPage < totalPages,
                        hasPreviousPage: currPage > 1
                    }
                }
            },

            getAllConvoIds: () => {
                return get().convos.map(({ id, title }) => ({ id, title }));
            },

            createConvo: (message) => {
                const { text: title, timestamp: id } = message;
                const newConversation = {
                    title,
                    id,
                    chat: [message],
                    finished: false
                } as Conversation;

                set((state) => ({
                    convos: [...state.convos, newConversation]
                }));

                return newConversation;
            },

            loadConvo: (id) => {
                return get().convos.find((convo) => convo.id === id);
            },

            finishConvo: (id, review, onSave) => {
                set((state) => {
                    const convoIndex = state.convos.findIndex((convo) => convo.id === id);
                    if (convoIndex === -1) return state;

                    const updatedConvos = [...state.convos];
                    updatedConvos[convoIndex] = {
                        ...updatedConvos[convoIndex],
                        review: review || updatedConvos[convoIndex].review,
                        finished: true
                    };

                    if (onSave) {
                        setTimeout(onSave, 0);
                    }

                    return { convos: updatedConvos };
                });
            },

            newMessage: (conversation, message) => {

                const updatedConversation = {
                    ...conversation,
                    chat: [...conversation.chat, message]
                };

                set((state) => ({
                    convos: state.convos.map((convo) =>
                        convo.id === conversation.id ? updatedConversation : convo
                    )
                }));

                return updatedConversation;
            },

            updateMessageLike: (convoId, messageTimestamp, liked) => {
                set((state) => {
                    const convoIndex = state.convos.findIndex((convo) => convo.id === convoId);
                    if (convoIndex === -1) return state;

                    const updatedConvos = [...state.convos];
                    const convo = updatedConvos[convoIndex];
                    
                    const updatedChat = convo.chat.map((msg) => {
                        if (msg.timestamp === messageTimestamp && msg.by === 'model') {
                            return { ...msg, liked };
                        }
                        return msg;
                    });

                    updatedConvos[convoIndex] = { ...convo, chat: updatedChat };
                    return { convos: updatedConvos };
                });
            },

        }),
        {
            name: 'conversations',
            storage: createJSONStorage(() => localStorage)
        }
    ),
);

export function useConvos() { // this seperation was necessary to avoid infinite rerenders
    const convos = useConvoStore(state => state.convos);
    const convoIds = useConvoStore(state => state.getAllConvoIds);
    const loadConvo = useConvoStore(state => state.loadConvo);
    const getAllConvos = useConvoStore(state => state.getAllConvos);

    return {
        convoIds,
        convos,
        loadConvo,
        getAllConvos
    }
};