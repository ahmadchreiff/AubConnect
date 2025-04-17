// SearchableProfessorDropdown.jsx
import React, { useState, useEffect, useRef } from "react";

const SearchableProfessorDropdown = ({ professors, selectedProfessor, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  
  // Find the selected professor object
  const selectedProfessorObj = professors.find(prof => prof._id === selectedProfessor);
  
  // Filter professors based on search term
  const filteredProfessors = professors.filter(professor => 
    `${professor.title} ${professor.name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle professor selection
  const handleSelect = (professorId) => {
    onChange({ target: { value: professorId } }); // Changed this line
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected professor display / Search input */}
      <div 
        className="w-full border border-gray-300 rounded-md px-3 py-2 flex justify-between items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-[#860033]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-grow truncate">
          {isOpen ? (
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
              placeholder="Search professors..."
              className="w-full outline-none"
              autoFocus
            />
          ) : (
            <span className={selectedProfessor ? "text-gray-900" : "text-gray-500"}>
              {selectedProfessorObj ? `${selectedProfessorObj.title} ${selectedProfessorObj.name}` : "Select a professor"}
            </span>
          )}
        </div>
        <div className="flex-shrink-0 ml-2">
          <i className={`bx ${isOpen ? 'bx-chevron-up' : 'bx-chevron-down'} text-gray-500`}></i>
        </div>
      </div>

      {/* Dropdown options */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredProfessors.length === 0 ? (
            <div className="px-4 py-2 text-gray-500">No professors found</div>
          ) : (
            <>
              <div 
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                onClick={() => handleSelect("")}
              >
                Clear selection
              </div>
              
              {filteredProfessors.map(professor => (
                <div
                  key={professor._id}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    professor._id === selectedProfessor ? "bg-pink-50 text-[#860033]" : ""
                  }`}
                  onClick={() => handleSelect(professor._id)}
                >
                  {professor.title} {professor.name}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableProfessorDropdown;