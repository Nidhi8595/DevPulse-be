import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TechService {

  async searchTech(query: string) {

    const stack = await axios.get(
      `https://api.stackexchange.com/2.3/tags?inname=${query}&site=stackoverflow&pagesize=10`
    );

    const github = await axios.get(
      `https://api.github.com/search/topics?q=${query}`,
      {
        headers: {
          Accept: "application/vnd.github+json"
        }
      }
    );

    const stackTags = stack.data.items.map((t:any)=>t.name);

    const githubTopics =
      github.data.items?.map((t:any)=>t.name) || [];

    const suggestions = new Set([
      ...stackTags,
      ...githubTopics
    ]);

    return Array.from(suggestions).slice(0,10);
  }

}