const get_image_size = (dataUrl) => {
  const promise = new Promise((resolve) => {
    var image = new Image();
    image.src = dataUrl;
    image.onload = function () {
      var height = this.height;
      var width = this.width;
      resolve({ width, height });
    };
  });

  return promise;
};
const get_file_data_url = (accept) => {
  const promise = new Promise((resolve) => {
    const input = $("<input>")
      .attr({
        type: "file",
        accept: accept,
      })
      .appendTo("body")
      .hide();

    input
      .on("change", (e) => {
        e.preventDefault();
        var file = e.target.files[0],
          reader = new FileReader();
        reader.onload = function (progress) {
          resolve(progress.target.result);
        };
        reader.readAsDataURL(file);

        $(window).off();
        $(input).off().remove();
      })
      .click();

    $(window).one("cancel", () => {
      console.log("No file select");
      resolve(null);
      $(input).off().remove();
    });
  });

  return promise;
};

const show_croppie_modal = ({
  dataUrl,
  width,
  height,
  // format: jpeg png webp
  format = "jpeg",
  // quality: 0~1
  quality = 1,
}) => {
  const promise = new Promise((resolve) => {
    const html = `
  <div
    class="modal fade"
    tabindex="-1"
    role="dialog"
    data-show="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"></h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" style="overflow: auto;">
          <div class="croppie"></div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary">
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
  `;

    const modal = $(html);
    modal.find(".modal-dialog").css("max-width", width + 32);

    const croppie = () => {
      return $(modal).find(".croppie");
    };

    $(modal).on("shown.bs.modal", () => {
      croppie().croppie("bind", {
        url: dataUrl,
      });
    });

    let response = null;
    $(modal).on("hide.bs.modal", () => {
      $(modal).remove();
      resolve(response);
    });

    $(modal).on("click", ".btn-primary", async () => {
      response = croppie().croppie("result", {
        type: "canvas",
        size: { width, height },
        format: format,
        quality: quality,
      });
      $(modal).modal("hide");
  });

    croppie().croppie({
      viewport: { width, height },
      boundary: { width, height },
      mouseWheelZoom: true,
      enableOrientation: true,
      enableExif: true,
    });

    $(modal).appendTo("body").modal();
  });

  return promise;
};

export const get_cropped_image = async (accept, settings = {}) => {
  const dataUrl = await get_file_data_url(accept);
  if (dataUrl === null) {
    console.warn("Cancel image selection");
    return null;
  }
  const { width, height } = await get_image_size(dataUrl);
  if (!settings.width || settings.width > width) {
    settings.width = width;
  }
  if (!settings.height || settings.height > height) {
    settings.height = height;
  }
  console.log(settings);

  const cropped = await show_croppie_modal({
    ...settings,
    dataUrl,
  });
  if (cropped === null) {
    console.warn("Cancel cropping of image");
    return null;
  }

  return cropped;
};

export const update_background_image = (selector, dataUrl) => {
  $(selector)
    .css("backgroundImage", "url(" + dataUrl + ")")
    .css("backgroundSize", "cover");
};

export const update_image_path = (selector, dataUrl) => {
  const { width, height } = get_image_size(dataUrl);
  $(selector)
    .attr("src", dataUrl)
    .css("width", `${width}px`)
    .css("height", `${height}px`);
};
