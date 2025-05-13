import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ReviewManagement = () => {
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchReviews();
    }
  }, [currentPage, filterStatus, searchTerm, activeTab]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://aubconnectbackend-h22c.onrender.com/api/admin/reviews', {
        params: {
          page: currentPage,
          limit: 10,
          status: filterStatus !== 'all' ? filterStatus : undefined,
          search: searchTerm || undefined
        }
      });
      
      setReviews(response.data.reviews);
      setTotalPages(response.data.pagination.pages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
      setLoading(false);
    }
  };

  const rejectReview = async (reviewId) => {
    try {
      await axios.patch(`https://aubconnectbackend-h22c.onrender.com/api/admin/reviews/${reviewId}/reject`);
      setReviews(reviews.map(review => 
        review._id === reviewId ? { ...review, status: 'rejected' } : review
      ));
    } catch (err) {
      console.error('Error rejecting review:', err);
      setError('Failed to reject review');
    }
  };

  const approveReview = async (reviewId) => {
    try {
      await axios.patch(`https://aubconnectbackend-h22c.onrender.com/api/admin/reviews/${reviewId}/approve`);
      setReviews(reviews.map(review => 
        review._id === reviewId ? { ...review, status: 'approved' } : review
      ));
    } catch (err) {
      console.error('Error approving review:', err);
      setError('Failed to approve review');
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`https://aubconnectbackend-h22c.onrender.com/api/admin/reviews/${reviewId}`);
      setReviews(reviews.filter(review => review._id !== reviewId));
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review');
    }
  };

  if (loading && reviews.length === 0 && activeTab === 'reviews') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D0B24]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-4">
      <div className="mb-4 flex flex-col gap-2">
        <div>
          <h1 className="text-2xl font-bold text-[#6D0B24]">Review Management</h1>
          <p className="text-sm text-gray-600">
            Moderate and manage user reviews
          </p>
        </div>
        <Link
          to="/admin/dashboard"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded transition text-sm w-fit"
        >
          Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
          <p>{error}</p>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="flex space-x-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reviews'
                ? 'border-[#6D0B24] text-[#6D0B24]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Reviews
          </button>
          <button
            onClick={() => setActiveTab('reported')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reported'
                ? 'border-[#6D0B24] text-[#6D0B24]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Reported
          </button>
        </nav>
      </div>

      {activeTab === 'reviews' ? (
        <>
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow p-3 mb-4">
            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="status-filter" className="block text-xs font-medium text-gray-700 mb-1">
                  Filter by status
                </label>
                <select
                  id="status-filter"
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="block w-full pl-2 pr-8 py-1 text-xs border-gray-300 focus:outline-none focus:ring-[#6D0B24] focus:border-[#6D0B24] rounded-md"
                >
                  <option value="all">All Reviews</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label htmlFor="search" className="block text-xs font-medium text-gray-700 mb-1">
                  Search reviews
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search reviews"
                    className="focus:ring-[#6D0B24] focus:border-[#6D0B24] block w-full pl-2 pr-8 py-1 text-xs border-gray-300 rounded-md"
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <svg className="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List - Mobile Card View */}
          {isMobile ? (
            <div className="space-y-3">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="bg-white rounded-lg shadow p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{review.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{review.reviewText}</p>
                      </div>
                      <span className="text-xs text-gray-500">Rating: {review.rating}/5</span>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-900">{review.username}</span>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-2xs font-medium ${
                          review.type === 'course' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {review.type === 'course' 
                            ? (review.course ? review.course.code : 'Course') 
                            : (review.professor ? review.professor.name : 'Prof')}
                        </span>
                      </div>
                      <span className={`text-2xs px-1.5 py-0.5 rounded-full font-medium ${
                        review.status === 'approved' || !review.status || review.status === '' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {review.status === 'approved' || !review.status || review.status === '' ? 'Approved' : 'Rejected'}
                      </span>
                    </div>
                    
                    <div className="mt-3 flex justify-end space-x-2">
                      {review.status === 'rejected' && (
                        <button
                          onClick={() => approveReview(review._id)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Approve"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                      {(review.status === 'approved' || !review.status || review.status === '') && (
                        <button
                          onClick={() => rejectReview(review._id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Reject"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => deleteReview(review._id)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-4 text-center text-sm text-gray-500">
                  {error ? 'Error loading reviews' : 'No reviews found'}
                </div>
              )}
            </div>
          ) : (
            /* Desktop Table View */
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Review
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <tr key={review._id}>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">{review.title}</div>
                            <div className="text-xs text-gray-500 line-clamp-2">{review.reviewText}</div>
                            <div className="mt-1">
                              <span className="text-xs text-gray-500">Rating: {review.rating}/5</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {review.username}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {review.type === 'course' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {review.course ? review.course.code : 'Course'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {review.professor ? review.professor.name : 'Prof'}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {review.status === 'approved' || !review.status || review.status === '' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Rejected
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              {review.status === 'rejected' && (
                                <button
                                  onClick={() => approveReview(review._id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Approve"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              )}
                              {(review.status === 'approved' || !review.status || review.status === '') && (
                                <button
                                  onClick={() => rejectReview(review._id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Reject"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              )}
                              <button
                                onClick={() => deleteReview(review._id)}
                                className="text-gray-600 hover:text-gray-900"
                                title="Delete"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          {error ? 'Error loading reviews' : 'No reviews found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-2 py-3 flex items-center justify-center border-t border-gray-200">
              <nav className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-2 py-1 rounded border text-xs ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-[#6D0B24] hover:bg-gray-50'
                  }`}
                >
                  Prev
                </button>
                
                {[...Array(Math.min(5, totalPages)).keys()].map((index) => {
                  if (totalPages > 5 && currentPage > 3 && index === 0) {
                    return (
                      <button
                        key="first"
                        onClick={() => setCurrentPage(1)}
                        className={`px-2 py-1 rounded border text-xs ${
                          currentPage === 1
                            ? 'bg-[#6D0B24] text-white'
                            : 'bg-white text-[#6D0B24] hover:bg-gray-50'
                        }`}
                      >
                        1
                      </button>
                    );
                  }
                  
                  if (totalPages > 5 && currentPage > 3 && index === 1) {
                    return <span key="ellipsis1" className="px-1 text-xs">...</span>;
                  }
                  
                  const page = totalPages > 5 && currentPage > 3 
                    ? currentPage - 2 + index 
                    : index + 1;
                  
                  if (totalPages > 5 && currentPage < totalPages - 2 && index === 3) {
                    return <span key="ellipsis2" className="px-1 text-xs">...</span>;
                  }
                  
                  if (totalPages > 5 && currentPage < totalPages - 2 && index === 4) {
                    return (
                      <button
                        key="last"
                        onClick={() => setCurrentPage(totalPages)}
                        className={`px-2 py-1 rounded border text-xs ${
                          currentPage === totalPages
                            ? 'bg-[#6D0B24] text-white'
                            : 'bg-white text-[#6D0B24] hover:bg-gray-50'
                        }`}
                      >
                        {totalPages}
                      </button>
                    );
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 py-1 rounded border text-xs ${
                        currentPage === page
                          ? 'bg-[#6D0B24] text-white'
                          : 'bg-white text-[#6D0B24] hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 rounded border text-xs ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-[#6D0B24] hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <ReportedReviewsTab isMobile={isMobile} />
      )}
    </div>
  );
};

const ReportedReviewsTab = ({ isMobile }) => {
  const [reportedReviews, setReportedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReportedReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get('https://aubconnectbackend-h22c.onrender.com/api/admin/reviews/reported', {
        params: {
          page: currentPage,
          limit: 10
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setReportedReviews(response.data.reviews);
      setTotalPages(response.data.pagination.pages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reported reviews:', err);
      setError(err.response?.data?.message || 'Failed to load reported reviews');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedReviews();
  }, [currentPage]);

  const handleClearReports = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await axios.patch(
        `https://aubconnectbackend-h22c.onrender.com/api/admin/reviews/${reviewId}/clear-reports`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.message === 'Reports cleared successfully') {
        setReportedReviews(reportedReviews.filter(review => review._id !== reviewId));
        setSuccess('Reports cleared successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.data.message || 'Failed to clear reports');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error('Error clearing reports:', err);
      setError(err.response?.data?.message || 'Failed to clear reports');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRejectReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await axios.patch(
        `https://aubconnectbackend-h22c.onrender.com/api/admin/reviews/${reviewId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.message === 'Review rejected successfully') {
        setReportedReviews(reportedReviews.filter(review => review._id !== reviewId));
        setSuccess('Review rejected successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.data.message || 'Failed to reject review');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error('Error rejecting review:', err);
      setError(err.response?.data?.message || 'Failed to reject review');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading && reportedReviews.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D0B24]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Success Notification */}
      {success && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded shadow-lg flex items-center text-xs sm:text-sm">
            <svg className="h-4 w-4 text-green-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{success}</span>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded shadow-lg flex items-center text-xs sm:text-sm">
            <svg className="h-4 w-4 text-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {isMobile ? (
        /* Mobile Card View */
        <div className="space-y-3 p-2">
          {reportedReviews.length > 0 ? (
            reportedReviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{review.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{review.reviewText}</p>
                  </div>
                  <span className="text-xs text-gray-500">Rating: {review.rating}/5</span>
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-gray-900">by {review.username}</div>
                  <div className="text-xs font-medium text-red-600">
                    {review.reportCount || review.reports?.length || 0} reports
                  </div>
                </div>
                
                <div className="mt-2 space-y-1">
                  {review.reports?.slice(0, 2).map((report, i) => (
                    <div key={i} className="text-2xs text-gray-500">
                      <span className="font-medium">{report.reason}</span>: {report.details || 'No details'}
                    </div>
                  ))}
                  {review.reports?.length > 2 && (
                    <div className="text-2xs text-gray-500">+{review.reports.length - 2} more reports</div>
                  )}
                </div>
                
                <div className="mt-3 flex justify-end space-x-2">
                  <button
                    onClick={() => handleClearReports(review._id)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                    title="Clear reports"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleRejectReview(review._id)}
                    className="text-red-600 hover:text-red-900 p-1"
                    title="Reject review"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-4 text-center text-sm text-gray-500">
              {error ? 'Error loading reported reviews' : 'No reported reviews found'}
            </div>
          )}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review
                </th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reports
                </th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportedReviews.length > 0 ? (
                reportedReviews.map((review) => (
                  <tr key={review._id}>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">{review.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-2">{review.reviewText}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Rating: {review.rating}/5</span>
                        <span className="text-xs text-gray-900">by {review.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 font-medium">{review.reportCount || review.reports?.length || 0} reports</div>
                      <div className="mt-1 space-y-1">
                        {review.reports?.slice(0, 2).map((report, i) => (
                          <div key={i} className="text-xs text-gray-500">
                            <span className="font-medium">{report.reason}</span>: {report.details || 'No details provided'}
                          </div>
                        ))}
                        {review.reports?.length > 2 && (
                          <div className="text-xs text-gray-500">+{review.reports.length - 2} more reports</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleClearReports(review._id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Clear reports"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleRejectReview(review._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Reject review"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                    {error ? 'Error loading reported reviews' : 'No reported reviews found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="bg-white px-2 py-3 flex items-center justify-center border-t border-gray-200">
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-2 py-1 rounded border text-xs ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-[#6D0B24] hover:bg-gray-50'
              }`}
            >
              Prev
            </button>
            
            {[...Array(Math.min(5, totalPages)).keys()].map((index) => {
              if (totalPages > 5 && currentPage > 3 && index === 0) {
                return (
                  <button
                    key="first"
                    onClick={() => setCurrentPage(1)}
                    className={`px-2 py-1 rounded border text-xs ${
                      currentPage === 1
                        ? 'bg-[#6D0B24] text-white'
                        : 'bg-white text-[#6D0B24] hover:bg-gray-50'
                    }`}
                  >
                    1
                  </button>
                );
              }
              
              if (totalPages > 5 && currentPage > 3 && index === 1) {
                return <span key="ellipsis1" className="px-1 text-xs">...</span>;
              }
              
              const page = totalPages > 5 && currentPage > 3 
                ? currentPage - 2 + index 
                : index + 1;
              
              if (totalPages > 5 && currentPage < totalPages - 2 && index === 3) {
                return <span key="ellipsis2" className="px-1 text-xs">...</span>;
              }
              
              if (totalPages > 5 && currentPage < totalPages - 2 && index === 4) {
                return (
                  <button
                    key="last"
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-2 py-1 rounded border text-xs ${
                      currentPage === totalPages
                        ? 'bg-[#6D0B24] text-white'
                        : 'bg-white text-[#6D0B24] hover:bg-gray-50'
                    }`}
                  >
                    {totalPages}
                  </button>
                );
              }
              
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2 py-1 rounded border text-xs ${
                    currentPage === page
                      ? 'bg-[#6D0B24] text-white'
                      : 'bg-white text-[#6D0B24] hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-2 py-1 rounded border text-xs ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-[#6D0B24] hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;