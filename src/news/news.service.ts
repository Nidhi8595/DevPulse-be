import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NewsService {
  constructor(private configService: ConfigService) {}

  async getTechNews(tech: string) {
    const apiKey = this.configService.get<string>('NEWS_API_KEY');

    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${tech}+programming+developer&language=en&sortBy=publishedAt&apiKey=${apiKey}`
    );

    const articles = response.data.articles;

    return articles.slice(0,5).map(article => ({
      title: article.title,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt
    }));
  }
}