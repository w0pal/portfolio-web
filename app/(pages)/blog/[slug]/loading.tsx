export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="animate-pulse">
        {/* Back button skeleton */}
        <div className="h-6 w-24 bg-gray-200 dark:bg-slate-700 rounded mb-8"></div>

        {/* Title skeleton */}
        <div className="h-10 w-3/4 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
        <div className="h-10 w-1/2 bg-gray-200 dark:bg-slate-700 rounded mb-8"></div>

        {/* Meta info skeleton */}
        <div className="flex gap-4 mb-8">
          <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded"></div>
        </div>

        {/* Image skeleton */}
        <div className="w-full h-64 md:h-96 bg-gray-200 dark:bg-slate-700 rounded-lg mb-12"></div>

        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 w-4/6 bg-gray-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}
