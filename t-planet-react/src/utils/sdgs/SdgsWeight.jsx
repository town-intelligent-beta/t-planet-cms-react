import React, { useEffect, useState } from "react";

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
];

const isOverflow = (element) => {
  return element.scrollHeight > element.clientHeight;
};

const SdgsWeight = ({ data }) => {
  const [modalContent, setModalContent] = useState({ title: "", body: "" });

  useEffect(() => {
    const handleResize = () => {
      document.querySelectorAll(".sdg-text").forEach((element) => {
        const readMore = element.nextElementSibling; // 「Read more」按鈕
        if (isOverflow(element)) {
          readMore.style.display = "block";
        } else {
          readMore.style.display = "none";
        }
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // 初始化檢查溢出狀態
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!data) return null;

  const sdgsItems = Object.entries(JSON.parse(data))
    .map(([key, value]) => {
      const index = parseInt(key, 10) - 1; // 將 key 轉為索引（-1 是因為陣列是 0 基底）
      const weight = allWeights[index];
      if (weight) {
        return {
          index,
          value,
          thumbnail: weight.thumbnail,
          title: `SDG ${key}`,
        };
      }
      return null;
    })
    .filter(Boolean);

  const handleReadMore = (title, body) => {
    setModalContent({ title, body });
  };

  return (
    <div>
      <div className="flex flex-wrap">
        {sdgsItems.map(({ index, value, thumbnail, title }) => (
          <div
            key={index}
            className="flex items-center mb-4 w-full col-12 col-lg-6"
          >
            <img
              className="w-20 h-20 mr-4 col-3"
              src={thumbnail}
              alt={`Image for ${title}`}
            />
            <div className="flex-1">
              <div
                className="sdg-text font-semibold text-base  overflow-hidden"
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 5,
                }}
                dangerouslySetInnerHTML={{ __html: value }}
              ></div>
              <button
                className="read-more text-blue-500 text-xs underline hidden"
                onClick={() => handleReadMore(title, value)}
              >
                Read more...
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 模態框 */}
      {modalContent.title && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setModalContent({ title: "", body: "" })}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">{modalContent.title}</h2>
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: modalContent.body }}
            ></div>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => setModalContent({ title: "", body: "" })}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SdgsWeight;
