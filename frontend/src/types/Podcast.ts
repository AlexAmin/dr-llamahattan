export interface Podcast {
    text: PodcastText[];
    chapters: PodcastChapter[];
    summary: string;
    duration: number;
    topic: string;
    userId: string;
    createdAt: Date;
}


export interface PodcastText {
    type: "directions" | "text";
    speaker: string;
    text: string;
}

export interface PodcastChapter {
    index: number,
    title: string
    description: string
}

export interface PodcastSummary{
    id: string,
    summary: string
}