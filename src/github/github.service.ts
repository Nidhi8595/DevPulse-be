import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubService {
  constructor(private configService: ConfigService) {}
  async getReleases(tech: string) {

    const token = this.configService.get<string>('GITHUB_TOKEN');

    const repoMap = {
      react: "facebook/react",
      node: "nodejs/node",
      tailwind: "tailwindlabs/tailwindcss",
      mongodb: "mongodb/mongo",
      nextjs: "vercel/next.js"
    };

    const repo = repoMap[tech.toLowerCase()];

    if (!repo) {
      return [];
    }

    const response = await axios.get(
      `https://api.github.com/repos/${repo}/releases`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data.slice(0,5).map((release) => ({
      name: release.name,
      url: release.html_url,
      date: release.published_at
    }));
  }
}