export default function NotFound(){
  return (
    <div className="text-center py-16">
      <h1 className="text-3xl font-bold">404 - Not Found</h1>
      <p className="mt-2 text-gray-600">The page you’re looking for doesn’t exist.</p>
      <a href="/" className="btn btn-secondary mt-4">Go Home</a>
    </div>
  );
}
