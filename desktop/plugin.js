import { KANBAN_CARD_AREAS, PANES_AREA, STATUSBAR_AREAS, TRANSCRIPT_DIRECTIVE_AREA, host } from '@hermes/plugin-sdk';
import { useState, useEffect } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';

let _latest = {
  lambda_2: 0,
  phi: 0,
  regime: '',
  cluster_a: [],
  cluster_b: [],
  fiedler_vector: [],
  contracts: 0,
  node_count: 0,
};
const _listeners = new Set();
function _notify(attrs) {
  if (!attrs) return;
  _latest = {
    lambda_2: attrs.lambda_2 ?? _latest.lambda_2,
    phi: attrs.phi ?? _latest.phi,
    regime: attrs.regime ?? _latest.regime,
    cluster_a: Array.isArray(attrs.cluster_a) ? attrs.cluster_a : _latest.cluster_a,
    cluster_b: Array.isArray(attrs.cluster_b) ? attrs.cluster_b : _latest.cluster_b,
    fiedler_vector: Array.isArray(attrs.fiedler_vector) ? attrs.fiedler_vector : _latest.fiedler_vector,
    contracts: attrs.contracts ?? _latest.contracts,
    node_count: attrs.node_count ?? _latest.node_count,
  };
  _listeners.forEach((fn) => {
    try { fn(_latest); } catch (e) {}
  });
}
function useLatest() {
  const [s, setS] = useState(_latest);
  useEffect(() => {
    const h = (val) => setS({ ...val });
    _listeners.add(h);
    return () => _listeners.delete(h);
  }, []);
  return s;
}

function EigenDirectiveCard({ attrs }) {
  const [expanded, setExpanded] = useState(true);
  useEffect(() => { _notify(attrs || {}); }, [attrs]);
  const s = _latest;
  const lambda2 = attrs && attrs.lambda_2 != null ? attrs.lambda_2 : s.lambda_2;
  const phi = attrs && attrs.phi != null ? attrs.phi : s.phi;
  const contracts = attrs && attrs.contracts != null ? attrs.contracts : s.contracts;
  const clusterA = attrs && Array.isArray(attrs.cluster_a) ? attrs.cluster_a : s.cluster_a;
  const clusterB = attrs && Array.isArray(attrs.cluster_b) ? attrs.cluster_b : s.cluster_b;
  const hasData = s.node_count > 0;

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
      expanded && hasData && jsx('div', {
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
      }),
      expanded && !hasData && jsx('div', {
        style: { marginTop: '8px', paddingTop: '8px', color: 'var(--ui-text-secondary)', fontSize: '11px' },
        children: 'No active partition yet — run eigen_partition'
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
        render: ({ attrs, sessionId }) => { _notify(attrs || {}); return jsx(EigenDirectiveCard, { attrs, sessionId }); }
      }
    });
    ctx.register({
      id: 'pane',
      area: PANES_AREA,
      title: 'Velvet Eigen',
      data: { placement: 'right', width: '300px' },
      render: () => jsx(Pane, {})
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

    function Pane() {
      const s = useLatest();
      const bars = s.fiedler_vector.map((v, i) => {
        const x = 20 + i * 30;
        const h = Math.max(4, Math.abs(v) * 40);
        const y = 110 - (v >= 0 ? h : 0);
        return jsx('rect', { key: i, x, y, width: 24, height: h, rx: 2, fill: v >= 0 ? 'var(--ui-accent)' : 'var(--ui-text-secondary)' });
      });
      return jsx('div', {
        style: { padding: '8px', fontSize: '12px', color: 'var(--foreground)', background: 'var(--card)', borderRadius: '8px', border: '1px solid var(--ui-stroke-secondary, var(--ui-border))' },
        children: [
          jsx('div', { style: { fontWeight: 600, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: ['💎 Velvet Eigen', jsx('span', { style: { fontSize: '10px', color: 'var(--ui-text-secondary)' }, children: `λ₂=${s.lambda_2.toFixed(3)} φ=${s.phi.toFixed(3)}` })] }),
          jsx('div', { style: { fontSize: '10px', color: 'var(--ui-text-secondary)', marginBottom: 6 }, children: `${s.cluster_a.length} + ${s.cluster_b.length} nodes` }),
          jsx('div', { style: { display: 'flex', gap: 6 }, children: [
            jsx('div', { style: { flex: 1, border: '1px solid var(--ui-stroke-secondary, var(--ui-border))', borderRadius: 6, padding: 4 }, children: [
              jsx('div', { style: { color: 'var(--ui-accent)', fontSize: '10px', marginBottom: 2, fontWeight: 600 }, children: `Cluster A (v₂<0)` }),
              jsx('ul', { style: { margin: 0, paddingLeft: 12, fontSize: '10px', color: 'var(--ui-text-secondary)' }, children: s.cluster_a.length ? s.cluster_a.map((n, i) => jsx('li', { key: i, children: n })) : '—' })
            ] }),
            jsx('div', { style: { flex: 1, border: '1px solid var(--ui-stroke-secondary, var(--ui-border))', borderRadius: 6, padding: 4 }, children: [
              jsx('div', { style: { color: 'var(--ui-text-secondary)', fontSize: '10px', marginBottom: 2, fontWeight: 600 }, children: `Cluster B (v₂≥0)` }),
              jsx('ul', { style: { margin: 0, paddingLeft: 12, fontSize: '10px', color: 'var(--ui-text-secondary)' }, children: s.cluster_b.length ? s.cluster_b.map((n, i) => jsx('li', { key: i, children: n })) : '—' })
            ] })
          ] }),
          jsx('div', { style: { marginTop: 8, borderTop: '1px solid var(--ui-stroke-secondary, var(--ui-border))', paddingTop: 6 }, children: [
            jsx('div', { style: { fontSize: '10px', color: 'var(--ui-text-secondary)', marginBottom: 4 }, children: 'Fiedler vector v₂' }),
            jsx('svg', { width: '100%', height: 90, style: { display: 'block' }, children: bars })
          ] }),
          !s.cluster_a.length && !s.cluster_b.length && jsx('div', { style: { color: 'var(--ui-text-secondary)', fontSize: '10px', marginTop: 20 }, children: 'No active partition yet — run eigen_partition' })
        ]
      });
    }

    function Chip() {
      const s = useLatest();
      return jsx('button', {
        type: 'button',
        className: 'px-2 text-[0.6875rem] text-(--ui-text-secondary)',
        onClick: () => host.notify({ kind: 'info', message: `Velvet Eigen: λ₂=${s.lambda_2.toFixed(3)} φ=${s.phi.toFixed(3)} clusters=${s.cluster_a.length}+${s.cluster_b.length} contracts=${s.contracts}` }),
        children: s.node_count > 0 ? `💎 λ₂ ${s.lambda_2.toFixed(3)}` : '💎 λ₂ —'
      });
    }

    ctx.register({
     id: 'chip',
     area: STATUSBAR_AREAS.right,
      order: 125,
      render: () => jsx(Chip, {})
    });
  }
};
