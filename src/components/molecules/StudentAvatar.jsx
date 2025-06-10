import React from 'react';

const StudentAvatar = ({ firstName, lastName, className = '' }) => {
  const initials = `${firstName[0]}${lastName[0]}`;
  return (
    <div className={`w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center ${className}`}>
      <span className="text-white font-medium text-sm">
        {initials}
      </span>
    </div>
  );
};

export default StudentAvatar;