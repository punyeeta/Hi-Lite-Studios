import BorderStar from '@/assets/images/BorderStar.png';

export default function InfiniteStrip() {
  const items = ["Capture", "Photography", "Stories", "Trusted", "Moments"];

  const createItem = (item: string, index: number) => (
    <div key={index} className="flex items-center shrink-0">
      <span className="text-white text-sm font-medium whitespace-nowrap px-6">{item}</span>
      <img src={BorderStar} alt="star" className="w-4 h-4 shrink-0 ml-2" />
    </div>
  );

  const allItems = [...items, ...items, ...items].map((item, idx) =>
    createItem(item, idx)
  );

  return (
    <div className="w-screen overflow-x-hidden bg-linear-to-r from-blue-950 to-indigo-700 py-2 relative left-1/2 -translate-x-1/2">
      <div className="flex whitespace-nowrap animate-strip">    
        {allItems}
      </div>
    </div>
  );
}