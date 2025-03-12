import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "boxicons/css/boxicons.min.css";

const Homepage = () => {
  const [userName, setUserName] = useState("Loading...");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseQuery, setCourseQuery] = useState("");
  const [activeTab, setActiveTab] = useState("recent");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      course: "CMPS 202",
      professor: "Dr. Smith",
      rating: 4,
      likes: 24,
      comments: 7,
      timestamp: "2 hours ago",
      text: "Great course! The professor explains complex concepts in a way that's easy to understand. The assignments were challenging but fair, and the material covered was relevant to current industry practices. I particularly enjoyed the group project in the second half of the semester.",
      userImg: "/api/placeholder/40/40"
    },
    {
      id: 2,
      course: "ECON 211",
      professor: "Dr. Johnson",
      rating: 5,
      likes: 36,
      comments: 12,
      timestamp: "Yesterday",
      text: "Absolutely loved this class! Dr. Johnson is passionate about economics and it really shows in her teaching. The course structure was excellent and the discussions were always engaging and thought-provoking.",
      userImg: "/api/placeholder/40/40"
    },
    {
      id: 3,
      course: "BIOL 201",
      professor: "Dr. Garcia",
      rating: 3,
      likes: 9,
      comments: 4,
      timestamp: "3 days ago",
      text: "The content was interesting, but the pace was a bit too fast. Lab sessions were well organized though and helped reinforce lecture material. Would recommend taking with some background in biology.",
      userImg: "/api/placeholder/40/40"
    }
  ]);

  const [trending, setTrending] = useState([
    { id: 1, name: "CMPS 200", count: 28 },
    { id: 2, name: "ENGL 203", count: 22 },
    { id: 3, name: "PHYS 210", count: 19 },
    { id: 4, name: "MATH 201", count: 17 },
    { id: 5, name: "BUSS 215", count: 14 }
  ]);

  useEffect(() => {
    // Simulating API call to fetch user data
    const fetchUserName = async () => {
      try {
        // Replace with actual API endpoint
        // const response = await fetch("/api/user");
        // const data = await response.json();
        // setUserName(data.name);
        
        // Simulated response
        setTimeout(() => {
          setUserName("USERNAME");
        }, 1000);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserName("Guest");
      }
    };

    fetchUserName();
  }, []);

  // Star rating component
  const StarRating = ({ rating }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <i 
            key={i} 
            className={`bx ${i < rating ? 'bxs-star' : 'bx-star'} ${i < rating ? 'text-amber-400' : 'text-gray-300'}`}
          ></i>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-[#6D0B24] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 mr-2">
                  <svg viewBox="0 0 100 100" className="h-full w-full fill-current text-white">
                    <path d="M50,15 C35,15 25,25 25,40 C25,50 30,55 40,65 C45,70 50,85 50,85 C50,85 55,70 60,65 C70,55 75,50 75,40 C75,25 65,15 50,15 Z"></path>
                  </svg>
                </div>
                <span className="font-serif text-xl tracking-tight">AubConnect</span>
              </div>
            </div>

            {/* Search bar */}
            <div className={`hidden md:flex flex-1 max-w-xl mx-8 relative ${isSearchFocused ? 'z-20' : ''}`}>
              <div className="w-full">
                <div className="relative group w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="bx bx-search text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="Search courses or professors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    className="block w-full pl-10 pr-3 py-2 border border-transparent bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
                  />
                </div>

                {/* Search dropdown */}
                {isSearchFocused && (
                  <div className="absolute mt-1 w-full bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="font-medium text-sm text-gray-600">Recent Searches</div>
                    </div>
                    <div className="px-2">
                      <Link to="/search?q=CMPS" className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        <i className="bx bx-history text-gray-500 mr-2"></i>
                        CMPS 200
                      </Link>
                      <Link to="/search?q=ENGL" className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        <i className="bx bx-history text-gray-500 mr-2"></i>
                        ENGL 203
                      </Link>
                      <div className="border-t border-gray-100 mx-2 my-1"></div>
                      <Link to="/advanced-search" className="flex items-center px-2 py-2 text-sm text-[#6D0B24] hover:bg-gray-50 rounded-md">
                        <i className="bx bx-search-alt text-[#6D0B24] mr-2"></i>
                        Advanced Search
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center gap-1 sm:gap-3">
              <Link to="/reviews/new" className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-r from-[#6D0B24] to-[#9a0c33] hover:shadow-lg transition-all duration-300">
                <span className="relative px-3 py-2 transition-all ease-in duration-75 bg-white/10 backdrop-blur-sm rounded-md group-hover:bg-opacity-0 flex items-center">
                  <i className="bx bx-plus mr-1 hidden sm:inline-block"></i>
                  <span className="hidden sm:inline-block">Post Review</span>
                  <span className="sm:hidden">Post</span>
                </span>
              </Link>
              
              <Link to="/notifications" className="p-2 text-white rounded-full hover:bg-white/10 transition-colors relative">
                <i className="bx bx-bell text-xl"></i>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
              
              <div className="relative ml-1">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center text-sm rounded-full focus:outline-none p-1 hover:bg-white/10 transition-colors"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                    <img src="/api/placeholder/40/40" alt="user" className="h-full w-full object-cover" />
                  </div>
                </button>
                
                {showProfileMenu && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-100">
                      <div className="font-semibold">{userName}</div>
                      <div className="text-xs text-gray-500">student@mail.aub.edu</div>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                    <Link to="/saved" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Saved Reviews</Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</Link>
                    <div className="border-t border-gray-100"></div>
                    <Link to="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Sign out</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile search - visible only on small screens */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="bx bx-search text-gray-400"></i>
            </div>
            <input
              type="text"
              placeholder="Search courses or professors"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D0B24]/30 focus:border-[#6D0B24] transition-all"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 md:flex-shrink-0 border-r border-gray-200 bg-white">
          <div className="p-4 md:p-6 md:sticky md:top-16">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                  <img src="/api/placeholder/60/60" alt="user" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{userName}</h2>
                  <p className="text-sm text-gray-500">Computer Science</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <Link to="/profile" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  <i className="bx bx-user text-gray-500 mr-3 text-lg"></i>
                  <span>Profile</span>
                </Link>
                <Link to="/saved" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  <i className="bx bx-bookmark text-gray-500 mr-3 text-lg"></i>
                  <span>Saved Reviews</span>
                </Link>
                <Link to="/my-reviews" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  <i className="bx bx-pencil text-gray-500 mr-3 text-lg"></i>
                  <span>My Reviews</span>
                </Link>
                <Link to="/settings" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  <i className="bx bx-cog text-gray-500 mr-3 text-lg"></i>
                  <span>Settings</span>
                </Link>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-3 font-semibold">Trending Courses</h3>
              <div className="space-y-2">
                {trending.map(course => (
                  <Link key={course.id} to={`/course/${course.id}`} className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                    <span>{course.name}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#6D0B24]/10 text-[#6D0B24]">
                      {course.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
                <div className="text-xs bg-[#6D0B24]/10 text-[#6D0B24] px-2 py-0.5 rounded-full font-medium">Beta</div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveTab('recent')}
                  className={`px-3 py-1.5 text-sm rounded-lg ${activeTab === 'recent' ? 'bg-[#6D0B24] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  Recent
                </button>
                <button 
                  onClick={() => setActiveTab('popular')}
                  className={`px-3 py-1.5 text-sm rounded-lg ${activeTab === 'popular' ? 'bg-[#6D0B24] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  Popular
                </button>
                <button 
                  onClick={() => setActiveTab('following')}
                  className={`px-3 py-1.5 text-sm rounded-lg ${activeTab === 'following' ? 'bg-[#6D0B24] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  Following
                </button>
              </div>
            </div>
            
            {/* Reviews Feed */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white shadow rounded-xl overflow-hidden">
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="mr-3">
                          <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
                            <img src={review.userImg} alt="User" className="h-full w-full object-cover" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{review.course}</h3>
                          <div className="flex items-center text-sm text-gray-500 space-x-2">
                            <span>{review.professor}</span>
                            <span>•</span>
                            <span>{review.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-2">
                          <StarRating rating={review.rating} />
                        </div>
                        <button className="text-gray-400 hover:text-gray-500">
                          <i className="bx bx-dots-horizontal-rounded"></i>
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-700 leading-relaxed">{review.text}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button className="flex items-center text-gray-500 hover:text-[#6D0B24] transition-colors">
                          <i className="bx bx-like mr-1.5"></i>
                          <span className="text-sm">{review.likes}</span>
                        </button>
                        <button className="flex items-center text-gray-500 hover:text-[#6D0B24] transition-colors">
                          <i className="bx bx-comment mr-1.5"></i>
                          <span className="text-sm">{review.comments}</span>
                        </button>
                        <button className="flex items-center text-gray-500 hover:text-[#6D0B24] transition-colors">
                          <i className="bx bx-share-alt mr-1.5"></i>
                        </button>
                      </div>
                      <Link to={`/review/${review.id}`} className="text-sm text-[#6D0B24] hover:text-[#9a0c33] font-medium transition-colors">
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Load More Button */}
              <div className="mt-6 text-center">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                  Load More Reviews
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-1 text-[#6D0B24]">
              <div className="h-8 w-8">
                <svg viewBox="0 0 100 100" className="h-full w-full fill-current">
                  <path d="M50,15 C35,15 25,25 25,40 C25,50 30,55 40,65 C45,70 50,85 50,85 C50,85 55,70 60,65 C70,55 75,50 75,40 C75,25 65,15 50,15 Z"></path>
                </svg>
              </div>
              <span className="font-serif text-lg">AubConnect</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link to="/about" className="text-sm text-gray-500 hover:text-gray-900">About</Link>
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy</Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms</Link>
              <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900">Contact</Link>
            </div>
            
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} American University of Beirut
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;