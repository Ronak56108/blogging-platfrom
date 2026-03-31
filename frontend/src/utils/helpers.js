export const calculateReadingTime = (text) => {
  if (!text) return '1 min read';
  const wordsPerMinute = 200;
  // Remove HTML tags to count actual words accurately
  const textWithoutTags = text.replace(/<[^>]*>?/gm, '');
  const noOfWords = textWithoutTags.split(/\s+/).filter(word => word.length > 0).length;
  const minutes = Math.ceil(noOfWords / wordsPerMinute);
  return `${minutes} min read`;
};
