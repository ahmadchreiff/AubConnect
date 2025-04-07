import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import { useAuth } from '../../context/AuthContext';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'courses', 'professors', or 'rejected'
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:5001/api/users/reviews', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setReviews(response.data.reviews);
      } catch (err) {
        console.error('Error fetching user reviews:', err);
        setError('Failed to load your reviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated()) {
      fetchUserReviews();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Function to render a badge for rejected reviews
  const renderStatusBadge = (review) => {
    if (review.status === 'rejected') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">
          Rejected
        </span>
      );
    }
    return null;
  };

  // Filter reviews based on selected type
  const filteredReviews = () => {
    if (filter === 'all') return reviews;
    if (filter === 'courses') return reviews.filter(review => review.type === 'course');
    if (filter === 'professors') return reviews.filter(review => review.type === 'professor');
    if (filter === 'rejected') return reviews.filter(review => review.status === 'rejected');
    return reviews;
  };

  // Get counts for filter tabs
  const getCounts = () => {
    const courseCount = reviews.filter(review => review.type === 'course').length;
    const professorCount = reviews.filter(review => review.type === 'professor').length;
    const rejectedCount = reviews.filter(review => review.status === 'rejected').length;
    
    return {
      all: reviews.length,
      courses: courseCount,
      professors: professorCount,
      rejected: rejectedCount
    };
  };

  const counts = getCounts();

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D0B24]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 m-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Filter tabs */}
          {reviews.length > 0 && (
            <div className="flex border-b border-gray-200 p-4 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 mr-2 mb-2 rounded-lg ${filter === 'all' 
                  ? 'bg-[#6D0B24] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All Reviews ({counts.all})
              </button>
              <button
                onClick={() => setFilter('courses')}
                className={`px-4 py-2 mr-2 mb-2 rounded-lg ${filter === 'courses' 
                  ? 'bg-[#6D0B24] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Course Reviews ({counts.courses})
              </button>
              <button
                onClick={() => setFilter('professors')}
                className={`px-4 py-2 mr-2 mb-2 rounded-lg ${filter === 'professors' 
                  ? 'bg-[#6D0B24] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Professor Reviews ({counts.professors})
              </button>
              {counts.rejected > 0 && (
                <button
                  onClick={() => setFilter('rejected')}
                  className={`px-4 py-2 mb-2 rounded-lg ${filter === 'rejected' 
                    ? 'bg-[#6D0B24] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Rejected Reviews ({counts.rejected})
                </button>
              )}
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't written any reviews yet.
              </p>
              <div className="mt-6 flex justify-center space-x-4">
                <Link
                  to="/courses"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D0B24] hover:bg-[#860033] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D0B24]"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Browse Courses
                </Link>
                <Link
                  to="/professors"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D0B24] hover:bg-[#860033] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D0B24]"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Browse Professors
                </Link>
              </div>
            </div>
          ) : filteredReviews().length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No {filter === 'courses' ? 'course' : filter === 'professors' ? 'professor' : filter === 'rejected' ? 'rejected' : ''} reviews found.</p>
              <button 
                onClick={() => setFilter('all')}
                className="mt-2 text-[#6D0B24] hover:underline"
              >
                Show all reviews
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredReviews().map((review) => (
                <li key={review._id} className="px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {review.type === 'course' ? (
                        <Link
                          to={`/courses/${review.course?._id}`}
                          className="text-lg font-medium text-[#6D0B24] hover:underline"
                        >
                          {review.title || 'Unknown Course'}
                        </Link>
                      ) : (
                        <Link
                          to={`/professors/${review.professor?._id}`}
                          className="text-lg font-medium text-[#6D0B24] hover:underline"
                        >
                          {review.title || 'Unknown Professor'}
                        </Link>
                      )}
                      {renderStatusBadge(review)}
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  
                  {/* Add this notice for rejected reviews */}
                  {review.status === 'rejected' && (
                    <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-400 text-sm text-red-700">
                      <p>This review has been rejected by an administrator and is not visible to other users.</p>
                    </div>
                  )}
                  
                  <div className="flex items-center mt-1">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      review.type === 'course' 
                        ? 'bg-pink-100 text-pink-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {review.type === 'course' ? 'Course' : 'Professor'}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="mt-2 text-gray-700">{review.reviewText}</p>
                  
                  <div className="mt-3 flex">
                    {review.type === 'course' && review.course && (
                      <Link
                        to={`/courses/${review.course._id}`}
                        className="inline-flex items-center text-sm text-[#6D0B24] hover:text-[#860033]"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Course
                      </Link>
                    )}
                    {review.type === 'professor' && review.professor && (
                      <Link
                        to={`/professors/${review.professor._id}`}
                        className="inline-flex items-center text-sm text-[#6D0B24] hover:text-[#860033]"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Professor
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReviews;