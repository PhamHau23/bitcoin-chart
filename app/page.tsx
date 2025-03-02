"use client"

import React ,{ useEffect, useState } from "react";
import CandlestickChart from "./components/CandlestickChart";
import VolumeChart from "./components/VolumeChart";
import { GetCandles } from "./api/binanceApi";
import CurrentCoinPrice from "./components/CurrentCoinPrice";
import Button from "./components/Button";
import ButtonList from "./components/ButtonList";
import { LuChartCandlestick } from "react-icons/lu";
import { TbChartHistogram } from "react-icons/tb";
import ToggleTheme from "./components/ToggleTheme";


export default function Home() {

  const [chart, setChart] = useState<boolean>(true)
  const [active, setActive] = useState<string>('candle')
  const [coinData, setCoinData]= useState<any>([])
  const [interval, setInterval] = useState<string>('1m')
  const [activeInterval, setActiveInterval] = useState<string>('1m')

  const handleChart = (type: boolean, _active: string) => {
    //kiem tra neu chart khong doi thi se khong setChart
    if(type == chart) return
    //set ten bieu do la bieu do dc chon de kiem tra va them class active
    setActive(_active)
    setChart(type)
  }

  useEffect(() => {
    (async() => {
      const apiData = await GetCandles('BTCUSDT',interval)
      setCoinData(apiData)
    })()
  }, [interval])

  const handleInterval = (_interval: string) => {
    //kiem tra neu value giong voi interval thi se khong setInterval
    if(_interval == interval) return
    //
    setActiveInterval(_interval)
    setInterval(_interval)
  }

  if(!coinData && Object.keys(coinData).length == 0){
    return (
      <div>loading</div>
    )
  }
  
  return (
    <div className="relative">
        <ToggleTheme />
        <div className="mb-3">
          <CurrentCoinPrice />
        </div>

        <div className="flex flex-col mb-2 md:flex-row md:justify-between">
          <div className="mb-3">
            <ButtonList>
              <Button title={<LuChartCandlestick />} interval={null} onClick={() => handleChart(true,'candle')} type={'candle'} chart={active}/>
              <Button title={<TbChartHistogram />} interval={null} onClick={() => handleChart(false,'volume')} type={'volume'} chart={active}/>
            </ButtonList>
          </div>

          <div>
            <ButtonList>
              <Button title={'1m'} onClick={() => handleInterval('1m')} type={'1m'} interval={activeInterval} chart={null}/>
              <Button title={'5m'} onClick={() => handleInterval('5m')} type={'5m'} interval={activeInterval} chart={null}/>
              <Button title={'30m'} onClick={() => handleInterval('30m')} type={'30m'} interval={activeInterval} chart={null}/>
              <Button title={'1h'} onClick={() => handleInterval('1h')} type={'1h'} interval={activeInterval} chart={null}/>
              <Button title={'1d'} onClick={() => handleInterval('1d')} type={'1d'} interval={activeInterval} chart={null}/>
              <Button title={'3d'} onClick={() => handleInterval('3d')} type={'3d'} interval={activeInterval} chart={null}/>
            </ButtonList>
          </div>
        </div>

        <div>
          {chart ? <CandlestickChart data={coinData} interval={interval}/> : <VolumeChart data={coinData} interval={interval}/>}
        </div>
    </div>
  );
}
