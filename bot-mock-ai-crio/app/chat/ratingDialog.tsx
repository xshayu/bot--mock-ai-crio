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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from 'lucide-react';
import { useState } from 'react';
import type { Rating } from "@/models";

export function RatingDialog({ 
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