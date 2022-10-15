import { extract, ArticleData } from 'article-parser';
import { BookmarkCategory } from './BookmarkCategory';
import { Notice } from 'obsidian';
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { DateTime } from "luxon";
import * as rp from 'request-promise-native';

type Metadata = {
    title?: string
    domain?: string
    author?: string
    publicationDate?: string
    description?: string
    markdownContent?: string
    image?: string
    links?: string[]
    canonicalUrl?: string
    contentType?: string
}

/**
 * TODO make user-agent configurable?
 */
export default class Bookmark {
    private url: string;
    private category: BookmarkCategory;
    private creationDate: DateTime;
    private hasError: boolean;
    private metadata: Metadata;

    constructor(url: string, category?: BookmarkCategory) {
        this.url = url;
        this.category = category ?? BookmarkCategory.uncategorized;
        this.metadata = {};
        this.creationDate = DateTime.now();
        this.hasError = false;
    }

    public getTitle(): string {
        return this.metadata.title ?? this.url;
    }

    private sanitizeDomain(): string {
        return this.metadata.domain ? this.metadata.domain.replace(/[^a-zA-Z0-9 _-]/g, '_') : "";
    }

    public async loadContent(): Promise<any> {
        let options = {
            uri: this.url,
            simple: true, /* reject promise for non-2xx responses */
            resolveWithFullResponse: true, /* give the full response object, not just the body */
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
            }
        }
        return rp.get(options)
            .then((response) => {
                if (!response) {
                    throw new Error("Bad response");
                }

                const contentType = response.headers['content-type'] || "unknown";
                this.metadata.contentType = contentType;
                if (contentType.indexOf("text/html") >= 0) {
                    return Promise.resolve(response.body);
                }
            }).then((body) => {
                if (body) {
                    return extract(body);
                }
            }).then(this.processArticleData.bind(this))
            .catch((error) => {
                console.log(error);
                this.hasError = true;
                new Notice("Error getting bookmark metadata: " + error)
            });
    }

    private processArticleData(articleData: ArticleData): void {
        if (!articleData) {
            return;
        }

        const {
            author,
            content,
            description,
            image,
            links,
            published,
            source,
            title,
            url
        } = articleData;

        this.metadata.author = author;
        this.metadata.markdownContent = NodeHtmlMarkdown.translate(content || '');
        this.metadata.description = description;
        this.metadata.image = image;
        this.metadata.links = links;
        this.metadata.publicationDate = published;
        this.metadata.domain = source;
        this.metadata.title = title;
        this.metadata.canonicalUrl = url;
    }

    /**
     * Format:
     * ---
     *   id: '<% crypto.randomUUID().replace("-", "") %>'
     *   aliases: 
     *   tags: 
     *   type: bookmark
     *   status: 🟥
     *   created: 2022-10-13 11:35
     *   modified: 2022-10-13 11:35
     * ---
     * # Metadata:
     *   CanonicalURL::
     *   Category::
     *   Domain::
     *   Author::
     *   Description::
     *   PublicationDate::
     * 
     * # Archive
     *   DevonthinkID::
     *   DevonthinkSyncTimestamp::
     *   Button -> Sync with devonthink
     * 
     * # Summary  
     * # Highlights
     * # Notes
     */
    public convertToMarkdown(): string {
        const timestamp = DateTime.now().toFormat('yyyy-LL-dd HH:mm');
        let file = "---\n"
        file += `id: ${crypto.randomUUID().replace("-", "")}\n`;
        file += `aliases:\n`;
        file += `tags: bookmark ${this.sanitizeDomain()} ${this.category}\n`;
        file += `type: bookmark\n`;
        file += `status: 🟥\n`;
        file += `created: ${timestamp}\n`;
        file += `modified: ${timestamp}\n`;
        file += `url: ${this.url}\n`;
        file += "---\n\n";

        file += "`button-filebookmark`  `button-syncbookmark`  `button-verifybookmark` \n\n"
        file += `# Metadata\n`;
        file += `**OriginalTitle**:: ${this.getTitle()}\n`
        file += `**CanonicalURL**:: <${this.metadata.canonicalUrl || this.url}>\n`;
        file += `**Category**:: ${this.category}\n`;
        file += `**Domain**:: ${this.metadata.domain || ""}\n`;
        file += `**Author**:: ${this.metadata.author || ""}\n`;
        file += `**Description**:: ${this.metadata.description || ""}\n`;
        file += `**PublicationDate**:: ${this.metadata.publicationDate || ""}\n`

        file += "\n# Archive\n";
        file += `**DevonthinkID**::\n`;
        file += `**DevonthinkLink**::\n`;
        file += `**DevonthinkSyncTimestamp**::\n`;
        file += `**DevonthinkVerified**:: 🟥`

        file += `\n# Summary\n`;
        file += `# Highlights\n`;
        file += `# Notes\n`;
        file += `# Extracted Content\n`;
        file += this.metadata.markdownContent;
        return file;
    }
}