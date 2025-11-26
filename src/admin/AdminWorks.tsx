import { useState } from 'react';
import Card from '@/components/cards/RecentCards';

interface WorkItem {
  id: string;
  image: string;
  description: string;
}

const AdminWorks = () => {
  const [works, setWorks] = useState<WorkItem[]>([
    { id: '1', image: '/placeholder-1.jpg', description: 'Description' },
    { id: '2', image: '/placeholder-2.jpg', description: 'Description' },
    { id: '3', image: '/placeholder-3.jpg', description: 'Description' },
    { id: '4', image: '/placeholder-4.jpg', description: 'Description' },
    { id: '5', image: '/placeholder-5.jpg', description: 'Description' },
    { id: '6', image: '/placeholder-6.jpg', description: 'Description' },
    { id: '7', image: '/placeholder-7.jpg', description: 'Description' },
    { id: '8', image: '/placeholder-8.jpg', description: 'Description' },
  ]);

  const handleCardClick = (id: string) => {
    console.log('Card clicked:', id);
    // Handle edit/delete functionality
  };

  const handleAddNew = () => {
    const newWork: WorkItem = {
      id: Date.now().toString(),
      image: '/placeholder-new.jpg',
      description: 'New Description',
    };
    setWorks([...works, newWork]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Admin Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Works</h1>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Add New Work
          </button>
        </div>

        {/* Works Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {works.map((work) => (
            <Card
              key={work.id}
              image={work.image}
              description={work.description}
              onClick={() => handleCardClick(work.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminWorks;

