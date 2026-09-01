const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const getImageUrl = (imagePath: string) => {
  return new URL(imagePath, SERVER_URL).toString();
};
