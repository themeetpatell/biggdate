import { CardSkeleton } from "@/components/loading-screen";

export default function MatchesLoading() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="bd-shimmer h-7 w-36 rounded mb-2" />
      <div className="bd-shimmer h-4 w-56 rounded mb-6" />
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
