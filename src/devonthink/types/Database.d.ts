import { Content, Record, Parent, SmartGroup, TagGroup } from "./Record";

export = Devonthink;

declare namespace Devonthink {
    export interface Database {
        /**
         * Definitions extracted from Script Editor
         * Properties. These can be assigned like so:
         *  database.name = "new name"
         * and accessed like so:
         *  database.name() // "new name"
         * Reference: https://bru6.de/jxa/basics/working-with-objects/
         */

        /**
         * READ ONLY The group for annotations, will be created if necessary.
         */
        annotationsGroup(): Record;

        /**
         * The comment of the database.
         */
        comment(): string;

        /**
         * READ ONLY The (selected) group of the frontmost window. Returns root if no current group exists.
         */
        currentGroup(): Record;

        /**
         * READ ONLY The scripting identifier of a database.
         */
        id(): number;

        /**
         * READ ONLY The default group for new notes. Might be identical to root.
         */
        incomingGroup(): Record;

        /**
         * The name of the database.
         */
        name(): string;

        /**
         * READ ONLY The POSIX path of the database.
         */
        path(): string;

        /**
         * READ ONLY Specifies if a database is read-only and can't be modified.
         */
        readOnly(): boolean;

        /**
         * READ ONLY The top level group of the database.
         */
        root(): Record;

        /**
         * READ ONLY Obsolete group for synchronizing with DEVONthink To Go 1.x.
         */
        syncGroup(): Record | undefined;

        /**
         * READ ONLY The group for tags.
         */
        tagsGroup(): Record;

        /**
         * READ ONLY The trash's group.
         */
        trashGroup(): Record;

        /**
         * READ ONLY The unique and persistent identifier of a database for external referencing.
         */
        uuid(): string;



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
         * Returns all of the leaf records of the database (no groups, tags, etc)
         */
        contents(): Content[];

        /**
         * Element
         * Returns all of the records that contain other records in the database (groups, tags, trash, inbox, etc)
         */
        parents(): Parent[];

        /**
         * Element
         * Returns the top level records under the db root
         */
        records(): Parent[];

        /**
         * Element
         * Any smart groups configured at the database level
         */
        smartGroups(): SmartGroup[];

        /**
         * Element
         * Any tag groups relevant to the database
         */
        tagGroups(): TagGroup[];
    }
}