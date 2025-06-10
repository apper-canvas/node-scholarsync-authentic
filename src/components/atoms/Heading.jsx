import React from 'react';

const Heading = ({ as: Component = 'h2', children, className = '', ...props }) => {
  const baseClasses = 'font-heading font-semibold text-surface-900';
  let sizeClass = '';

  switch (Component) {
    case 'h1':
      sizeClass = 'text-3xl font-bold';
      break;
    case 'h2':
      sizeClass = 'text-2xl';
      break;
    case 'h3':
      sizeClass = 'text-lg font-medium';
      break;
    case 'h4':
      sizeClass = 'text-md font-medium';
      break;
    default:
      sizeClass = 'text-lg';
  }

  return (
    <Component className={`${baseClasses} ${sizeClass} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default Heading;