const { groupBy } = require("lodash");

const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog, {});
}

const mostBlogs = (blogs) => {
  if (!blogs.length) {
    return null;
  }

  // Reduce array authors to be an array of object containing the key as the author name and value number of blogs published by the author
  const authors = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1;
    return acc;
  }, {});

  // Set maxAuthor as the first author
  let maxAuthor = Object.keys(authors)[0];

  // Compare blogs between authors and overwrite maxAuthor every time the current author in the iteration has more than max
  for (const author in authors) {
    if (authors[author] > authors[maxAuthor]) {
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    blogs: authors[maxAuthor]
  }
}

const mostLikes = (blogs) => {
  if (!blogs.length) {
    return null;
  }

  // Reduce authors array to be an array of objects, the key is the author name, the value is number of likes for all blogs written
  const authors = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});

  // Set maxAuthor to be the first author
  let maxAuthor = Object.keys(authors)[0];

  // Compare likes between each author and overwrite maxAuthor when applicable
  for (const author in authors) {
    if (authors[author] > authors[maxAuthor]) {
      maxAuthor = author;
    }
  }

  return {
    author: maxAuthor,
    likes: authors[maxAuthor],
  }
}

const getAuthorWithMoreProperty = (blogs, property) => {
  const propertyCountByAuthor = {};
  blogs.forEach(blog => {
    const author = blog.author;
    if (propertyCountByAuthor[author]) {
      propertyCountByAuthor[author] += (property === 'likes' ? blog.likes : 1);
    } else {
      propertyCountByAuthor[author] = property === 'likes' ? blog.likes : 1;
    }
  });
 
  let maxProperty = 0;
  let authorWithMostProperty = '';
  for (const author in propertyCountByAuthor) {
    if (propertyCountByAuthor[author] > maxProperty) {
      maxProperty = propertyCountByAuthor[author];
      authorWithMostProperty = author;
    }
  }

  return {
    author: authorWithMostProperty,
    [property]: maxProperty,
  }
} 

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }