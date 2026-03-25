export function lineDataChange(dataVal, ifBubble, typeVal, areaStyle, markLine) {
  const newData = [];
  for (let i = 0; i < dataVal.length; i++) {
    const item = dataVal[i];
    const dataOne = {};
    if (item.stack) {
      dataOne.stack = item.stack;
    }
    if (item.name) {
      dataOne.name = item.name;
    }
    if (item.itemStyle) {
      dataOne.itemStyle = item.itemStyle;
    }
    if (typeVal) {
      dataOne.type = typeVal;
      dataOne.barWidth = '10px';
    } else {
      dataOne.type = 'line';
    }
    dataOne.smooth = true;
    dataOne.data = item.data;
    dataOne.markLine = markLine || {};
    if (item.opacity) {
      const lineStyle = {};
      lineStyle.opacity = item.opacity;
      dataOne.lineStyle = lineStyle;
    }
    if(areaStyle) {
      dataOne.areaStyle = areaStyle;
    }
    if (ifBubble) {
      dataOne.markPoint = {};
      const markData = [];
      let a = item.data[0];
      for (let j = 1; j < item.data.length; j++) {
        const b = item.data[j];
        const mark = {};
        if (Math.abs(a - b) > 50) {
          mark.name = b;
          mark.value = b;
          mark.coord = [j, b];
          markData.push(mark);
        }
        a = b;
      }
      dataOne.markPoint.data = markData;
    }
    newData.push(dataOne);
  }
  return newData;
}

export function splitData(rawData) {
  const categoryData = [];
  const values = []
  for (let i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i].splice(0, 1)[0]);
    values.push(rawData[i])
  }
  return {
    categoryData,
    values,
  };
}

export function calculateMA(data0,dayCount) {
  const result = [];
  for (let i = 5, len = data0.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    let sum = 0;
    for (let j = 0; j < dayCount; j++) {
      sum += data0.values[i - j][1];
    }
    result.push(sum / dayCount);
  }
  return result;
}
