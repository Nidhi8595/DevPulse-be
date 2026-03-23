// import { Injectable } from '@nestjs/common';
// import axios from 'axios';

// @Injectable()
// export class HackernewsService {

//   async getPosts(tech: string) {

//     const response = await axios.get(
//       `https://hn.algolia.com/api/v1/search?query=${tech}&tags=story&hitsPerPage=5`
//     );

//     const posts = response.data.hits;

//     return posts.map(post => ({
//       title: post.title,
//       url: post.url || `https://news.ycombinator.com/item?id=${post.objectID}`,
//       points: post.points,
//       author: post.author
//     }));
//   }
// }

import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HackernewsService {
  async getPosts(tech: string) {
    try {
      const response = await axios.get(
        `https://hn.algolia.com/api/v1/search?query=${tech}&tags=story&hitsPerPage=5`,
        { timeout: 5000 }
      );
      return (response.data.hits || []).map((h: any) => ({
        title: h.title,
        url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
        points: h.points || 0,
        author: h.author || 'Unknown',
      }));
    } catch {
      return [];
    }
  }
}