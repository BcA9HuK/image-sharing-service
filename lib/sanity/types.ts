// Sanity document types

export interface SanityUser {
  _type: 'user';
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatar: string;
  createdAt: string;
}

export interface SanityImage {
  _type: 'imagePost';
  _id: string;
  title: string;
  description: string;
  image: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  author: {
    _ref: string;
    _type: 'reference';
  };
  isPublic: boolean;
  createdAt: string;
  views: number;
}

// Populated types (with references resolved)
export interface User extends Omit<SanityUser, '_type'> {}

export interface ImagePost extends Omit<SanityImage, '_type' | 'author'> {
  author: User;
}
