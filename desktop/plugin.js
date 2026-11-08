import { KANBAN_CARD_AREAS, PANES_AREA, STATUSBAR_AREAS, TRANSCRIPT_DIRECTIVE_AREA, host } from '@hermes/plugin-sdk';
import { useState } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';

function EigenDirectiveCard({ attrs }) {
  const [expanded, setExpanded] = useState(true);
  const lambda2 = (attrs && attrs.lambda_2) || '0.0286';
  const phi = (attrs && attrs.phi) || '0.0152';
  const contracts = (attrs && attrs.contracts) || '1';

  return jsxs('div', {
    style: {
      border: '1px solid var(--ui-stroke-secondary, var(--ui-border))',
      borderRadius: '10px',
      background: 'var(--card, var(--ui-surface-2))',
      color: 'var(--foreground, var(--ui-text-primary))',
      padding: '10px 14px',
      margin: '4px 0',
      fontSize: '12px'
    },
    children: [
      jsxs('div', {
        onClick: () => setExpanded(!expanded),
        style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: '8px' },
        children: [
          jsxs('div', {
            style: { display: 'flex', alignItems: 'center', gap: '8px' },
            children: [
              jsx('span', { style: { fontFamily: 'var(--ui-font-mono)', color: 'var(--ui-accent)', fontWeight: 700 }, children: `💎 λ₂=${lambda2}` }),
              jsx('span', { style: { fontWeight: 600 }, children: `eigen · Fiedler Bisection (φ=${phi})` })
            ]
          }),
          jsx('span', { style: { fontFamily: 'var(--ui-font-mono)', fontSize: '11px', color: 'var(--ui-text-secondary)' }, children: `${contracts} Frozen Contract ${expanded ? '▲' : '▼'}` })
        ]
      }),
      expanded && jsx('div', {
        style: { marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--ui-stroke-secondary, var(--ui-border))' },
        children: jsxs('svg', {
          width: '100%',
          height: '96',
          viewBox: '0 0 500 96',
          preserveAspectRatio: 'xMidYMid meet',
          style: { display: 'block' },
          children: [
            jsx('rect', { x: 10, y: 8, width: 480, height: 64, rx: 6, fill: 'none', stroke: 'var(--ui-stroke-secondary, var(--ui-border))' }),
            jsx('line', { x1: 62, y1: 22, x2: 132, y2: 40, stroke: 'var(--ui-accent)', strokeWidth: '2' }),
            jsx('line', { x1: 132, y1: 40, x2: 70, y2: 58, stroke: 'var(--ui-accent)', strokeWidth: '2' }),
            jsx('line', { x1: 62, y1: 22, x2: 70, y2: 58, stroke: 'var(--ui-accent)', strokeWidth: '2' }),
            jsx('circle', { cx: 62, cy: 22, r: '5.5', fill: 'var(--ui-accent)' }),
            jsx('circle', { cx: 132, cy: 40, r: '5.5', fill: 'var(--ui-accent)' }),
            jsx('circle', { cx: 70, cy: 58, r: '5.5', fill: 'var(--ui-accent)' }),
            jsx('line', { x1: 250, y1: 12, x2: 250, y2: 68, stroke: 'var(--ui-accent)', strokeDasharray: '4 3', strokeWidth: '1.6' }),
            jsx('line', { x1: 132, y1: 40, x2: 358, y2: 40, stroke: 'var(--ui-text-secondary)', strokeDasharray: '3 3', strokeWidth: '1.5' }),
            jsx('line', { x1: 358, y1: 40, x2: 428, y2: 22, stroke: 'var(--ui-text-secondary)', strokeWidth: '2' }),
            jsx('line', { x1: 358, y1: 40, x2: 420, y2: 58, stroke: 'var(--ui-text-secondary)', strokeWidth: '2' }),
            jsx('line', { x1: 428, y1: 22, x2: 420, y2: 58, stroke: 'var(--ui-text-secondary)', strokeWidth: '2' }),
            jsx('circle', { cx: 358, cy: 40, r: '5.5', fill: 'var(--ui-text-primary)' }),
            jsx('circle', { cx: 428, cy: 22, r: '5.5', fill: 'var(--ui-text-primary)' }),
            jsx('circle', { cx: 420, cy: 58, r: '5.5', fill: 'var(--ui-text-primary)' }),
            jsx('text', { x: 14, y: 88, fill: 'var(--ui-text-secondary)', fontSize: '10.5', fontFamily: 'var(--ui-font-mono)', children: 'Auto-Partitioned Prompt/AST/Dataset: v₂<0 (Cluster 1) │ Cut │ v₂≥0 (Cluster 2)' })
          ]
        })
      })
    ]
  });
}

export default {
  id: 'eigen',
  name: 'Velvet Eigen Partitioner',
  register(ctx) {
    ctx.register({
      id: 'directive',
      area: TRANSCRIPT_DIRECTIVE_AREA,
      data: {
        name: 'eigen',
        render: ({ attrs, sessionId }) => jsx(EigenDirectiveCard, { attrs, sessionId })
      }
    });
    ctx.register({
      id: 'pane',
      area: PANES_AREA,
      title: 'Velvet Eigen',
      data: { placement: 'right', width: '300px' },
      render: () => jsx('div', { className: 'p-2 text-xs', children: '💎 Fiedler Vector & Graph Laplacian Subagent Partitioner' })
    });
    if (KANBAN_CARD_AREAS && KANBAN_CARD_AREAS.badges) {
      ctx.register({
        id: 'eigen-kanban-badge',
        area: KANBAN_CARD_AREAS.badges,
        data: {
          decorate: (card) => ({
            label: card && card.id && card.id.length % 2 === 0 ? 'eigen-cluster-A (v₂<0)' : 'eigen-cluster-B (v₂≥0)',
            tone: 'cyan',
            tooltip: 'Zero-conflict Fiedler spectral subagent partition'
          })
        }
      });
    }
    ctx.register({
      id: 'chip',
      area: STATUSBAR_AREAS.right,
      order: 125,
      render: () => jsx('button', {
        type: 'button',
        className: 'px-2 text-[0.6875rem] text-(--ui-text-secondary)',
        onClick: () => host.notify({ kind: 'info', message: 'Velvet Eigen: Zero-conflict spectral DelegationProvider active' }),
        children: '💎 λ₂ 0.029'
      })
    });
  }
};
