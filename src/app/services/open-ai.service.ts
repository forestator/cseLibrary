import {Injectable} from '@angular/core';
import {BoardGame} from '../models/boardGame.model';
import {environment} from '../../environments/environment';

const {Configuration, OpenAIApi} = require("openai");

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {

  constructor() {
  }

  async genDescriptionJeu(boardGame: BoardGame): Promise<string> {
    if (boardGame.yearPublished < 2021) {
      const configuration = new Configuration({
        apiKey: environment.openAiApiKey,
      });
      const openai = new OpenAIApi(configuration);

      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Donne moi ue description pour ce jeu de société : ${boardGame.name}`,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      });
      return completion.data.choices[0].text.replace(/(\r\n|\n|\r)/gm, "");
    } else {
      return 'Ce jeu est postérieur aux données de open AI';
    }
  }

  /**
   * Work sometimes
   * @param gameName
   */
  async getGameBggId(gameName: string): Promise<string> {
      const configuration = new Configuration({
        apiKey: environment.openAiApiKey,
      });
      const openai = new OpenAIApi(configuration);

      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `can you give me the id of ${gameName} on boardgamegeek website ?`,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      });
      return completion.data.choices[0].text;
  }
}
