import Constants from "constant";

export const useIPFS = () => {
  const resolveLink = (url) => {
    if (!url || !url.includes("ipfs://")) return url;
    let linkImage = url.replace("ipfs://", "");
    let arrStr = linkImage.split("/");
    let nameImage = arrStr[1];
    const imageUrl = Constants.GOOGLE_CLOUD_STORAGE_BUCKET + nameImage;
    return imageUrl;
  };

  return { resolveLink };
};
