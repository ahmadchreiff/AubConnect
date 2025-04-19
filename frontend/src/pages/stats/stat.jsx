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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const endpoint = type === "course"
          ? `https://aubconnectbackend-h22c.onrender.com/api/courses/${id}/reviews`
          : `https://aubconnectbackend-h22c.onrender.com/api/professors/${id}/reviews`;
          
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [id, type]);

  // Rating circle component
  const RatingCircle = ({ rating }) => {
    const numericRating = Math.min(5, Math.max(1, 
      typeof rating === 'string' ? parseFloat(rating) : Number(rating)
    ));
    
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm my-2.5" style={{ backgroundColor: '#860033' }}>
        {numericRating.toFixed(1)}
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
  const COLORS = ["rgba(0, 0, 0, 0.573)", "#860033d7"];

  if (loading) {
    return <div className="text-center p-10">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-10 text-center text-lg">Error: {error}</div>;
  }

  return (
    <div className="text-gray-700 max-w-screen-xl font-sans bg-gray-50 overflow-x-hidden min-h-screen flex flex-col">
      <Navbar/>
      <div className="flex-1 p-5 max-w-screen-xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-[#860033] font-bold text-5xl mb-2">{type === "course" ? "Course" : "Professor"} Review Statistics</h1>
          <p className="text-gray-600">Comprehensive analysis of student feedback</p>
        </div>
        
        {/* Rating Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="bg-white rounded-lg shadow-md p-5 text-center border-l-4 border-[#860033] transition-transform">
            <h3 className="font-bold">Average Rating</h3>
            <p className="text-gray-600 text-sm">Overall rating based on all reviews</p>
            <div className="text-4xl font-bold text-gray-800 my-3">{data.averageRating.toFixed(1)}</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5 text-center border-l-4 border-[#860033] transition-transform">
            <h3 className="font-bold">Total Reviews</h3>
            <p className="text-gray-600 text-sm">Number of reviews submitted</p>
            <div className="text-4xl font-bold text-gray-800 my-3">{data.totalReviews}</div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-8 w-full md:w-4/5 mx-auto transition-transform">
          <div>
            <h2 className="font-bold text-[#860033] font-serif text-xl">Rating Distribution</h2>
            <p className="text-gray-600 text-sm mt-0">Breakdown of star ratings given by students</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stars" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="count" 
                fill="rgba(0, 0, 0, 0.573)"
                barSize={100} 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Upvotes vs Downvotes */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-8 w-full md:w-4/5 mx-auto transition-transform">
          <div>
            <h2 className="font-bold text-[#860033] font-serif text-xl">Review Helpfulness</h2>
            <p className="text-gray-600 text-sm mt-0">Community votes on review usefulness</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.voteAnalysis}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.voteAnalysis.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <div className="mb-5">
            <h2 className="font-bold text-[#860033] font-serif text-xl">Community Highlights</h2>
            <p className="text-gray-600 text-sm mt-0">{data.totalReviews} Notable reviews from students</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.topReviews.mostUpvoted && (
              <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-[#860033] transition-all">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2.5">
                    <RatingCircle rating={data.topReviews.mostUpvoted.rating} />
                    <span className="text-gray-600 text-sm">
                      By {data.topReviews.mostUpvoted.username}
                    </span>
                  </div>
                  <div className="flex items-center bg-gray-100 py-1 px-2.5 rounded-full font-semibold text-sm">
                    <span className="text-green-600 text-lg mr-1">↑</span>
                    <span>{data.topReviews.mostUpvoted.upvotesCount} upvotes</span>
                  </div>
                </div>
                <blockquote className="text-gray-600 text-base leading-relaxed m-0 p-0">
                  "{data.topReviews.mostUpvoted.text}"
                </blockquote>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-white bg-[#860033] py-1 px-2.5 rounded-full text-xs font-semibold uppercase tracking-wider">MOST UPVOTED</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(data.topReviews.mostUpvoted.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {data.topReviews.leastUpvoted && (
              <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-[#860033] transition-all">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2.5">
                    <RatingCircle rating={data.topReviews.leastUpvoted.rating} />
                    <span className="text-gray-600 text-sm">
                      By {data.topReviews.leastUpvoted.username}
                    </span>
                  </div>
                  <div className="flex items-center bg-gray-100 py-1 px-2.5 rounded-full font-semibold text-sm">
                    <span className="text-green-600 text-lg mr-1">↑</span>
                    <span>{data.topReviews.leastUpvoted.upvotesCount} upvotes</span>
                  </div>
                </div>
                <blockquote className="text-gray-600 text-base leading-relaxed m-0 p-0">
                  "{data.topReviews.leastUpvoted.text}"
                </blockquote>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-white bg-[#860033] py-1 px-2.5 rounded-full text-xs font-semibold uppercase tracking-wider">LEAST UPVOTED</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(data.topReviews.leastUpvoted.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5">
            {data.topReviews.mostRecent && (
              <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-[#860033] transition-all col-span-full">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2.5">
                    <RatingCircle rating={data.topReviews.mostRecent.rating} />
                    <span className="text-gray-600 text-sm">
                      By {data.topReviews.mostRecent.username}
                    </span>
                  </div>
                  <div className="flex items-center bg-gray-100 py-1 px-2.5 rounded-full font-semibold text-sm">
                    <span className="text-green-600 text-lg mr-1">↑</span>
                    <span>{data.topReviews.mostRecent.upvotesCount} upvotes</span>
                  </div>
                </div>
                <blockquote className="text-gray-600 text-base leading-relaxed m-0 p-0">
                  "{data.topReviews.mostRecent.text}"
                </blockquote>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-white bg-[#860033] py-1 px-2.5 rounded-full text-xs font-semibold uppercase tracking-wider">MOST RECENT</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(data.topReviews.mostRecent.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Stat;