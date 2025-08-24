export interface LentBook {
    id: number;
    title: string;
    author: string;
    coverUrl?: string;
    // borrower: string;
    lentDate: string;
    returnDate?: string;
}
