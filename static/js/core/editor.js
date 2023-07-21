function register_ckeditor_styles(elementIds) {
  const style = document.createElement("style");
  let styles = ``;
  elementIds.map((elementId) => {
    const element = document.querySelector(elementId);
    const height = element.style.height;
    styles += `
${elementId} + div .ck-editor__editable_inline {
  min-height: ${height};
}
    `;
    style.innerHTML = styles;
    document.head.appendChild(style);
  });
}

function register_ckeditor(elementIds) {
  if (typeof window.ckeditorEditors == "undefined") {
    window.ckeditorEditors = {};
  }

  elementIds
    .filter(
      (elementId) => typeof window.ckeditorEditors[elementId] === "undefined"
    )
    .map((elementId) => {
      const element = document.querySelector(elementId);
      window.ckeditorEditors[elementId] = -1;

      ClassicEditor.create(element, {
        extraPlugins: [SimpleUploadAdapterPlugin],
        simpleUpload: {
          uploadUrl: HOST_URL_TPLANET_DAEMON + "/portal/upload_img"
          // uploadUrl: "http://localhost:3000/image/upload"
        },

        // FIXME: 移除 MediaEmbed, ImageUpload 插件配置
        removePlugins: ["MediaEmbed"], // 移除 MediaEmbed 和 ImageInsert 插件
        toolbar: {
          items: [
            // 可以根據需要保留其他工具按鈕，這裡只保留了文本相關的按鈕
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'undo',
            'redo'
          ]
        },
      })
        .then((newEditor) => {
          window.ckeditorEditors[elementId] = newEditor;
          console.log(`editor[${elementId}] registered`);
        })
        .catch((error) => {
          console.error(error);
        });
    });

  register_ckeditor_styles(elementIds);
}

function update_ckeditor_data() {
  if (window.ckeditorEditors) {
    for (const key in window.ckeditorEditors) {
      console.log(`${key} editor data updated`);

      window.ckeditorEditors[key].updateSourceElement();
    }
  }
}
