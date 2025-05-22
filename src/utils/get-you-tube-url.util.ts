export const getYouTubeUrl = (videoId: string): string => {
  const baseUrl = 'https://youtu.be/';
  return `${baseUrl}${videoId}`;
};
