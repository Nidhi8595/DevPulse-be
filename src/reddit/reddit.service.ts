import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RedditService {

  async getRedditPosts(tech: string) {

    const response = await axios.get(
      `https://www.reddit.com/search.json?q=${tech}&limit=15`
    );

    const posts = response.data.data.children;

    // allow only tech related subreddits
    const allowedSubreddits = [
      "reactjs",
      "javascript",
      "webdev",
      "programming",
      "node",
      "typescript"
    ];

    const filteredPosts = posts
      .filter(post => allowedSubreddits.includes(post.data.subreddit.toLowerCase()))
      .slice(0,5);

    return filteredPosts.map((post) => ({
      title: post.data.title,
      url: `https://reddit.com${post.data.permalink}`,
      subreddit: post.data.subreddit,
      score: post.data.score
    }));

  }

}