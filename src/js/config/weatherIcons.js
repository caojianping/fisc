//最新天气、历史天气
import NAIcon from 'src@/images/weatherIcon/NA.png'
import UnknowIcon from 'src@/images/weatherIcon/Unknow.png'
import ClearIcon from 'src@/images/weatherIcon/Sunshine.png'//晴天
import ShoweryRainIcon from 'src@/images/weatherIcon/ShoweryRain.png'//阵雨
import DrizzleIcon from 'src@/images/weatherIcon/Drizzle.png'
import RainIcon from 'src@/images/weatherIcon/Rain.png'
import HeavyRainIcon from 'src@/images/weatherIcon/HeavyRain.png'
import HazeIcon from 'src@/images/weatherIcon/Haze.png'
import FogIcon from 'src@/images/weatherIcon/Fog.png'
import MistIcon from 'src@/images/weatherIcon/Mist.png'
import SleetIcon from 'src@/images/weatherIcon/Sleet.png'//雨夹雪
import SlightSnowIcon from 'src@/images/weatherIcon/SlightSnow.png'
import FumeIcon from 'src@/images/weatherIcon/Fume.png'
import SnowIcon from 'src@/images/weatherIcon/Snow.png'
import HeavySnowIcon from 'src@/images/weatherIcon/HeavySnow.png'
import SandIcon from 'src@/images/weatherIcon/Sand.png'
import ThunderstormRainIcon from 'src@/images/weatherIcon/ThunderstormRain.png'
import DustIcon from 'src@/images/weatherIcon/Dust.png'
import ThunderstormIcon from 'src@/images/weatherIcon/Thunderstorm.png'
import TornadoIcon from 'src@/images/weatherIcon/Tornado.png'
import HailIcon from 'src@/images/weatherIcon/Hail.png'
import IceIcon from 'src@/images/weatherIcon/Ice.png'
import VolcanicashIcon from 'src@/images/weatherIcon/Volcanicash.png'

//未来天气
import GustIcon from 'src@/images/weatherIcon/Gust.png'
import OvercastIcon from 'src@/images/weatherIcon/Overcast.png'
import BrokencloudsIcon from 'src@/images/weatherIcon/Brokenclouds.png'

//未用到的
import FewcloudsIcon from 'src@/images/weatherIcon/Fewclouds.png'
import ScatteredcloudsIcon from 'src@/images/weatherIcon/Scattered clouds.png'
import ShowerIcon from 'src@/images/weatherIcon/Shower.png'
import SpiculesIcon from 'src@/images/weatherIcon/Spicules.png'
import DuststormIcon from 'src@/images/weatherIcon/Dust storm.png'
import FunnelcloudIcon from 'src@/images/weatherIcon/Funnelcloud.png'
import SkyclearIcon from 'src@/images/weatherIcon/Sunshine.png'

export const HistoryWeatherIcons = {
    '-': NAIcon,
    'Unknow': UnknowIcon,
    'CAVOK': ClearIcon,
    'VCSH': ShoweryRainIcon,
    '-RA': DrizzleIcon,
    'RA': RainIcon,
    '+RA': HeavyRainIcon,
    '-DZ': DrizzleIcon,
    'DZ': DrizzleIcon,
    '+DZ': DrizzleIcon,
    'HZ': HazeIcon,
    'FG': FogIcon,
    'PRFG': FogIcon,
    'BR': MistIcon,
    'RA BR': RainIcon,
    'RASN': SleetIcon,
    'RA SN': SleetIcon,
    'SN RA': SleetIcon,
    '-RA BR': DrizzleIcon,
    '+RA BR': HeavyRainIcon,
    '-RA FG': DrizzleIcon,
    'NSW': ClearIcon,
    'SHRA': ShoweryRainIcon,
    '-SHRA BR': ShoweryRainIcon,
    '-SHRA': ShoweryRainIcon,
    'SHRA BR': ShoweryRainIcon,
    '-SN BR': SlightSnowIcon,
    'FZFG': FogIcon,
    'VCFG': FogIcon,
    'FU': FumeIcon,
    'SN': SnowIcon,
    '-SN': SlightSnowIcon,
    '+SN': HeavySnowIcon,
    'BLSN': SnowIcon,
    'SKC': ClearIcon,
    'SA': SandIcon,
    '-TSRA': ThunderstormRainIcon,
    'TSRA': ThunderstormRainIcon,
    '-VCTSRA': ThunderstormRainIcon,
    'BLSA': SandIcon,
    'SH': ShoweryRainIcon,
    'DU': DustIcon,
    'DU SKC': ClearIcon,
    'BLDU': DustIcon,
    'MIFG BR': MistIcon,
    '+DZ FG': DrizzleIcon,
    'TS': ThunderstormIcon,
    '-TS': ThunderstormIcon,
    'VCTS': ThunderstormIcon,
    '-RA VCSH': ShoweryRainIcon,
    '-RADZ': DrizzleIcon,
    '-RADZ BR': DrizzleIcon,
    'TS VCSH': ThunderstormRainIcon,
    'TSRA BR': ThunderstormRainIcon,
    '-TSRA BR': ThunderstormRainIcon,
    '+TSRA BR': ThunderstormRainIcon,
    '+TSRABR': ThunderstormRainIcon,
    'VCTS -RA': ThunderstormRainIcon,
    '+RA VCTS': ThunderstormRainIcon,
    '-SHRA VCTS': ThunderstormRainIcon,
    '-SHRA BCFG': ShoweryRainIcon,
    '-SHRA PRFG': ShoweryRainIcon,
    'VCFG SKC': ClearIcon,
    '-DZ BR': DrizzleIcon,
    'BR PRFG': FogIcon,
    'DZ FG': DrizzleIcon,
    '-DZ FG': DrizzleIcon,
    'MIFG': FogIcon,
    '-DS': DustIcon,
    'MISG': SlightSnowIcon,
    'SN FZFG BLSN': SnowIcon,
    'BR SKC': MistIcon,
    'SA SKC': SandIcon,
    'HZ SKC': HazeIcon,
    'FC': TornadoIcon,
    'GR': HailIcon,
    'IC': IceIcon,
    'VA': VolcanicashIcon,
    'SHRA FG': ShoweryRainIcon
};

//未来天气
export const FutureWeatherIcons = {
    '-': NAIcon,
    'Unknow': UnknowIcon,
    'CLEAR_DAY': ClearIcon,
    'CLEAR_NIGHT': ClearIcon,
    'PARTLY_CLOUDY_DAY': BrokencloudsIcon,
    'PARTLY_CLOUDY_NIGHT': BrokencloudsIcon,
    'CLOUDY': OvercastIcon,
    'RAIN': DrizzleIcon,
    'SNOW': SnowIcon,
    'WIND': GustIcon,
    'HAZE': HazeIcon
};