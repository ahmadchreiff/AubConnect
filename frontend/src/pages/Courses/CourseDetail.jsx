import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "boxicons/css/boxicons.min.css";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseAndReviews = async () => {
      try {
        // Fetch course details
        const courseResponse = await fetch(`http://localhost:5001/api/courses/${id}`);
        
        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course details");
        }
        
        const courseData = await courseResponse.json();
        setCourse(courseData);
        
        // Fetch reviews for this course
        const reviewsResponse = await fetch(`http://localhost:5001/api/courses/${id}/reviews`);
        
        if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch course reviews");
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

    fetchCourseAndReviews();
  }, [id]);

  // Calculate average rating
  const averageRating = reviews.length 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Unified Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#860033]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          ) : course ? (
            <>
              {/* Breadcrumb */}
              <nav className="mb-4">
                <ol className="flex text-sm">
                  <li className="flex items-center">
                    <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
                    <i className="bx bx-chevron-right text-gray-400 mx-2"></i>
                  </li>
                  <li className="flex items-center">
                    <Link to="/departments" className="text-gray-500 hover:text-gray-700">Departments</Link>
                    <i className="bx bx-chevron-right text-gray-400 mx-2"></i>
                  </li>
                  <li className="flex items-center">
                    <Link to={`/departments/${course.department._id}`} className="text-gray-500 hover:text-gray-700">
                      {course.department.code}
                    </Link>
                    <i className="bx bx-chevron-right text-gray-400 mx-2"></i>
                  </li>
                  <li className="text-gray-900 font-medium">
                    {course.courseNumber}
                  </li>
                </ol>
              </nav>

              {/* Course Header */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-[#860033]">
                      {course.department.code} {course.courseNumber}
                    </h1>
                    <h2 className="text-xl text-gray-700 mb-2">{course.name}</h2>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {course.creditHours} {course.creditHours === 1 ? "credit" : "credits"}
                      </span>
                      <Link 
                        to={`/departments/${course.department._id}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#860033] bg-opacity-10 text-[#860033]"
                      >
                        {course.department.name}
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col items-center">
                    <div className="text-4xl font-bold text-[#860033]">{averageRating}</div>
                    <div className="text-sm text-gray-500">
                      {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                    </div>
                    <Link 
  to={`/courses/${id}/stat`}  // change done HERE!!
  className="text-gray-500 text-xs underline hover:text-gray-700 m-0 p-0"
>
  more statistics
</Link>

                    <Link
                      to={`/reviews/new?type=course&id=${course._id}`}
                      className="mt-3 bg-[#860033] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#6a0026] transition-all duration-200"
                    >
                      Write a Review
                    </Link>
                  </div>
                </div>

                {/* Course Description & Details */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  {course.description && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Course Description</h3>
                      <p className="text-gray-700">{course.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {course.prerequisites && course.prerequisites.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Prerequisites</h3>
                        <ul className="list-disc list-inside text-gray-700">
                          {course.prerequisites.map((prereq, index) => (
                            <li key={index}>{prereq}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {course.corequisites && course.corequisites.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Corequisites</h3>
                        <ul className="list-disc list-inside text-gray-700">
                          {course.corequisites.map((coreq, index) => (
                            <li key={index}>{coreq}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {course.syllabus && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">Syllabus</h3>
                      <div className="p-4 bg-gray-50 rounded border border-gray-200">
                        <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm">
                          {course.syllabus}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this course!</p>
                    <Link
                      to={`/reviews/new?type=course&id=${course._id}`}
                      className="inline-block bg-[#860033] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#6a0026] transition-all duration-200"
                    >
                      Write a Review
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="bg-[#860033] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                              {review.rating}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm text-gray-500">Posted by</div>
                              <div className="font-medium">{review.username}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.reviewText}</p>
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                          <button className="flex items-center hover:text-[#860033]">
                            <i className="bx bx-like mr-1"></i>
                            <span>{review.upvotes.length}</span>
                          </button>
                          <button className="flex items-center ml-4 hover:text-[#860033]">
                            <i className="bx bx-dislike mr-1"></i>
                            <span>{review.downvotes.length}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-lg text-gray-600">Course not found</p>
            </div>
          )}
        </div>
      </main>

      {/* Unified Footer */}
      <Footer />
    </div>
  );
};

export default CourseDetail;