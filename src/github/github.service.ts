// import { Injectable } from '@nestjs/common';
// import axios from 'axios';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class GithubService {
//   constructor(private configService: ConfigService) {}
//   private repoMap: Record<string, string> = {
//     node: 'nodejs/node',
//     nodejs: 'nodejs/node',
//     react: 'facebook/react',
//     reactjs: 'facebook/react',
//     next: 'vercel/next.js',
//     nextjs: 'vercel/next.js',
//     tailwind: 'tailwindlabs/tailwindcss',
//     mongodb: 'mongodb/mongo',
//     angular: 'angular/angular',
//     vue: 'vuejs/vue',
//     svelte: 'sveltejs/svelte',
//     deno: 'denoland/deno',
//     bun: 'oven-sh/bun',
//     nest: 'nestjs/nest',
//     nestjs: 'nestjs/nest',
//     express: 'expressjs/express',
//     django: 'django/django',
//     flask: 'pallets/flask',
//     fastapi: 'tiangolo/fastapi',
//     laravel: 'laravel/laravel',
//     rails: 'rails/rails',
//     spring: 'spring-projects/spring-boot',
//     springboot: 'spring-projects/spring-boot',
//     rust: 'rust-lang/rust',
//     golang: 'golang/go',
//     go: 'golang/go',
//     kotlin: 'JetBrains/kotlin',
//     swift: 'apple/swift',
//     flutter: 'flutter/flutter',
//     docker: 'docker/compose',
//     kubernetes: 'kubernetes/kubernetes',
//     graphql: 'graphql/graphql-js',
//     redis: 'redis/redis',
//     postgresql: 'postgres/postgres',
//     postgres: 'postgres/postgres',
//     mysql: 'mysql/mysql-server',
//     prisma: 'prisma/prisma',
//     pytorch: 'pytorch/pytorch',
//     tensorflow: 'tensorflow/tensorflow',
//     langchain: 'langchain-ai/langchain',
//     python: 'python/cpython',
//     java: 'openjdk/jdk',
//     php: 'php/php-src',
//     ruby: 'ruby/ruby',
//     typescript: 'microsoft/TypeScript',
//   };

// //   async getReleases(tech:string){

// //   const res = await axios.get(
// //     `https://api.github.com/search/repositories?q=${tech}&sort=stars&order=desc&per_page=3`
// //   );

// //   return res.data.items.map((repo:any)=>({

// //     name: repo.full_name,
// //     url: repo.html_url,
// //     date: repo.updated_at

// //   }));

// // }
//  async getReleases(tech: string) {
//     const token = this.configService.get<string>('GITHUB_TOKEN');
//     const headers = token ? { Authorization: `Bearer ${token}` } : {};

//     const repo = this.repoMap[tech.toLowerCase()];

//     try {
//       if (repo) {
//         const response = await axios.get(
//           `https://api.github.com/repos/${repo}/releases?per_page=5`,
//           { headers }
//         );
//         return response.data.slice(0, 5).map((r: any) => ({
//           name: r.name || r.tag_name,
//           url: r.html_url,
//           date: r.published_at,
//         }));
//       }

//       // Fallback: search GitHub for top repo matching the tech
//       const search = await axios.get(
//         `https://api.github.com/search/repositories?q=${tech}&sort=stars&order=desc&per_page=3`,
//         { headers }
//       );
//       const repos = search.data.items || [];
//       return repos.slice(0, 5).map((r: any) => ({
//         name: r.full_name,
//         url: r.html_url,
//         date: r.updated_at,
//       }));
//     } catch {
//       return [];
//     }
//   }
// }

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