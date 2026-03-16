import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubService {
  constructor(private configService: ConfigService) {}
  async getReleases(tech:string){

  const res = await axios.get(
    `https://api.github.com/search/repositories?q=${tech}&sort=stars&order=desc&per_page=3`
  );

  return res.data.items.map((repo:any)=>({

    name: repo.full_name,
    url: repo.html_url,
    date: repo.updated_at

  }));

}
}