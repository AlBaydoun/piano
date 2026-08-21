/** Shared scaffolding for the practice drills: layout, scoring, streaks. */

import { h, percent } from '../ui.js';

export class Scoreboard {
  constructor(app, drillId) {
    this.app = app;
    this.drillId = drillId;
    this.correct = 0;
    this.attempts = 0;
    this.streak = 0;
    this.best = app.progress.drill(drillId).bestStreak;

    this.nodes = {
      score: h('span.scoreboard__value', null, '0'),
      accuracy: h('span.scoreboard__value', null, '—'),
      streak: h('span.scoreboard__value', null, '0'),
      best: h('span.scoreboard__value', null, String(this.best)),
    };

    this.node = h('div.scoreboard', null,
      metric('Correct', this.nodes.score),
      metric('Accuracy', this.nodes.accuracy),
      metric('Streak', this.nodes.streak),
      metric('Best streak', this.nodes.best));
  }

  record(correct) {
    this.attempts += 1;
    if (correct) {
      this.correct += 1;
      this.streak += 1;
      this.best = Math.max(this.best, this.streak);
    } else {
      this.streak = 0;
    }
    this.app.progress.recordDrill(this.drillId, { correct, streak: this.streak });
    this.nodes.score.textContent = String(this.correct);
    this.nodes.accuracy.textContent = percent(this.correct / this.attempts);
    this.nodes.streak.textContent = String(this.streak);
    this.nodes.best.textContent = String(this.best);
  }
}

function metric(label, valueNode) {
  return h('div.scoreboard__metric', null, valueNode, h('span.scoreboard__label', null, label));
}

/**
 * Standard drill page layout.
 * @returns {{page: HTMLElement, stage: HTMLElement, controls: HTMLElement, status: HTMLElement}}
 */
export function drillPage({ title, lede, scoreboard }) {
  const stage = h('div.drill__stage');
  const controls = h('div.drill__controls');
  const status = h('div.drill__status', { role: 'status', 'aria-live': 'polite' });

  const page = h('div.page.page--drill', null,
    h('header.page__header', null,
      h('a.lesson__back', { href: '#/practice' }, '← Practice'),
      h('h1.page__title', null, title),
      lede ? h('p.page__lede', null, lede) : null),
    scoreboard ? scoreboard.node : null,
    controls,
    stage,
    status);

  return { page, stage, controls, status };
}

/** Options row rendered as a set of answer buttons. */
export function answerGrid(options, onPick, { columns = 4 } = {}) {
  const grid = h('div.answers', { style: { '--answer-columns': String(columns) } });
  for (const option of options) {
    grid.append(h('button.answers__option', {
      type: 'button',
      dataset: { value: String(option.value) },
      onclick: (event) => onPick(option, event.currentTarget),
    }, option.label));
  }
  return grid;
}

export function markAnswer(grid, correctValue, chosenNode) {
  for (const node of grid.children) node.disabled = true;
  if (chosenNode) chosenNode.classList.add(chosenNode.dataset.value === String(correctValue) ? 'is-correct' : 'is-wrong');
  const right = grid.querySelector(`[data-value="${CSS.escape(String(correctValue))}"]`);
  right?.classList.add('is-correct');
}
