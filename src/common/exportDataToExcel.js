import ExportJsonExcel from 'js-export-excel';

function exportDataToExcel(pro, excelName, sheetData, sheetFilter, sheetHeader){
  if(!pro) return false;
  window[pro] = ()=>{
    const option = {};
    option.fileName = excelName;
    option.datas = [{sheetData, sheetName:'sheet', sheetFilter, sheetHeader}]
    const toExcel = new ExportJsonExcel(option)
    toExcel.saveExcel()
  };
}
function exportExcelData(excelName, sheetData, sheetFilter, sheetHeader) {
  const option = {};
  option.fileName = excelName;
  option.datas = [{sheetData, sheetName:'sheet', sheetFilter, sheetHeader}]
  const toExcel = new ExportJsonExcel(option)
  toExcel.saveExcel()
}
export default {
  exportDataToExcel,
  exportExcelData,
}