// https://wiki.freepascal.org/Using_Google_Translate
// GET https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&dt=bd&dt=at&dj=1&q=order+created

export type TranslateResponse = {
  sentences: Array<{
    trans: string,
    orig: string,
  }>,
  dict: Array<{
    pos: 'verb' | string,
    terms: Array<string>,
    entry: Array<{
      word: string,
      reverse_translation: string[],
      // score: number,
    }>,
    base_form: string,
    // pos_enum: number
  }>,
  src: 'en' | string,
  alternative_translations: Array<{
    src_phrase: string,
    alternative: Array<{
      word_postproc: string,
      // score: number,
      // has_preceding_space: boolean,
      // attach_to_next_token: boolean,
      // backends: number[],
      // backend_infos: Array<{ backend: number }>
    }>,
    // srcunicodeoffsets: Array<{ begin: number, end: number }>,
    // raw_src_segment: string,
    // start_pos: number,
    // end_pos: number
  }>,
  // spell: object
};

// fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&dt=bd&dt=at&dj=1&q=order+created')
//   .then(r => r.json()).then((r: TranslateResponse) => console.log(JSON.stringify(r, null, '  ')));
