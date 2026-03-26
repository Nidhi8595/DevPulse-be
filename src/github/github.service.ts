import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubService {
  constructor(private configService: ConfigService) {}

  private getHeaders() {
    const token = this.configService.get<string>('GITHUB_TOKEN');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getReleases(tech: string) {
    const headers = this.getHeaders();

    try {
      // Step 1: Find the most relevant repo for this tech dynamically
      const searchRes = await axios.get(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(tech)}+topic:${encodeURIComponent(tech)}&sort=stars&order=desc&per_page=5`,
        { headers, timeout: 5000 }
      );

      const repos: any[] = searchRes.data.items || [];

      if (repos.length === 0) return [];

      // Step 2: Try to fetch releases from top repos (first one that has releases)
      for (const repo of repos.slice(0, 3)) {
        try {
          const releaseRes = await axios.get(
            `https://api.github.com/repos/${repo.full_name}/releases?per_page=5`,
            { headers, timeout: 5000 }
          );

          const releases: any[] = releaseRes.data;

          if (releases && releases.length > 0) {
            return releases.slice(0, 5).map((r: any) => ({
              name: r.name || r.tag_name,
              url: r.html_url,
              date: r.published_at,
              repo: repo.full_name,
            }));
          }
        } catch {
          continue;
        }
      }

      // Step 3: If no releases found, return top repos as "trending" fallback
      return repos.slice(0, 5).map((r: any) => ({
        name: `${r.full_name} ⭐${r.stargazers_count.toLocaleString()}`,
        url: r.html_url,
        date: r.updated_at,
        repo: r.full_name,
      }));

    } catch {
      return [];
    }
  }
}