import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from "recharts";
import "./Stat-Style.css";
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
          ? `http://localhost:5001/api/courses/${id}/reviews`
          : `http://localhost:5001/api/professors/${id}/reviews`;
          
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
    
    // Color based on rating
    const color = 
      '#860033';
    
    return (
      <div className="rating-circle" style={{ backgroundColor: color }}>
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
        username: review.username || "Anonymous",
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
    return <div className="loading-text">Loading reviews...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="statistics-dashboard">
      <Navbar/>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>{type === "course" ? "Course" : "Professor"} Review Statistics</h1>
          <p className="subtitle">Comprehensive analysis of student feedback</p>
        </div>
        
        {/* Rating Overview */}
        <div className="stats-grid">
          <div className="stat-card highlight">
            <h3>Average Rating</h3>
            <p className="section-description">Overall rating based on all reviews</p>
            <div className="big-number">{data.averageRating.toFixed(1)}</div>
            
          </div>

          <div className="stat-card">
            <h3>Total Reviews</h3>
            <p className="section-description">Number of reviews submitted</p>
            <div className="big-number">{data.totalReviews}</div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <h2>Rating Distribution</h2>
            <p className="section-description">Breakdown of star ratings given by students</p>
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
        <div className="chart-card">
          <div className="chart-header">
            <h2>Review Helpfulness</h2>
            <p className="section-description">Community votes on review usefulness</p>
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
        <div className="reviews-section">
          <div className="section-header">
            <h2>Community Highlights</h2>
            <p className="section-description">{data.totalReviews} Notable reviews from students</p>
          </div>
          
          <div className="reviews-row">
            {data.topReviews.mostUpvoted && (
              <div className="review-highlight">
                <div className="review-header">
                  <div className="review-meta">
                    <RatingCircle rating={data.topReviews.mostUpvoted.rating} />
                    <span className="review-username">
                      By {data.topReviews.mostUpvoted.username}
                    </span>
                  </div>
                  <div className="vote-count">
                    <span className="up-icon">↑</span>
                    <span>{data.topReviews.mostUpvoted.upvotesCount} upvotes</span>
                  </div>
                </div>
                <blockquote className="review-content">
                  "{data.topReviews.mostUpvoted.text}"
                </blockquote>
                <div className="review-footer">
                  <span className="highlight-tag">MOST UPVOTED</span>
                  <span className="review-date">
                    {new Date(data.topReviews.mostUpvoted.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {data.topReviews.leastUpvoted && (
              <div className="review-highlight">
                <div className="review-header">
                  <div className="review-meta">
                    <RatingCircle rating={data.topReviews.leastUpvoted.rating} />
                    <span className="review-username">
                      By {data.topReviews.leastUpvoted.username}
                    </span>
                  </div>
                  <div className="vote-count">
                    <span className="up-icon">↑</span>
                    <span>{data.topReviews.leastUpvoted.upvotesCount} upvotes</span>
                  </div>
                </div>
                <blockquote className="review-content">
                  "{data.topReviews.leastUpvoted.text}"
                </blockquote>
                <div className="review-footer">
                  <span className="lowlight-tag">LEAST UPVOTED</span>
                  <span className="review-date">
                    {new Date(data.topReviews.leastUpvoted.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="reviews-row">
            {data.topReviews.mostRecent && (
              <div className="review-highlight recent">
                <div className="review-header">
                  <div className="review-meta">
                    <RatingCircle rating={data.topReviews.mostRecent.rating} />
                    <span className="review-username">
                      By {data.topReviews.mostRecent.username}
                    </span>
                  </div>
                  <div className="vote-count">
                    <span className="up-icon">↑</span>
                    <span>{data.topReviews.mostRecent.upvotesCount} upvotes</span>
                  </div>
                </div>
                <blockquote className="review-content">
                  "{data.topReviews.mostRecent.text}"
                </blockquote>
                <div className="review-footer">
                  <span className="recent-tag">MOST RECENT</span>
                  <span className="review-date">
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