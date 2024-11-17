import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';
import Footer from '../components/Footer'; // Import the existing Footer component

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/feedback');
        setFeedbacks(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('Failed to load feedback. Please try again later.');
      } finally {
        setLoadingFeedbacks(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (rating === 0 || comment.trim() === '') {
      setError('Please provide both a rating and a comment.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5001/api/feedback',
        { rating, comment },
        { withCredentials: true }
      );
      setFeedbacks([res.data, ...feedbacks]);
      setSuccess('Thank you for your feedback!');
      setRating(0);
      setComment('');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(
        err.response?.data?.msg || 'Failed to submit feedback. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1120]">
      <div className="pt-20 pb-12">
        {/* Main Content */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Decorative background elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-900/20 rounded-full mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-900/20 rounded-full mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-purple-900/20 rounded-full mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <div className="backdrop-blur-sm bg-white/5 rounded-2xl shadow-2xl p-6 md:p-8 space-y-8 border border-white/10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Your Feedback Matters</h2>
              <p className="text-gray-400">Help us improve your budget tracking experience</p>
            </div>

            {error && (
              <div className="bg-red-900/50 border-l-4 border-red-500 text-red-200 p-4 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-900/50 border-l-4 border-green-500 text-green-200 p-4 rounded">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 font-semibold mb-3">
                  Rate Your Experience
                </label>
                <div className="flex justify-center md:justify-start">
                  <ReactStars
                    count={5}
                    onChange={handleRatingChange}
                    size={32}
                    activeColor="#ffd700"
                    value={rating}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-2">
                  Share Your Thoughts
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition text-white placeholder-gray-400"
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What do you think about our budget tracking features?"
                  maxLength="500"
                  required
                ></textarea>
                <p className="text-sm text-gray-400 mt-1 text-right">{comment.length}/500</p>
              </div>

              <button
                type="submit"
                className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all ${
                  submitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>

            <div className="border-t border-white/10 pt-8">
              <h3 className="text-2xl font-bold text-white mb-6">Community Feedback</h3>

              {loadingFeedbacks ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                </div>
              ) : feedbacks.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {feedbacks.map((fb) => (
                    <div
                      key={fb._id}
                      className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg p-6 transition-transform hover:-translate-y-1 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-gray-200">{fb.user.username}</span>
                        <ReactStars
                          count={5}
                          value={fb.rating}
                          edit={false}
                          size={20}
                          activeColor="#ffd700"
                        />
                      </div>
                      <p className="text-gray-300 mb-3">{fb.comment}</p>
                      <span className="text-sm text-gray-400">
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No feedback yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Import existing Footer component */}
      <Footer />
    </div>
  );
};

export default Feedback;