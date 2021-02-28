import React, { FC } from 'react';
import styles from './CardGrid.css';

interface Card {
  itemId: string;
  title: string;
}

const Card: FC<{ card: Card; onClick: (itemId: string) => void }> = ({
  card,
  onClick,
}) => (
  <button
    className={styles.card}
    type="button"
    onClick={() => onClick(card.itemId)}
  >
    <span className={styles.thumbnail} role="img" />
    <span className={styles.title}>{card.title}</span>
  </button>
);

const CardGrid: FC<{
  cards: Card[];
  onCardClick: (itemId: string) => void;
}> = ({ cards, onCardClick }) => {
  return (
    <div>
      {cards.map((card) => (
        <Card key={card.itemId} card={card} onClick={onCardClick} />
      ))}
    </div>
  );
};

export default CardGrid;
