import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  animate?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  width = '100%',
  height = '1rem',
  rounded = false,
  animate = true
}) => {
  const baseClasses = 'bg-gray-200';
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';
  const animateClasses = animate ? 'animate-pulse' : '';
  
  return (
    <div
      className={`${baseClasses} ${roundedClasses} ${animateClasses} ${className}`}
      style={{ width, height }}
    />
  );
};

// Book Card Skeleton
export const BookCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
      <div className="flex items-start space-x-4">
        <SkeletonLoader width={60} height={80} className="rounded" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader height="1.25rem" width="80%" />
          <SkeletonLoader height="1rem" width="60%" />
          <SkeletonLoader height="0.875rem" width="40%" />
        </div>
      </div>
    </div>
  );
};

// List Item Skeleton
export const ListItemSkeleton: React.FC = () => {
  return (
    <div className="list-group-item animate-pulse">
      <div className="d-flex align-items-start">
        <SkeletonLoader width={60} height={80} className="rounded me-3" />
        <div className="flex-1">
          <div className="d-flex align-items-center mb-2">
            <SkeletonLoader height="1.25rem" width="200px" className="me-2" />
            <SkeletonLoader width={80} height={24} className="rounded-pill" />
          </div>
          <SkeletonLoader height="1rem" width="150px" className="mb-1" />
          <SkeletonLoader height="0.875rem" width="100px" />
        </div>
      </div>
    </div>
  );
};

// Table Row Skeleton
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index}>
          <SkeletonLoader height="1rem" width="80%" />
        </td>
      ))}
    </tr>
  );
};

// Form Field Skeleton
export const FormFieldSkeleton: React.FC = () => {
  return (
    <div className="mb-3 animate-pulse">
      <SkeletonLoader height="1rem" width="100px" className="mb-2" />
      <SkeletonLoader height="2.5rem" width="100%" className="rounded" />
    </div>
  );
};

// Dashboard Stats Skeleton
export const DashboardStatsSkeleton: React.FC = () => {
  return (
    <div className="row animate-pulse">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="col-md-3 mb-4">
          <div className="card">
            <div className="card-body text-center">
              <SkeletonLoader width={40} height={40} className="rounded-circle mx-auto mb-2" />
              <SkeletonLoader height="1.5rem" width="60px" className="mx-auto mb-1" />
              <SkeletonLoader height="1rem" width="80px" className="mx-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Pagination Skeleton
export const PaginationSkeleton: React.FC = () => {
  return (
    <nav className="d-flex justify-content-center animate-pulse">
      <div className="d-flex gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonLoader key={index} width={40} height={40} className="rounded" />
        ))}
      </div>
    </nav>
  );
};

// Loading Spinner Component
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string }> = ({ 
  size = 'md', 
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-4">
      <div className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizeClasses[size]}`}></div>
      {text && <p className="text-muted mt-2 mb-0">{text}</p>}
    </div>
  );
};

export default SkeletonLoader;
