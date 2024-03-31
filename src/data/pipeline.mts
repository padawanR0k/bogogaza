import { GUAK_DATA } from "./guack.mjs";

const datas = GUAK_DATA.map((country) => {
  return country.items.map((item) => {
    return {
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
      // description: item.snippet.description.replace(/\n/g, " "),
    };
  });
});

console.log((datas));
