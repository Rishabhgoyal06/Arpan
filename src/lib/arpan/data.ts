import community from '@/assets/community.jpg';
import learning from '@/assets/learning.jpg';
import kitchen from '@/assets/kitchen.jpg';
import digital from '@/assets/digital.jpg';

export const images = { community, learning, kitchen, digital };

export type Kind = 'seva' | 'needs' | 'offers' | 'institutions';

export type Entry = {
  id: string;
  kind: Kind;
  title: string;
  context: string;
  category: string;
  location: string;
  image?: string | undefined;
  date: string;
  time: string;
  duration: string;
  organizer: string;
  spaces: number;
  recurring: boolean;
  verified: boolean;
  privacy: string;
  help: string;
};

export const categories = [
  'Teaching',
  'Food',
  'Elder Care',
  'Environment',
  'Skill Sharing',
  'Technology',
  'Education',
  'Mobility',
  'Resources',
  'Health',
  'Cleaning',
  'Cloth Donation',
  'Miscellaneous',
];
