import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HackernewsService {

  async getPosts(tech: string) {

    const response = await axios.get(
      `https://hn.algolia.com/api/v1/search?query=${tech}&tags=story&hitsPerPage=5`
    );

    const posts = response.data.hits;

    return posts.map(post => ({
      title: post.title,
      url: post.url || `https://news.ycombinator.com/item?id=${post.objectID}`,
      points: post.points,
      author: post.author
    }));
  }
}