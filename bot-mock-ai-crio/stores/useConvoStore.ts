import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Conversation, UserMessage, ChatMessage, Review } from '@/models';

export const PAGE_LIMIT = 10;

interface ConvoStoreState {
    convos: Conversation[];
    // helper functions
    getConvoId: (conversation: Conversation) => string;
    getAllConvos: (page?: number, rating?: number) => Conversation[];
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
                const filteredConvos = rating ? get().convos : get().convos.filter((conv) => conv.review?.rating && (conv.review.rating >= rating!));
                return filteredConvos.slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT);
            },

            createConvo: (message) => {
                const { text: title,timestamp: id } = message;
                const newConversation = {
                    title,
                    id,
                    chat: [message]
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
                        review: review || updatedConvos[convoIndex].review
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