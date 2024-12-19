'use client';
import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { useConvos } from '@/stores/useConvoStore';
import { Star, ChevronLeft, ChevronRight, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import type { Rating, PaginatedResponse } from '@/models';
import { DATE_FORMATS } from '@/models';
import { dayjs } from '@/lib/utils';

export default function History() {
    const [selectedRating, setSelectedRating] = useState<Rating>();
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedConvos, setPaginatedConvos] = useState<PaginatedResponse>();
    const { getAllConvos } = useConvos();

    useEffect(() => {
        const result = getAllConvos(currentPage, selectedRating);
        setPaginatedConvos(result);
    }, [currentPage, selectedRating, getAllConvos]);

    const handleRatingChange = (value: string) => {
        setSelectedRating(value ? Number(value) as Rating : undefined);
        setCurrentPage(1); // we'll reset to first page because different rating
    };

    return (
        <main className="page-height p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">History</h1>
                <Select value={selectedRating ? selectedRating.toString() : 'undefined'} onValueChange={handleRatingChange}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by rating" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="undefined">All ratings</SelectItem>
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <SelectItem
                                value={rating.toString()}
                                key={rating}
                                className="gap-1 flex flex-row items-center"
                            >
                                {`${rating} ${rating === 1 ? 'star' : 'stars'} or higher`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedConvos?.data.map((convo) => (
                        <TableRow key={convo.id}>
                            <TableCell>
                                {dayjs(convo.id, DATE_FORMATS.timestamp).format(DATE_FORMATS.display)}
                            </TableCell>
                            <TableCell>
                                <Link href={`/chat?id=${convo.id}`} className="hover:underline flex items-center gap-1 truncate">
                                    <LinkIcon className="h-3 w-3" /> {convo.title}
                                </Link>
                            </TableCell>
                            <TableCell className="truncate">
                                {convo.review?.feedback?.length ? convo.review.feedback : 'None'}
                            </TableCell>
                            <TableCell>
                                {convo.review?.rating ? (
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span>{convo.review.rating}</span>
                                    </div>
                                ) : (
                                    "-"
                                )}
                            </TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                    convo.finished 
                                        ? "bg-green-100 text-green-800" 
                                        : "bg-blue-100 text-blue-800"
                                }`}>
                                    {convo.finished ? "Completed" : "Active"}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                {(!paginatedConvos?.data.length) && (
                    <TableCaption>No conversations found.</TableCaption>
                )}
            </Table>
            {paginatedConvos && paginatedConvos.metadata.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-600">
                        Page {paginatedConvos.metadata.currPage} of {paginatedConvos.metadata.totalPages}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            disabled={!paginatedConvos.metadata.hasPreviousPage}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={!paginatedConvos.metadata.hasNextPage}
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </main>
    )
}