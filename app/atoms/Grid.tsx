import React from 'react';

export function Grid<T>({
  items,
  itemWidth,
  itemHeight,
  getItemKey,
}: {
  items: T[];
  itemWidth: number;
  itemHeight: number;
  getItemKey: (item: T) => string;
}) {
  const itemStyle = {
    width: itemWidth,
    height: itemHeight,
    overflow: 'hidden',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        height: '100%',
        width: '100%',
        overflowY: 'scroll',
      }}
    >
      {items.map((item) => (
        <div key={getItemKey(item)} style={itemStyle}></div>
      ))}
    </div>
  );
}
