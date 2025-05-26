export const getYouTubeUrl = (videoId: string): string => {
  const baseUrl = 'https://www.youtube.com/embed/';
  return `${baseUrl}${videoId}`;
};
