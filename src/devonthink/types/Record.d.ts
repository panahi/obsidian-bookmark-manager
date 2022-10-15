import { Reminder } from "./Application";
import { Database } from "./Database";
import { Type } from "./file-types";

export = Devonthink;
declare namespace Devonthink {
    /**
     * Definitions extracted from Script Editor
     * Properties. These can be assigned like so:
     *  database.name = "new name"
     * and accessed like so:
     *  database.name() // "new name"
     * Reference: https://bru6.de/jxa/basics/working-with-objects/
     */
    export interface Record {
        /**
         * READONLY Date when the record was added to the database.
         */
        additionDate(): Date;

        /**
         * Wiki aliases (separated by commas or semicolons) of a record.
         */
        aliases(): string;

        /**
         * READONLY All dates extracted from text of document, e.g. a scan.
         */
        allDocumentDates(): Date[];

        /**
         * The altitude in metres of a record.
         */
        altitude(): number;

        /**
         * Annotation of a record. Only plain & rich text and Markdown documents are supported.
         */
        annotation(): Record;

        /**
         * READONLY The number of annotations. Currently only supported for PDF documents.
         */
        annotationCount(): number;

        /**
         * POSIX path of script attached to a record.
         */
        attachedScript(): string;

        /**
         * READONLY The number of attachments. Currently only supported for RTFD documents and emails.
         */
        attachmentCount(): number;

        /**
         * Bates number.
         */
        batesNumber(): number;

        /**
         * The cells of a sheet. This is a list of rows, each row contains a list of string values for the various colums.
         */
        cells(): string[][]

        /**
         * READONLY The character count of a record.
         */
        characterCount(): number;

        /**
         * READONLY The column names of a sheet.
         */
        columns(): string[];

        /**
         * The comment of a record.
         */
        comment(): string;

        /**
         * READONLY Stored SHA1 hash of files and document packages.
         */
        contentHash(): string;

        /**
         * The creation date of a record.
         */
        creationDate(): Date;

        /**
         * User-defined metadata of a record as a dictionary containing key-value pairs. 
         * Setting a value for an unknown key automatically adds a definition to Preferences > Data.
         */
        customMetaData(): object;

        /**
         * The file data of a record. 
         * Currently only supported by PDF documents, images, rich texts and web archives.
         */
        data(): any;

        /**
         * READONLY The database of the record.
         */
        database(): Database

        /**
         * The (creation/modification) date of a record.
         */
        date(): Date;

        /**
         * READONLY Digital object identifier (DOI) extracted from text of document, e.g. a scanned receipt.
         */
        digitalObjectIdentifier(): string;

        /**
         * READONLY The width and height of an image or PDF document in pixels.
         */
        dimensions(): number[];

        /**
         * READONLY Amount extracted from text of document, e.g. a scanned receipt.
         */
        documentAmount(): string;

        /**
         * READONLY First date extracted from text of document, e.g. a scan.
         */
        documentDate(): Date;

        /**
         * READONLY Name based on text or properties of document
         */
        documentName(): string;

        /**
         * READONLY The resultion of an image in dpi.
         */
        dpi(): number;

        /**
         * READONLY The duplicates of a record (only other instances, not including the record).
         */
        duplicates(): Record[]

        /**
         * READONLY The duration of audio and video files.
         */
        duration(): number;

        /**
         * Exclude group or record from classifying.
         */
        excludeFromClassification(): boolean;

        /**
         * Exclude group or record from searching.
         */
        excludeFromSearch(): boolean;

        /**
         * Exclude record from see also.
         */
        excludeFromSeeAlso(): boolean;

        /**
         * Exclude group from tagging.
         */
        excludeFromTagging(): boolean;

        /**
         * Exclude record from automatic Wiki linking.
         */
        excludeFromWikiLinking(): boolean;

        /**
         * READONLY The proposed file name for a record.
         */
        filename(): string;

        /**
         * READONLY The human readable geogr. place of a record.
         */
        geolocation(): string;

        /**
         * READONLY The height of an image or PDF document in pixels.
         */
        height(): number;

        /**
         * READONLY The scripting identifier of a record. 
         * Optimizing or closing a database might modify this identifier.
         */
        id(): number;

        /**
         * The image or PDF document of a record. Setting supports both raw data and strings containing paths or URLs.
         */
        image(): any;

        /**
         * READONLY If true, file is indexed. If false, file is imported
         */
        indexed(): boolean;

        /**
         * Refresh interval of a feed. Currently overriden by preferences.
         */
        interval(): any;

        /**
         * READONLY The human readable and localized kind of a record. 
         * WARNING: Don't use this to check the type of a record, otherwise your script might fail depending on the version and the localization.
         */
        kind(): string;

        /**
         * Index of label (0-7) of a record.
         */
        label(): number;

        /**
         * The latitude in degrees of a record.
         */
        latitude(): number;

        /**
         * READONLY The primary location in the database as a POSIX path (/ in names is replaced with \/). This is the location of the first parent group.
         */
        location(): string;

        /**
         * READONLY The group of the record's primary location. This is identical to the first parent group.
         */
        locationGroup(): Record;

        /**
         * The locking of a record
         */
        locking(): boolean;

        /**
         * The longitude in degrees of a record
         */
        longitude(): number;

        /**
         * READONLY Document metadata (e.g. of PDF or RTF) of a record as a dictionary containing key-value pairs. 
         * Possible keys are currently kMDItemTitle, kMDItemHeadline, kMDItemSubject, kMDItemDescription, kMDItemCopyright, kMDItemComment, kMDItemURL, kMDItemKeywords, kM
         */
        metaData(): Record;

        /**
         * READONLY The (proposed) MIME type of a record.
         */
        mimeType(): string;

        /**
         * The modification date of a record.
         */
        modificationDate(): Date;

        /**
         * The name of a record.
         */
        name(): string;

        /**
         * READONLY The name of a record without any dates.
         */
        nameWithoutDate(): string;

        /**
         * READONLY The name of a record without a file extension (independent of preferences).
         */
        nameWithoutExtension(): string;

        /**
         * READONLY Newest date extracted from text of document, e.g. a scan.
         */
        newestDocumentDate(): Date;

        /**
         * READONLY The number of duplicates of a record.
         */
        numberOfDuplicates(): number;

        /**
         * READONLY The number of hits of a record.
         */
        numberOfHits(): number;

        /**
         * READONLY The number of replicants of a record.
         */
        numberOfReplicants(): number;

        /**
         * READONLY Oldest date extracted from text of document, e.g. a scan.
         */
        oldestDocumentDate(): Date;

        /**
         * READONLY Date when a content was opened the last time or when a feed was refreshed the last time.
         */
        openingDate(): Date;

        /**
         * READONLY The page count of a record. Currently only supported by PDF documents.
         */
        pageCount(): number;

        /**
         * READONLY A printed/converted PDF of the record.
         */
        paginatedPDF(): any;

        /**
         * The POSIX file path of a record. Only the path of external records can be changed.
         */
        path(): string;

        /**
         * The plain text of a record.
         */
        plainText(): string;

        /**
         * Rating (0-5) of a record.
         */
        rating(): number;

        /**
         * READONLY The URL (x-devonthink-item://...) to reference/link back to a record. 
         * Append ?page= to specify the zero-based index of a page of a PDF document, 
         *  ?time= to specify the time of a movie or 
         *  ?search= to specify a string to search.
         */
        referenceURL(): string;

        /**
         * Reminder of a record.
         */
        reminder(): Reminder;

        /**
         * The rich text of a record (see text suite). 
         * Use the 'text' relationship introduced by version 3.0 instead, especially for changing the contents/styles of RTF(D) documents.
         */
        richText(): string;

        /**
         * READONLY The score of the last comparison, classification or search (value between 0.0 and 1.0) or undefined otherwise.
         */
        score(): number;

        /**
         * READONLY The size of a record in bytes.
         */
        size(): number;

        /**
         * The HTML/XML source of a record if available or the record converted to HTML if possible.
         */
        source(): string;

        /**
         * The state/flag of a record.
         */
        state(): boolean;

        /**
         * @deprecated
         */
        stateVisibility(): boolean;

        /**
         * READONLY The tag type of a record.
         * "group tag"/‌"no tag"/‌"ordinary tag"
         */
        tagType(): TagType;

        /**
         * The tags of a record
         */
        tags(): Record[]

        /**
         * The thumbnail of a record. Setting supports both raw data and strings containing paths or URLs.
         */
        thumbnail(): any;

        /**
         * READONLY The type of a record. Note: In compiled menu/toolbar scripts you might have to use a string representation of the type for comparisons.
         * See file-types.ts for possible values
         */
        type(): string;

        /**
         * The unread flag of a record
         */
        unread(): boolean;

        /**
         * The URL of a record
         */
        url(): string;

        /**
         * READONLY The unique and persistent identifier of a record
         */
        uuid(): string;

        /**
         * READONLY The web archive of a record if available or if the record converted to web archive is possible
         */
        webArchive(): any;

        /**
         * READONLY The width of an image or PDF document in pixels
         */
        width(): number;

        /**
         * READONLY The word count of the record
         */
        wordCount(): number;

        /**
         * Elements. These are actually typeof ObjectSpecifier and have unique properties
         * For example, you can call 
         *  database.records() to get a javascript array of Records
         * e.g. database.records()[0].name() to get the name of the first record
         * or you can call chain object specifiers like
         *  dabase.records.parent.name()
         * Javascript/Typescript don't make it easy to specifiy properties and functions
         *  with the same name, so only the function definition is exposed
         * Reference: https://bru6.de/jxa/basics/working-with-objects/
         */

        /**
         * Element
         * Returns all of the records that contain other records in the database (groups, tags, trash, inbox, etc)
         */
        parents(): Parent[];
    }

    export interface Parent extends Record {
        children(): Record[];
    }

    export interface Content extends Record {

    }

    export interface SmartGroup extends Record {

    }

    export interface TagGroup extends Record {
        /**
         * The color of a record. Currently only supported by tags.
         */
        color(): any;
    }

    export enum TagType {
        "group tax",
        "no tag",
        "ordinary tag"
    }
}