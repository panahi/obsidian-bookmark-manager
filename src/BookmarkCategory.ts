export enum BookmarkCategory {
    /**
     * Default, needs review
     */
    uncategorized,

    /**
     * A typical blog post or published article (e.g. New York Times)
     */
    article,

    /**
     * A link to a document (PDF, docx, etc)
     */
    document,

    /**
     * A link to a forum or other discussion thread, e.g. Hacker News, Reddit, etc
     */
    discussion,

    /**
     * A link to a list or ranking of some kind
     */
    list,

    /**
     * A link to a podcast or podcast episode
     */
    podcast,

    /**
     * A website belonging to a product (e.g. obsidian.md, clickup.com)
     */
    product,

    /**
     * A recipe :)
     */
    recipe,

    /**
     * A link to a reference document (e.g. API documentation)
     */
    reference,

    /**
     * A link to a review for something
     */
    review,

    /**
     * A tutorial or how-to
     */
    tutorial,

    /**
     * A link to a video
     */
    video
}