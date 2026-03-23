// // import { Injectable } from '@nestjs/common';
// // import axios from 'axios';

// // @Injectable()
// // export class RedditService {

// //   async getRedditPosts(tech: string) {

// //     const response = await axios.get(
// //       `https://www.reddit.com/search.json?q=${tech}&limit=15`
// //     );

// //     const posts = response.data.data.children;

// // return posts
// //   .filter(p =>
// //      p.data.title.toLowerCase().includes(tech)
// //   )
// //   .slice(0,5)
// //   .map(p=>({
// //       title:p.data.title,
// //       url:`https://reddit.com${p.data.permalink}`,
// //       subreddit:p.data.subreddit,
// //       score:p.data.score
// //   }));

// //   }

// // }

// import { Injectable } from '@nestjs/common';
// import axios from 'axios';

// @Injectable()
// export class RedditService {
//   private allowedSubreddits = new Set([
//     'reactjs', 'javascript', 'webdev', 'programming', 'node',
//     'typescript', 'python', 'java', 'golang', 'rust', 'cpp',
//     'csharp', 'dotnet', 'devops', 'docker', 'kubernetes',
//     'machinelearning', 'artificial', 'learnprogramming',
//     'softwareengineering', 'backend', 'frontend', 'fullstack',
//     'androiddev', 'swift', 'flutter', 'PHP', 'rails', 'django',
//     'vuejs', 'angular', 'svelte', 'nextjs', 'graphql', 'aws',
//     'azure', 'googlecloud', 'database', 'mysql', 'postgresql',
//     'mongodb', 'redis', 'linux', 'opensource', 'github',
//     'technology', 'coding', 'computerscience', 'datascience',
//     'cybersecurity', 'netsec', 'sysadmin', 'selfhosted',
//   ]);

//   async getRedditPosts(tech: string) {
//     try {
//       const response = await axios.get(
//         `https://www.reddit.com/search.json?q=${tech}&limit=25&sort=relevance`,
//         { headers: { 'User-Agent': 'DevPulse/1.0' } }
//       );

//       const posts = response.data.data.children;

//       return posts
//         .filter((p: any) =>
//           this.allowedSubreddits.has(p.data.subreddit.toLowerCase())
//         )
//         .slice(0, 5)
//         .map((p: any) => ({
//           title: p.data.title,
//           url: `https://reddit.com${p.data.permalink}`,
//           subreddit: p.data.subreddit,
//           score: p.data.score,
//         }));
//     } catch {
//       return [];
//     }
//   }
// }

import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RedditService {

  // These are community TYPE filters — not tech-specific
  // Covers ALL developer technologies regardless of what they are
  private allowedSubreddits = new Set([
    // Web frontend
    'reactjs', 'javascript', 'typescript', 'vuejs', 'angular', 'svelte',
    'nextjs', 'webdev', 'frontend', 'css', 'html',
    // Backend & general
    'node', 'python', 'java', 'golang', 'rust', 'cpp', 'csharp', 'dotnet',
    'php', 'ruby', 'rails', 'django', 'flask', 'fastapi', 'laravel',
    'kotlin', 'swift', 'scala', 'haskell', 'elixir', 'erlang',
    // Mobile
    'androiddev', 'iOSProgramming', 'flutter', 'reactnative',
    // DevOps & Infra
    'devops', 'docker', 'kubernetes', 'aws', 'azure', 'googlecloud',
    'terraform', 'ansible', 'linux', 'sysadmin', 'selfhosted',
    // Databases
    'database', 'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite',
    'elasticsearch', 'cassandra', 'neo4j',
    // AI/ML
    'machinelearning', 'artificial', 'deeplearning', 'datascience',
    'LocalLLaMA', 'ollama', 'LanguageModelForum',
    // General programming
    'programming', 'learnprogramming', 'softwareengineering', 'backend',
    'fullstack', 'computerscience', 'coding', 'github', 'opensource',
    // Security
    'cybersecurity', 'netsec', 'hacking', 'reverseengineering',
    // Tools
    'neovim', 'vscode', 'vim', 'git', 'graphql', 'grpc', 'restapi',
    // Blockchain (valid tech)
    'ethereum', 'solidity', 'web3', 'blockchain',
  ]);

  async getRedditPosts(tech: string) {
    try {
      const response = await axios.get(
        `https://www.reddit.com/search.json?q=${encodeURIComponent(tech)}&limit=30&sort=relevance&type=link`,
        {
          headers: { 'User-Agent': 'DevPulse/1.0 (educational project)' },
          timeout: 5000,
        }
      );

      const posts = response.data?.data?.children || [];

      const filtered = posts
        .filter((p: any) =>
          this.allowedSubreddits.has(p.data.subreddit.toLowerCase()) ||
          this.allowedSubreddits.has(p.data.subreddit)
        )
        .slice(0, 5)
        .map((p: any) => ({
          title: p.data.title,
          url: `https://reddit.com${p.data.permalink}`,
          subreddit: p.data.subreddit,
          score: p.data.score,
        }));

      return filtered;
    } catch {
      return [];
    }
  }
}