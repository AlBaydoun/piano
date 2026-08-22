/**
 * The practice drills.
 *
 * Kept here rather than in a view because three places need to agree on the
 * list: the hub that links to them, the progress table that names them, and
 * the router. Titles and blurbs live in the locale bundles under
 * `practice.drills.<id>`.
 */

export const DRILLS = [
  { id: 'note-reading', path: '/practice/notes' },
  { id: 'ear-intervals', path: '/practice/ear' },
  { id: 'chord-recognition', path: '/practice/chords' },
  { id: 'key-signatures', path: '/practice/keys' },
  { id: 'rhythm', path: '/practice/rhythm' },
];

export const DRILL_IDS = DRILLS.map((drill) => drill.id);
