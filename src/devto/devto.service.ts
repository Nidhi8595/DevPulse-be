import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class DevtoService {

  async getArticles(tech: string) {

    const response = await axios.get(
      `https://dev.to/api/articles?tag=${tech}&per_page=5`
    );

    const articles = response.data;

    return articles.map(article => ({
      title: article.title,
      url: article.url,
      author: article.user.name,
      reactions: article.public_reactions_count
    }));
  }
}