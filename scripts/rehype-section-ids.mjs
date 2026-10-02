/** 접힌 항목에도 제목을 바탕으로 고유한 고정 링크를 만든다. */
export default function sectionIds() {
  return (tree) => {
    const used = new Set();
    const visit = (node, callback) => {
      callback(node);
      for (const child of node.children ?? []) visit(child, callback);
    };
    visit(tree, (node) => { if (node.properties?.id) used.add(node.properties.id); });
    const label = (node) => {
      if (node.type === 'text') return node.value;
      if (node.properties?.className?.includes('summary-hint')) return '';
      return (node.children ?? []).map(label).join('');
    };
    visit(tree, (node) => {
      if (node.tagName !== 'summary' || node.properties?.id) return;
      const slug = label(node).trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-');
      const base = `section-${slug || 'item'}`;
      let id = base;
      let suffix = 2;
      while (used.has(id)) id = `${base}-${suffix++}`;
      node.properties ??= {};
      node.properties.id = id;
      used.add(id);
    });
  };
}
