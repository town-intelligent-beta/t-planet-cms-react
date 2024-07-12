export const wrapImagesWithLightbox = (selector, options = {}) => {
  $(selector)
    .toArray()
    .map((element, index) => {
      const wrapper = document.createElement("a");

      let src = options.src;
      if (src == null) {
        src = $(element).attr("src");
      }
      wrapper.href = src;

      let ligthbox = options.alias;
      if (ligthbox == null) {
        ligthbox = `image-${index}`;
      }
      wrapper.dataset.lightbox = ligthbox;
      $(element).wrap(wrapper);
    });
};
