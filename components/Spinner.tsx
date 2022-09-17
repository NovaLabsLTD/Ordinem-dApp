const Spinner = () => (
  <div className="flex justify-center items-center">
    <div
      className="border-blue-500 border-r-transparent animate-spin inline-block w-6 h-6 border-4 rounded-full"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

export default Spinner;
