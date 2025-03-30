import React from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from "recharts";
import "./Stat-Style.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Statistics = () => {
    
  // Sample data will remove later 
  const data = {
    ratingDistribution: [
      { stars: "1⭐", count: 5 },
      { stars: "2⭐", count: 8 },
      { stars: "3⭐", count: 15 },
      { stars: "4⭐", count: 40 },
      { stars: "5⭐", count: 60 }
    ],
    voteAnalysis: [
      { name: "Upvotes", value: 200 },
      { name: "Downvotes", value: 50 }
    ],
    topReviews: {
      mostUpvoted: {
        text: "This professor explains concepts clearly and grades fairly. Highly recommend!",
        rating: 5,
        upvotes: 85,
        date: "2023-11-10"
      },
      leastUpvoted: {
        text: "Lecture materials felt outdated and exams were unreasonably difficult.",
        rating: 2,
        upvotes: 3,
        date: "2023-09-05"
      },
      mostRecent: {
        text: "The course structure improved significantly with better-organized materials this semester.",
        rating: 4,
        upvotes: 42,
        date: "2024-02-15"
      }
    },
    averageRating: 4.2,
    totalReviews: 160
  };

  const COLORS = ["#8eceff", "#b897d3"]; 

  return (
    <div className="statistics-dashboard">
        <Navbar/>
        <div className="elements">
      <div className="dashboard-header">
        <h1>Review Statistics</h1>
        <p className="subtitle">Comprehensive analysis of student feedback and ratings</p>
      </div>
      
      {/* Rating Overview */}
      <div className="stats-grid">
        <div className="stat-card highlight">
          <h3>Average Rating</h3>
          <p className="section-description">Overall rating based on all reviews</p>
          <div className="big-number">{data.averageRating.toFixed(1)}</div>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(data.averageRating) ? "filled" : ""}>
                ★
              </span>
            ))}
          </div>
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
            <Tooltip 
              formatter={(value) => [
                <span style={{ color: "#808080" }}>{value}</span>,
                "Count"
              ]}
              labelStyle={{ color: "#808080" }}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px"
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#b897d3"
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
            <Tooltip formatter={(value) => [`${value} votes`, '']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Reviews Section */}
      <div className="reviews-section">
        <div className="section-header">
          <h2>Community Highlights</h2>
          <p className="section-description">Notable reviews from students</p>
        </div>
        
        {/* Top and Bottom Reviews Row */}
        <div className="reviews-row">
          <div className="review-highlight">
            <div className="review-header">
              <div className="rating-badge">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < data.topReviews.mostUpvoted.rating ? "filled" : ""}>
                    ★
                  </span>
                ))}
              </div>
              <div className="vote-count">
                <span className="up-icon">↑</span>
                <span>{data.topReviews.mostUpvoted.upvotes} upvotes</span>
              </div>
            </div>
            <blockquote className="review-content">
              "{data.topReviews.mostUpvoted.text}"
            </blockquote>
            <div className="review-footer">
              <span className="highlight-tag">HIGHEST RATED</span>
              <span className="review-date">
                {new Date(data.topReviews.mostUpvoted.date).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="review-highlight">
            <div className="review-header">
              <div className="rating-badge">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < data.topReviews.leastUpvoted.rating ? "filled" : ""}>
                    ★
                  </span>
                ))}
              </div>
              <div className="vote-count">
                <span className="up-icon">↑</span>
                <span>{data.topReviews.leastUpvoted.upvotes} upvotes</span>
              </div>
            </div>
            <blockquote className="review-content">
              "{data.topReviews.leastUpvoted.text}"
            </blockquote>
            <div className="review-footer">
              <span className="lowlight-tag">LOWEST RATED</span>
              <span className="review-date">
                {new Date(data.topReviews.leastUpvoted.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Most Recent Review (placed below) */}
        <div className="reviews-row">
          <div className="review-highlight recent">
            <div className="review-header">
              <div className="rating-badge">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < data.topReviews.mostRecent.rating ? "filled" : ""}>
                    ★
                  </span>
                ))}
              </div>
              <div className="vote-count">
                <span className="up-icon">↑</span>
                <span>{data.topReviews.mostRecent.upvotes} upvotes</span>
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
        </div>
      </div>
      </div>
      <Footer />
    </div>
     
  );
};

export default Statistics;