const generateList = (data, name, dataList, showField, type, num) => {
  data.forEach(da => {
    dataList.push({order: num,...da, relaName:name ? name + '/' + da[showField] : da.name,  ... type ? {type} : {} });
    if(da.children) {
      generateList(da.children, da[showField],dataList, showField, type)
    }
  })
}

export function convertedTreeData(data,showField, type) {
  const dataList = [];
  generateList(data, name, dataList, showField, type, 1);
  return dataList;
}