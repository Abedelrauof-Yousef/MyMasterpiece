import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import './ArticlesCarousel.css';

import customerTwo from '../assets/customerTwo.webp';
import softwareEngineer from '../assets/softwareEngineer.webp';
import customerFour from '../assets/customerFour.webp';
import customerFive from '../assets/customerFive.webp';
import Engineer from '../assets/Engineer.webp';
import Data from '../assets/Data.webp';
import CollageStudent from '../assets/CollageStudent.webp';
import Financial from '../assets/Financial.webp';
import owner from '../assets/owner.webp';
import graphic from '../assets/graphic.webp';


const articles = [
  { id: 1, name: 'Alice Johnson', opinion: 'This budget website is a game-changer! It\'s helped me save over $500 in just two months.', imageUrl: customerFive , rating: 5, occupation: 'Teacher' },
  { id: 2, name: 'Bob Smith', opinion: 'The expense tracking feature is incredibly detailed. I can finally see where every dollar goes.', imageUrl: softwareEngineer, rating: 4, occupation: 'Software Engineer' },
  { id: 3, name: 'Charlie Brown', opinion: 'User-friendly interface and insightful reports. It\'s like having a personal financial advisor.', imageUrl: graphic , rating: 5, occupation: 'Graphic Designer' },
  { id: 4, name: 'David Lee', opinion: 'This tool has revolutionized my approach to personal finance. The investment tracker is particularly useful.', imageUrl: customerFour, rating: 5, occupation: 'Financial Analyst' },
  { id: 5, name: 'Eve Taylor', opinion: 'I\'ve tried many budgeting apps, but this one stands out. The goal-setting feature keeps me motivated.', imageUrl: customerTwo, rating: 4, occupation: 'Marketing Manager' },
  { id: 6, name: 'Frank Wilson', opinion: 'The bill reminder feature alone has saved me from late fees. Absolutely worth every penny!', imageUrl: owner , rating: 5, occupation: 'Small Business Owner' },
  { id: 7, name: 'Grace Martinez', opinion: 'I recommend this to all my clients. It\'s an essential tool for anyone serious about financial planning.', imageUrl: Financial , rating: 5, occupation: 'Financial Planner' },
  { id: 8, name: 'Hank Anderson', opinion: 'As a student, this app has been a lifesaver. It\'s helped me manage my limited budget effectively.', imageUrl: CollageStudent , rating: 4, occupation: 'College Student' },
  { id: 9, name: 'Ivy Chen', opinion: 'The customizable categories and tags make this the most flexible budgeting tool I\'ve used.', imageUrl: Data , rating: 5, occupation: 'Data Scientist' },
  { id: 10, name: 'Jack Patel', opinion: 'This website simplifies complex financial concepts. The educational resources are top-notch.', imageUrl: Engineer , rating: 4, occupation: 'Engineer' },
];

const ArticleCard = ({ name, opinion, imageUrl, rating, occupation }) => {
  return (
    <div className="article-card">
      <img src={imageUrl} alt={name} className="card-image" />
      <div className="card-content">
        <div className="card-name">{name}</div>
        <span className="card-occupation">{occupation}</span>
        <p className="card-opinion">"{opinion}"</p>
        <div className="card-rating">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`star ${i < rating ? 'star-filled' : 'star-empty'}`} />
          ))}
        </div>
      </div>
      <div className="card-footer">
        User since {2024 - Math.floor(Math.random() * 3)}
      </div>
    </div>
  );
};

const ArticlesCarousel = () => {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prevIndex) => (prevIndex + 1) % articles.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const displayedArticles = [...articles.slice(startIndex), ...articles.slice(0, startIndex)].slice(0, 4);

  return (
    <div className="articles-carousel">
      <h2 className="carousel-title">What Our Users Say</h2>
      <div className="carousel-container">
        {displayedArticles.map((article) => (
          <ArticleCard 
            key={article.id} 
            name={article.name} 
            opinion={article.opinion} 
            imageUrl={article.imageUrl}
            rating={article.rating}
            occupation={article.occupation}
          />
        ))}
      </div>
    </div>
  );
};

export default ArticlesCarousel;