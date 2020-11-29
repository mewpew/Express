import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import ShortenedUrlModel, { IShortenedUrl } from './db';


const app: express.Application = express();
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://katya:qPuvmf9NBhcJT6c@cluster0.rfqkp.mongodb.net/Project 0?retryWrites=true&w=majority').catch((err: Error) => {
  throw(err);
});

app.post('/shorten', async (req: Request, res: Response): Promise<void> => {
  if (req.headers["content-type"] != 'application/json')
    res.status(415).json({ status: "Error", message: "Unsupported Content-type" });
  const shortenedUrl: IShortenedUrl = {
    redirectTo: req.body.urlToShorten
  }
  const shortenedUrlModel = new ShortenedUrlModel(shortenedUrl);
  await shortenedUrlModel.save();
  res.status(201).json({ status: "Created", shortenedUrl: shortenedUrlModel.shortenedUrl });
});

app.get('/:url', async (req: Request, res: Response): Promise<void> => {
  let token: string = req.params.url;
  let shortenedUrl = await ShortenedUrlModel.findOne({ token: token }).exec();
  if (shortenedUrl === null) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  shortenedUrl.viewCount++;
  await shortenedUrl.save();
  res.status(301)
      .location(shortenedUrl.redirectTo)
      .json({ redirectTo: shortenedUrl.redirectTo });
});

app.get('/:url/views', async (req: Request, res: Response): Promise<void> => {
  let token: string = req.params.url;
  let shortenedUrl = await ShortenedUrlModel.findOne({ token: token }).exec();
  if (shortenedUrl !== null) {
    res.json({ viewCount: shortenedUrl.viewCount });
  }
})

app.listen(3000);
