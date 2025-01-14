const allWeights = [
  { thumbnail: "/src/assets/weight/1.svg" },
  { thumbnail: "/src/assets/weight/2.svg" },
  { thumbnail: "/src/assets/weight/3.svg" },
  { thumbnail: "/src/assets/weight/4.svg" },
  { thumbnail: "/src/assets/weight/5.svg" },
  { thumbnail: "/src/assets/weight/6.svg" },
  { thumbnail: "/src/assets/weight/7.svg" },
  { thumbnail: "/src/assets/weight/8.svg" },
  { thumbnail: "/src/assets/weight/9.svg" },
  { thumbnail: "/src/assets/weight/10.svg" },
  { thumbnail: "/src/assets/weight/11.svg" },
  { thumbnail: "/src/assets/weight/12.svg" },
  { thumbnail: "/src/assets/weight/13.svg" },
  { thumbnail: "/src/assets/weight/14.svg" },
  { thumbnail: "/src/assets/weight/15.svg" },
  { thumbnail: "/src/assets/weight/16.svg" },
  { thumbnail: "/src/assets/weight/17.svg" },
  { thumbnail: "/src/assets/weight/morality.svg" },
  { thumbnail: "/src/assets/weight/intelligence.svg" },
  { thumbnail: "/src/assets/weight/physique.svg" },
  { thumbnail: "/src/assets/weight/social-skills.svg" },
  { thumbnail: "/src/assets/weight/aesthetics.svg" },
  { thumbnail: "/src/assets/weight/people.svg" },
  { thumbnail: "/src/assets/weight/culture.svg" },
  { thumbnail: "/src/assets/weight/place.svg" },
  { thumbnail: "/src/assets/weight/specialty.svg" },
  { thumbnail: "/src/assets/weight/landscape.svg" },
];

const generateSdgsIcons = (weight) => {
  if (!weight) return null;

  return weight.split(",").map((w, index) => {
    if (parseInt(w) === 1 && allWeights[index]) {
      const iconInfo = allWeights[index];
      return (
        <div key={index} className="w-12 h-12 p-1 flex-shrink-0">
          <a href="#" className="block w-full h-full no-underline">
            <img
              className="w-full h-full object-contain"
              src={iconInfo.thumbnail}
              alt=""
            />
          </a>
        </div>
      );
    }
    return null;
  });
};

export default generateSdgsIcons;
