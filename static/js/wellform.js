function project_weight_to_sdg_string(str_project_weight, type){
  var list_project_weight = [];
  var list_result = [];

  // Get project weight
  try {
    list_project_weight = str_project_weight.split(",");
  } catch (e) {
    console.log(e);
    return list_project_weight;
  }

  // Format by type
  try {
    // ["SDG1","SDG3","SDG5","SDG7","SDG9","SDG11","SDG13","SDG15","SDG17"]
    if (type == 0) {
      for (var index = 0; index < list_project_weight.length; index ++) {
        if (parseInt(list_project_weight[index]) == 1) {
          list_result.push("SDG" + (index+1).toString());
        }
      }
    }
  } catch (e) {
    console.log(e);
    return list_project_weight;
  }

  return list_result;
}

function project_location_to_string(str_project_location){
  var list_location = [];
  var str_location = "";

  // Get project location
  try {
    list_location = str_project_location.split(",");
  } catch (e) {
    console.log(e);
    return list_location;
  }

  try {
    for (var index = 0; index < list_location.length; index++) {
      if (parseInt(list_location[index]) == 1) {
        if (index == 0) {
          str_location = str_location + "台北 ";
        } else if (index == 1){
          str_location = str_location + "竹山 ";
        } else if (index == 2){
          str_location = str_location + "高雄 ";
        } else if (index == 3){
          str_location = str_location + "花蓮 ";
        } else {
          str_location = str_location + "馬祖 ";
        }
      }
    }
  } catch (e) {
    console.log(e);
    return str_location;
  }

  return str_location;
}
