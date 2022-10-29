import { Database } from "./Database";
import { Record } from "./Record";

export = Devonthink;
export as namespace Devonthink;

declare namespace Devonthink {
    export interface Application {
        includeStandardAdditions: boolean;
        databases(): Database[];


        createPDFDocumentFrom(url: string, params?: CreatePDFRequest): Record;
        createRecordWith(params: CreateRecordParams, locationParams: { in: string }): Record;

        delete(record: Record, params?: { in: string }): boolean;

        getRecordWithUuid(uuid: string, params?: SearchInDatabaseParam): Record;

        getDatabaseWithId(id: number): Database
        getDatabaseWithUuid(uuid: string): Database

        summarizeHighlightsOf(params: SummarizeHighlightParams): Record
    }

    interface SearchInDatabaseParam {
        in?: Record;
    }

    interface CreatePDFRequest extends SearchInDatabaseParam {
        agent?: string;
        name?: string;
        pagination?: boolean;
        readability?: boolean;
        referrer?: string;
        width?: number;
    }

    export interface ItemSearchParameters {
        name?: string;
        url?: string;
        referenceUrl?: string;
        database?: string;
        parentUuid?: string;
        kind?: string;
    }

    interface CreateRecordParams extends SearchInDatabaseParam {
        name?: string
        type?: string
        URL?: string
        tags?: string[]
    }

    interface SummarizeHighlightParams extends SearchInDatabaseParam {
        records: Record[],
        to: "markdown"
    }
}