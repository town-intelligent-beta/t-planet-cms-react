export const compileHandlebars = (templateId, data) => {
  const html = document.getElementById(templateId).innerHTML;
  const template = Handlebars.compile(html);
  return template(data);
};

export const renderHandlebars = (containerId, templateId, data) => {
  const html = document.getElementById(templateId).innerHTML;
  const template = Handlebars.compile(html);
  document.getElementById(containerId).innerHTML = template(data);
};

export const renderHandlebarsAppendTo = (containerId, templateId, data) => {
  const html = document.getElementById(templateId).innerHTML;
  const template = Handlebars.compile(html);
  $(`#${containerId}`).append($(template(data)));
};

export const renderHandlebarsAppendToBody = (templateId, data) => {
  const html = document.getElementById(templateId).innerHTML;
  const template = Handlebars.compile(html);
  console.log(template(data));
  $(`body`).append($(template(data)));
};
