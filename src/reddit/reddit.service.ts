import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RedditService {

  async getRedditPosts(tech: string) {

    const response = await axios.get(
      `https://www.reddit.com/search.json?q=${tech}&limit=15`
    );

    const posts = response.data.data.children;

return posts
  .filter(p =>
     p.data.title.toLowerCase().includes(tech)
  )
  .slice(0,5)
  .map(p=>({
      title:p.data.title,
      url:`https://reddit.com${p.data.permalink}`,
      subreddit:p.data.subreddit,
      score:p.data.score
  }));

  }

}