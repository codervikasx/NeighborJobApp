
import React from 'react';
import { JobCategory, Job, JobStatus } from './types';
import { Wrench, Dog, Trash2, Truck, Heart, ShoppingBag } from 'lucide-react';

export const CATEGORY_ICONS = {
  [JobCategory.CLEANING]: <Trash2 size={20} />,
  [JobCategory.PET_CARE]: <Dog size={20} />,
  [JobCategory.MOVING]: <Truck size={20} />,
  [JobCategory.REPAIRS]: <Wrench size={20} />,
  [JobCategory.ELDERLY_AID]: <Heart size={20} />,
  [JobCategory.GROCERIES]: <ShoppingBag size={20} />,
};

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Walk my Golden Retriever',
    description: 'Looking for someone to walk Buddy for 30 mins. He is very friendly!',
    category: JobCategory.PET_CARE,
    price: 15,
    seekerId: 'u1',
    seekerName: 'Sarah Jenkins',
    seekerAvatar: 'https://picsum.photos/seed/sarah/100/100',
    status: JobStatus.OPEN,
    urgency: 'Medium',
    distance: 250,
    createdAt: new Date().toISOString(),
    location: { lat: 0.001, lng: 0.001 }
  },
  {
    id: '2',
    title: 'Fix leaky kitchen faucet',
    description: 'The faucet in my kitchen has been dripping all night. Need a quick fix.',
    category: JobCategory.REPAIRS,
    price: 45,
    seekerId: 'u2',
    seekerName: 'David Chen',
    seekerAvatar: 'https://picsum.photos/seed/david/100/100',
    status: JobStatus.OPEN,
    urgency: 'High',
    distance: 600,
    createdAt: new Date().toISOString(),
    location: { lat: -0.002, lng: 0.003 }
  },
  {
    id: '3',
    title: 'Help moving couch to 3rd floor',
    description: 'Just need one extra set of hands for 15 minutes to carry a small sofa.',
    category: JobCategory.MOVING,
    price: 25,
    seekerId: 'u3',
    seekerName: 'Michael Scott',
    seekerAvatar: 'https://picsum.photos/seed/michael/100/100',
    status: JobStatus.OPEN,
    urgency: 'Medium',
    distance: 850,
    createdAt: new Date().toISOString(),
    location: { lat: 0.004, lng: -0.002 }
  }
];

export const CURRENT_USER = {
  id: 'me',
  name: 'Alex Rivera',
  avatar: 'https://picsum.photos/seed/alex/100/100',
  rating: 4.9,
  reviews: 12,
  isProvider: true
};
