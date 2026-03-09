// GROQ queries for Sanity

export const queries = {
  // User queries
  getUserById: `*[_type == "user" && _id == $userId][0]`,
  getUserByEmail: `*[_type == "user" && email == $email][0]`,
  getUserByUsername: `*[_type == "user" && username == $username][0]`,

  // Image queries
  getImageById: `*[_type == "imagePost" && _id == $imageId][0]{
    ...,
    author->
  }`,
  
  getPublicImages: `*[_type == "imagePost" && isPublic == true] | order(createdAt desc) [$offset...$limit]{
    ...,
    author->
  }`,
  
  getUserImages: `*[_type == "imagePost" && author._ref == $userId] | order(createdAt desc){
    ...,
    author->
  }`,
  
  getUserPublicImages: `*[_type == "imagePost" && author._ref == $userId && isPublic == true] | order(createdAt desc){
    ...,
    author->
  }`,
};
