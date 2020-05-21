export default interface ITutorial {
    _id?: string;
    name: string;
    html: string;
    markdown: string;
    category?: string;
    authorId?: string;
    authorName?: string;
    isAvailable?: boolean;
}
