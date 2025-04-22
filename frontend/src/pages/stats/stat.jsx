import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from "recharts";
import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Stat = ({ type = "course" }) => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entityName, setEntityName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch entity name (course or professor)
        const entityEndpoint = type === "course"
          ? `https://aubconnectbackend-h22c.onrender.com/api/courses/${id}`
          : `https://aubconnectbackend-h22c.onrender.com/api/professors/${id}`;
          
        const entityResponse = await fetch(entityEndpoint);
        if (!entityResponse.ok) {
          throw new Error(`Failed to fetch ${type} details`);
        }
        const entityData = await entityResponse.json();
        setEntityName(entityData.name || entityData.title || `${type.charAt(0).toUpperCase() + type.slice(1)} #${id}`);
        
        // Fetch reviews
        const reviewsEndpoint = type === "course"
          ? `https://aubconnectbackend-h22c.onrender.com/api/courses/${id}/reviews`
          : `https://aubconnectbackend-h22c.onrender.com/api/professors/${id}/reviews`;
          
        const reviewsResponse = await fetch(reviewsEndpoint);
        if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, type]);

  // Rating circle component with animated fill
  const RatingCircle = ({ rating }) => {
    const numericRating = Math.min(5, Math.max(1, 
      typeof rating === 'string' ? parseFloat(rating) : Number(rating)
    ));
    
    return (
      <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-white border-2 border-[#860033] shadow-sm transition-all hover:shadow-md group">
        <span className="text-[#860033] font-bold text-base group-hover:scale-110 transition-transform">
          {numericRating.toFixed(1)}
        </span>
      </div>
    );
  };

  const calculateStatistics = () => {
    if (!reviews || reviews.length === 0) {
      return {
        ratingDistribution: [
          { stars: "1⭐", count: 0 },
          { stars: "2⭐", count: 0 },
          { stars: "3⭐", count: 0 },
          { stars: "4⭐", count: 0 },
          { stars: "5⭐", count: 0 }
        ],
        voteAnalysis: [
          { name: "Upvotes", value: 0 },
          { name: "Downvotes", value: 0 }
        ],
        topReviews: {
          mostUpvoted: null,
          leastUpvoted: null,
          mostRecent: null
        },
        averageRating: 0,
        totalReviews: 0
      };
    }

    // Calculate rating distribution
    const ratingCounts = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      const rating = Math.min(5, Math.max(1, Math.round(review.rating)));
      ratingCounts[rating - 1]++;
    });

    const ratingDistribution = ratingCounts.map((count, index) => ({
      stars: `${index + 1}⭐`,
      count
    }));

    // Calculate vote analysis
    let totalUpvotes = 0;
    let totalDownvotes = 0;
    reviews.forEach(review => {
      totalUpvotes += review.upvotes?.length || 0;
      totalDownvotes += review.downvotes?.length || 0;
    });

    const voteAnalysis = [
      { name: "Upvotes", value: totalUpvotes },
      { name: "Downvotes", value: totalDownvotes }
    ];

    // Find top reviews
    const sortedByUpvotes = [...reviews].sort((a, b) => 
      (b.upvotes?.length || 0) - (a.upvotes?.length || 0)
    );
    const sortedByDate = [...reviews].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    const processReview = (review) => {
      if (!review) return null;
      return {
        ...review,
        text: review.reviewText || "No review text",
        upvotesCount: review.upvotes?.length || 0,
        date: review.createdAt,
        username: review.isAnonymous ? "Anonymous" : (review.username || "Anonymous"),
        rating: review.rating || 0
      };
    };

    const topReviews = {
      mostUpvoted: processReview(sortedByUpvotes[0]),
      leastUpvoted: processReview(sortedByUpvotes[sortedByUpvotes.length - 1]),
      mostRecent: processReview(sortedByDate[0])
    };

    // Calculate average rating from valid reviews only
    const validReviews = reviews.filter(review => 
      review.rating >= 1 && review.rating <= 5
    );
    const averageRating = validReviews.length > 0 
      ? validReviews.reduce((sum, review) => sum + review.rating, 0) / validReviews.length
      : 0;

    return {
      ratingDistribution,
      voteAnalysis,
      topReviews,
      averageRating,
      totalReviews: reviews.length
    };
  };

  const data = calculateStatistics();
  const COLORS = ["#860033", "#860033cc", "#86003399", "#86003366", "#86003333"];
  const VOTE_COLORS = ["#04724D", "#860033"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 border-4 border-t-[#860033] border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center border-l-4 border-red-500">
          <p className="text-red-600 text-lg font-medium">Error: {error}</p>
          <button 
            className="mt-4 bg-[#860033] text-white px-6 py-2 rounded-md hover:bg-[#6b0029] transition-colors" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-700 font-sans bg-gray-50 overflow-x-hidden min-h-screen flex flex-col">
      <Navbar/>
      
      {/* Modern Hero Section with Entity Name */}
      <div className="bg-gradient-to-r from-[#860033] to-[#4a0a23] text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <p className="text-gray-200 font-semibold uppercase tracking-wider mb-1">
                {type === "course" ? "Course Reviews" : "Professor Reviews"}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {entityName}
              </h1>
              <div className="flex items-center mt-4">
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center">
                  <span className="text-2xl font-bold mr-2">{data.averageRating.toFixed(1)}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-xl">
                        {star <= Math.round(data.averageRating) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="ml-4 text-gray-200">
                  {data.totalReviews} {data.totalReviews === 1 ? "review" : "reviews"}
                </span>
              </div>
            </div>
            <button 
              className="bg-white text-[#860033] font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition-colors shadow-md flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Write a Review
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-5 max-w-7xl mx-auto w-full">
        {/* Rating Overview Cards - Modern Version */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-b-2 border-[#860033]">
            <div className="flex items-center mb-3">
              <div className="p-3 bg-[#860033]/10 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#860033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-700">Average Rating</h3>
                <p className="text-gray-500 text-sm">Overall student satisfaction</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-[#860033]">{data.averageRating.toFixed(1)}<span className="text-lg text-gray-500">/5</span></div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-b-2 border-[#860033]">
            <div className="flex items-center mb-3">
              <div className="p-3 bg-[#860033]/10 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#860033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-700">Total Reviews</h3>
                <p className="text-gray-500 text-sm">Student contributions</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-[#860033]">{data.totalReviews}</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-b-2 border-[#860033]">
            <div className="flex items-center mb-3">
              <div className="p-3 bg-[#860033]/10 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#860033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-700">Helpful Reviews</h3>
                <p className="text-gray-500 text-sm">Community upvotes</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-[#860033]">{data.voteAnalysis[0].value}</div>
          </div>
        </div>

        {/* Rating Distribution - Modern Version */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 transition-shadow hover:shadow-lg">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-[#860033]/10 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#860033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-xl">Rating Distribution</h2>
              <p className="text-gray-500 text-sm">Breakdown of ratings by stars</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="stars" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#860033" 
                barSize={60} 
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Upvotes vs Downvotes - Modern Version */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 transition-shadow hover:shadow-lg">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-[#860033]/10 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#860033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-xl">Review Helpfulness</h2>
              <p className="text-gray-500 text-sm">Community votes on review quality</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.voteAnalysis}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                animationDuration={1000}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {data.voteAnalysis.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={VOTE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Reviews Section - Modern Version */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 transition-shadow hover:shadow-lg">
          <div className="flex items-center mb-5">
            <div className="p-2 bg-[#860033]/10 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#860033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-xl">Notable Student Feedback</h2>
              <p className="text-gray-500 text-sm">Highlighted reviews from the community</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.topReviews.mostUpvoted && (
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all border-l-4 border-[#04724D]">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <RatingCircle rating={data.topReviews.mostUpvoted.rating} />
                    <div>
                      <p className="font-medium text-gray-800">{data.topReviews.mostUpvoted.username}</p>
                      <p className="text-gray-500 text-sm">
                        {new Date(data.topReviews.mostUpvoted.date).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center bg-green-50 py-1 px-3 rounded-full text-green-600 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span>{data.topReviews.mostUpvoted.upvotesCount}</span>
                  </div>
                </div>
                <blockquote className="text-gray-700 text-base leading-relaxed italic mb-3 line-clamp-3">
                  "{data.topReviews.mostUpvoted.text}"
                </blockquote>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-white bg-[#04724D] py-1 px-3 rounded-full text-xs font-semibold uppercase tracking-wider">
                    Most Helpful
                  </span>
                </div>
              </div>
            )}

            {data.topReviews.mostRecent && (
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all border-l-4 border-[#860033]">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <RatingCircle rating={data.topReviews.mostRecent.rating} />
                    <div>
                      <p className="font-medium text-gray-800">{data.topReviews.mostRecent.username}</p>
                      <p className="text-gray-500 text-sm">
                        {new Date(data.topReviews.mostRecent.date).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-100 py-1 px-3 rounded-full text-gray-600 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Recent</span>
                  </div>
                </div>
                <blockquote className="text-gray-700 text-base leading-relaxed italic mb-3 line-clamp-3">
                  "{data.topReviews.mostRecent.text}"
                </blockquote>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-white bg-[#860033] py-1 px-3 rounded-full text-xs font-semibold uppercase tracking-wider">
                    Latest Review
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* View All Reviews Button
          <div className="mt-6 text-center">
            <button className="inline-flex items-center justify-center px-6 py-3 border border-[#860033] text-[#860033] bg-white rounded-md font-medium hover:bg-[#860033] hover:text-white transition-colors">
              View All Reviews
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div> */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Stat;