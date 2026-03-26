import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubTrendingService {
  constructor(private configService: ConfigService) {}

  async getTrending(tech: string) {
    const token = this.configService.get<string>('GITHUB_TOKEN');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      // Search repos created in last 30 days sorted by stars
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
      const dateStr = oneMonthAgo.toISOString().split('T')[0];

      const response = await axios.get(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(tech)}+created:>${dateStr}&sort=stars&order=desc&per_page=6`,
        { headers, timeout: 5000 }
      );

      const repos = response.data.items || [];

      return repos.slice(0, 6).map((r: any) => ({
        name: r.full_name,
        description: r.description || 'No description',
        url: r.html_url,
        stars: r.stargazers_count,
        language: r.language || 'Unknown',
        topics: r.topics?.slice(0, 3) || [],
      }));
    } catch {
      return [];
    }
  }
}