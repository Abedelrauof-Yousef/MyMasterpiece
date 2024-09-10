import React from 'react';
import './ArticleCard.css';

const ArticleCard = ({ name, opinion, imageUrl }) => {
  return (
    <div className="article-card">
      <img src={imageUrl} alt={name} className="article-card-image" />
      <h3>{name}</h3>
      <p>{opinion}</p>
    </div>
  );
};

export default ArticleCard;
