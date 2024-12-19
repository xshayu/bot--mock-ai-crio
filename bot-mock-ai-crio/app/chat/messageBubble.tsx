import { DATE_FORMATS } from "@/models";
import { dayjs } from '@/lib/utils';
import type { ChatMessage } from '@/models';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export function MessageBubble({
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