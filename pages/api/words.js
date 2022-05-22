// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { allWords } from '../../Parole';

export default function handler(req, res) {
  const w = [];
  for (var i = 0; i < 100; i++) {
    const r = parseInt(Math.random() * 1000);
    w.push(allWords[r]);
  }
  res.status(201).json(w);
}
