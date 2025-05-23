import { DATE_FORMATS } from "@/models";
import { dayjs } from '@/lib/utils';
import type { ChatMessage } from '@/models';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { memo } from 'react';

const MessageBubble = memo(({
    message,
    onLike
}: {
    message: ChatMessage;
    onLike?: (liked: -1 | 0 | 1) => void;
}) => {
    const isUser = message.by === 'user';
    const avatar = isUser ?
        'https://avatars.githubusercontent.com/u/45749740?s=400&v=4'
        : 'https://avatars.githubusercontent.com/u/95334503';
    

    return (
        <div
            className={`p-2 md:p-4 rounded-lg text-sm md:text-base md:max-w-[80%] mx-auto my-4 group shadow-md ${isUser ? 'bg-secondary text-secondary-foreground' : 'bg-[var(--theme)] text-primary dark:text-secondary'}`}
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
}, (prevProps, nextProps) => {
    if ('liked' in prevProps.message && 'liked' in nextProps.message) { // checking if it's model message
        return prevProps.message.liked === nextProps.message.liked 
            && prevProps.message.text === nextProps.message.text;
    }
    return prevProps.message.text === nextProps.message.text;
});

MessageBubble.displayName = 'MessageBubbe';

export default MessageBubble;