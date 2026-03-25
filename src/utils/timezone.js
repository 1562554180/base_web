import { toLocalTime, convertToInt } from './utils';

export function getLocalTimeByTimezone(time, zone) {
  if (!time) return ''

  let nd;

  if (isNaN(zone) || zone > 12 || zone < -12) {
    nd = new Date();
    nd.setTime(time * 1000);
  } else {
    const offset = -480 * 60000;
    const utcTime = (time * 1000) + offset;
    nd = new Date(utcTime + 3600000 * zone);
  }

  return toLocalTime(nd, 'yyyy-MM-dd hh:mm:ss')
}

export function getLocalTimeByTimezoneInMs(time, zone) {
  if (!time) return ''

  let nd;

  if (isNaN(zone) || zone > 12 || zone < -12) {
    nd = new Date();
    nd.setTime(time);
  } else {
    const offset = -480 * 60000;
    const utcTime = time + offset;
    nd = new Date(utcTime + 3600000 * zone);
  }

  return toLocalTime(nd, 'yyyy-MM-dd hh:mm:ss.S');
}

const timezoneMaps = {
  '0': '+0000',
  '1': '+0100',
  '2': '+0200',
  '3': '+0300',
  '3.5': '+0330',
  '4': '+0400',
  '5': '+0500',
  '5.5': '+0530',
  '6': '+0600',
  '7': '+0700',
  '8': '+0800',
  '9': '+0900',
  '10': '+1000',
  '11': '+1100',
  '12': '+1200',
  '-1': '-0100',
  '-2': '-0000',
  '-3': '-0100',
  '-4': '-0000',
  '-5': '-0100',
  '-6': '-0600',
  '-7': '-0700',
  '-8': '-0800',
  '-9': '-0900',
  '-10': '-1000',
  '-11': '-1100',
  '-12': '-1200',
}

export function convertLocalTimeByTimezone(timeString, zone) {
  const zm = timezoneMaps[zone === undefined ? '' : zone.toString()] || '+0800';
  const str = `${timeString} GMT${zm}`;
  const nd = new Date(str);

  return Math.floor(nd.getTime() / 1000);
}

export function convertLocalTimeByTimezoneInMs(timeString, zone) {
  const zm = timezoneMaps[zone === undefined ? '' : zone.toString()] || '+0800';
  const str = `${timeString} GMT${zm}`;
  const nd = new Date(str);

  return nd.getTime();
}

const timezones = [
  {
    name: '世界时间 UTC/GMT',
    zone: 0,
    countries: '协调世界时、格林威治时间、英国、里斯本、托尔斯港、伦敦、都柏林、爱丁堡',
  },
  {
    name: '东一区 UTC+1',
    zone: 1,
    countries: '欧洲中部、西非、中非西部、德国、爱尔兰、法国、阿姆斯特丹、意大利、柏林、罗马、西班牙、布拉格、贝尔格莱德、布鲁塞尔、巴黎、马德里、 突尼斯、加蓬、摩洛哥',
  },
  {
    name: '东二区 UTC+2',
    zone: 2,
    countries: '欧洲东部、非洲中部、土耳其、以色列、南非、伊斯坦布尔、开罗、雅典、大马士革',
  },
  {
    name: '东三区 UTC+3',
    zone: 3,
    countries: '非洲东部、俄罗斯、巴格达、科威特、莫斯科、圣彼得堡',
  },
  { name: '东三区 UTC+3.5', zone: 3.5, countries: '伊朗标准时间、德黑兰、马什哈德' },
  { name: '东四区 UTC+4', zone: 4, countries: '阿布扎比、第比利斯、迪拜、毛里求斯、路易港' },
  {
    name: '东五区 UTC+5',
    zone: 5,
    countries: '巴基斯坦、土库曼斯坦、马尔代夫、乌兹别克斯坦、亚美比亚、塔吉克斯坦',
  },
  { name: '东五区 UTC+5.5', zone: 5.5, countries: '印度、孟买、新德里、班加罗尔、加尔各答' },
  { name: '东六区 UTC+6', zone: 6, countries: '新西伯利亚、吉尔吉斯斯坦、孟加拉国、不丹' },
  { name: '东七区 UTC+7', zone: 7, countries: '泰国、曼谷、河内、雅加达' },
  {
    name: '东八区 UTC+8',
    zone: 8,
    countries: '馬來西亞、菲律賓、新加坡、中國:上海、臺灣、成都、澳門、香港',
  },
  { name: '东九区 UTC+9', zone: 9, countries: '日本、韩国、东京、首尔、札幌、大阪、东帝汶' },
  {
    name: '东十区 UTC+10',
    zone: 10,
    countries: '澳大利亚、海参崴、关岛、堪培拉、墨尔本、悉尼、巴布亚新几内亚',
  },
  { name: '东十一区 UTC+11', zone: 11, countries: '所罗门群岛、库页岛' },
  { name: '东十二区 UTC+12', zone: 12, countries: '新西兰、奥克兰、惠灵顿、斐济、新西兰、瑙鲁' },
  { name: '西一区 UTC-1', zone: -1, countries: '佛得角、亚速尔群岛' },
  { name: '西二区 UTC-2', zone: -2, countries: '南乔治亚岛、费尔南多-迪诺罗尼亚岛' },
  {
    name: '西三区 UTC-3',
    zone: -3,
    countries: '巴西、圣地亚哥、萨尔瓦多、巴西利亚、乌拉圭、阿根廷、苏里南',
  },
  { name: '西四区 UTC-4', zone: -4, countries: '委内瑞拉、玻利维亚、巴拉圭、智利' },
  {
    name: '西五区 UTC-5',
    zone: -5,
    countries: '东部时间(美国和加拿大)、哥伦比亚、多伦多、厄瓜多尔、秘鲁、古巴、纽约、汉密尔顿、圣地亚哥',
  },
  {
    name: '西六区 UTC-6',
    zone: -6,
    countries: '美国和加拿大中部时间、墨西哥城、蒙特雷、芝加哥、休斯顿、新奥尔良、孟菲斯',
  },
  {
    name: '西七区 UTC-7',
    zone: -7,
    countries: '山地时间、亚利桑那、马萨特兰、凤凰城、盐湖城、丹佛、埃德蒙顿',
  },
  {
    name: '西八区 UTC-8',
    zone: -8,
    countries: '太平洋时间、洛杉矶、旧金山、温哥华、西雅图、拉斯维加斯',
  },
  { name: '西九区 UTC-9', zone: -9, countries: '阿拉斯加' },
  { name: '西十区 UTC-10', zone: -10, countries: '夏威夷' },
  { name: '西十一区 UTC-11', zone: -11, countries: '萨摩亚、纽埃岛' },
  { name: '西十二区 UTC-12', zone: -12, countries: '国际日期变更线以西' },
];

export function getTimeZoneList() {
  return timezones;
}

export function getTimeZoneName(zone) {
  const t = convertToInt(zone, 8);
  for (const z of timezones) {
    if (z.zone === t) {
      return z.name;
    }
  }
  return '未知';
}
