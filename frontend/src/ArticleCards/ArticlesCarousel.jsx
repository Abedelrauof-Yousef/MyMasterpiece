import React from 'react';
import { Star } from 'lucide-react';

const articles = [
  { id: 1, name: 'Alice Johnson', opinion: 'This budget website is a game-changer! It\'s helped me save over $500 in just two months.', imageUrl: '/path/to/customerFive.jpg', rating: 5, occupation: 'Teacher' },
  { id: 2, name: 'Bob Smith', opinion: 'The expense tracking feature is incredibly detailed. I can finally see where every dollar goes.', imageUrl: '/path/to/softwareEngineer.jpg', rating: 4, occupation: 'Software Engineer' },
  { id: 3, name: 'Charlie Brown', opinion: 'User-friendly interface and insightful reports. It\'s like having a personal financial advisor.', imageUrl: '/path/to/graphic.jpg', rating: 5, occupation: 'Graphic Designer' },
  { id: 4, name: 'David Lee', opinion: 'This tool has revolutionized my approach to personal finance. The investment tracker is particularly useful.', imageUrl: '/path/to/customerFour.jpg', rating: 5, occupation: 'Financial Analyst' },
  // ... (add more articles as needed)
];

function ArticleCard({ name, opinion, imageUrl, rating, occupation }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4">{occupation}</p>
        <p className="text-gray-700 mb-4">"{opinion}"</p>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ArticlesCarousel() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-8 text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {articles.slice(0, 4).map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArticlesCarousel;