const videoExtensions = ['.mp4', '.mov', '.avi', '.webm'];

export const isVideo = (url) => videoExtensions.some(ext => url.toLowerCase().includes(ext));

export const isImage = (url) => !isVideo(url);
