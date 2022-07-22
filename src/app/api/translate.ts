import { googleTranslate } from './google';
import { ensureString } from '../util/object';

type TranArgs = {
  from: string,
  to: string,
  second: string | undefined,
  text: string
}

export type TranAlt = { result: string, hint: string };

export type TranResult = {
  [lang: string]: {
    alternatives: TranAlt[]
  }
}

async function getAlts(args: TranArgs) {
  const response = await googleTranslate(args.from, args.to, args.text, true);
  const alternatives: TranAlt[] = [];
  for (const at of response.alternative_translations || []) {
    for (const ae of at.alternative || []) {
      const result = ensureString(ae.word_postproc);
      alternatives.push({ result, hint: '' });
    }
  }
  if (alternatives.length === 0) alternatives.push({ result: args.text, hint: '' });
  return alternatives;
}

async function enrichHint(args: TranArgs, alternative: TranAlt) {
  if (!args.second) return;
  const response = await googleTranslate(args.to, args.second, alternative.result, false);
  alternative.hint = ensureString(response.sentences[0].trans);
}

async function enrichAlts(args: TranArgs, result: TranResult) {
  const alternatives = await getAlts(args);
  await Promise.all(alternatives.map(a => enrichHint(args, a)));
  result[args.to] = { alternatives };
}

export async function translate(from: string, second: string | undefined, text: string, languages: string[]): Promise<TranResult> {
  const result: TranResult = {};
  await Promise.all([...languages].map(to => {
    const args = { from, to, second, text };
    return enrichAlts(args, result);
  }));
  return result;
}
