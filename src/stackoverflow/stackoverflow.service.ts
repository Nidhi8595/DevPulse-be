import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class StackoverflowService {

    async getQuestions(tech: string) {

        const response = await axios.get(
            `https://api.stackexchange.com/2.3/search?order=desc&sort=activity&tagged=${tech}&site=stackoverflow&pagesize=5`
        );

        const questions = response.data.items;

        return questions.map(q => ({
            title: q.title,
            url: q.link,
            score: q.score,
            answers: q.answer_count
        }));
    }
}