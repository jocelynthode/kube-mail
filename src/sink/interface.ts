import {SMTPServerSession} from "smtp-server";
import {ParsedMail} from "mailparser";
import {CatchPolicy, Policy, SourceReference} from "../policy/provider";
import {TypedStream} from "../util";

export interface Message {
    envelope: {
        mailFrom: string;
        rcptTo: string[];
    };

    date: Date;
    mail: ParsedMail;
    remoteAddress?: string;
}

export interface StoredMessage extends Message {
    id: string;
    source: SourceReference;
    expires?: Date;
}

export interface Query {
    namespace: string;
    id?: string;
    podName?: string;
    labelSelector?: {[k: string]: string};
}

export interface RetrieveOptions {
    limit?: number;
    offset?: number;
}

export interface RetrieveStreamOptions {
    onlyNew?: boolean;
}

export interface RetrieveResult {
    messages: StoredMessage[];
    totalCount: number;
}

export interface Parser {
    parseMessage(session: SMTPServerSession, data: Buffer): Promise<Message>
}

export interface Sink {
    setup?(): Promise<void>;

    storeMessage(source: SourceReference, message: Message, policy: CatchPolicy): Promise<void>
    retrieveMessages(query: Query, opts?: RetrieveOptions): Promise<RetrieveResult>
}

export interface RealtimeSink extends Sink {
    retrieveMessageStream(query: Query, opts?: RetrieveStreamOptions): TypedStream<StoredMessage>;
}