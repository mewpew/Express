import { Schema, Document, model, Model } from 'mongoose';

export const ShortenedUrlSchema: Schema = new Schema({
    redirectTo: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
    },
    viewCount: {
        type: Number,
        required: true,
        default: 0
    }
})

ShortenedUrlSchema.virtual('shortenedUrl').get(function (this: IShortenedUrlDocument): string {
    return `http://localhost:3000/${this.token}`;
})

export interface IShortenedUrl {
    redirectTo: string
}

export interface IShortenedUrlDocument extends IShortenedUrl, Document {
    shortenedUrl: string,
    token: string,
    viewCount: number
}

export default model<IShortenedUrlDocument, Model<IShortenedUrlDocument>>("ShortenedUrl", ShortenedUrlSchema);
