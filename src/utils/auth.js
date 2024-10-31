export const isAuthenticated = () => {
  // Check if user is authenticated
  const token = localStorage.getItem('token');
  return !!token;
}; 