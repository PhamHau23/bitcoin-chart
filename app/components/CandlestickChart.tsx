"use client"

import React, { useEffect, useRef, useState } from "react"
import { createChart, CandlestickSeries, Time, MouseEventParams } from "lightweight-charts"
import convertUnixTime from "../lib/convertUnixTime"
import { GetLiveCandle, ICandleStick } from "../api/binanceApi"
import { useThemeContext } from "../context/toggleTheme"

interface Props {
    data: ICandleStick[],
    interval: string
}

interface dataType{
    openTime: number,
    open: number,
    high: number,
    low: number,
    close: number
}

interface candlestickChartDataType{
    time: Time,
    open: number,
    high: number,
    low: number,
    close: number
}


const CandlestickChart: React.FC<Props> = ({data, interval}) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [candlestickChartData, setCandlestickChartData] = useState<candlestickChartDataType[]>([])
    const {theme} = useThemeContext()

    useEffect(() => {
        const _data = data.map((item: dataType) => (
            {
                time: item.openTime as Time,
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close
            }
        ))
        setCandlestickChartData(_data)
    }, [data])


    useEffect(() => {
        if(containerRef.current){
            //tao chart
            const handleResize = () => {
                chart.applyOptions({ 
                    width: containerRef.current?.clientWidth,
                });
            };

            const chart = createChart(containerRef.current, {
                width: containerRef.current.clientWidth,
                height: containerRef.current.clientHeight,
                layout: {
                    background: { color: theme === "dark" ? "#242424" : "#F2F2F2" },
                    textColor: theme === "dark" ? "#e4e4e7" : "#333",
                },
                grid: {
                    vertLines: { color: theme === "dark" ? "#282828" : "#e6e6e6" },
                    horzLines: { color: theme === "dark" ? "#282828" : "#e6e6e6" },
                }
            })


            chart.timeScale().applyOptions({
                barSpacing: 20
            })

            
            const candleStickChartSeries = chart.addSeries(CandlestickSeries, {
                upColor: 'green',
                downColor: 'red',
                borderVisible: false,
                wickUpColor: '#A0A0A0',
                wickDownColor: '#A0A0A0',
            })
            
            candleStickChartSeries.setData(candlestickChartData)

            //tao thong tin ve thoi gian va gia khi hover vao nen
            const toolTip = document.createElement('div');
            toolTip.classList.add('tooltip')
            toolTip.style.background = 'white';
            toolTip.style.color = 'black';
            toolTip.style.borderColor = '#2962FF';
            containerRef.current.appendChild(toolTip);
            
            chart.subscribeCrosshairMove((param: MouseEventParams) => {
                if (
                    param.point === undefined ||
                    !param.time ||
                    param.point.x < 0 ||
                    param.point.y < 0
                ) {
                    toolTip.style.display = 'none';
                } else {
                    const date= convertUnixTime(param.time as number)
                    toolTip.style.display = 'block'
                    const data = param.seriesData.get(candleStickChartSeries)
                    let price
                    if(data){
                        if('value' in data){
                            price = data.value
                        }else if('close' in data){
                            price = data.close
                        }
                    }
                    toolTip.innerHTML = `
                    <p class="font-bold">${date}</p>
                    <p class="font-bold text-red-600">
                        <label class="text-black">Price:</label> ${price}$
                    </p>
                    `
            
                    //vi tri tooltip
                    toolTip.style.left = param.point.x + 'px'
                    toolTip.style.top = param.point.y + 10 + 'px'
                }
            })

            //dung websocket de update theo thoi gian
            const ws =  new WebSocket(GetLiveCandle(interval,'BTCUSDT'))
            ws.onopen = () => {
                const subscribeMsg = {
                    method: "SUBSCRIBE",
                    params: [
                        `btcusdt@kline_${interval}`
                    ],
                    id: 1
                }
                ws.send(JSON.stringify(subscribeMsg));
            
                ws.onmessage = (event) => {
                    const message = JSON.parse(event.data);
                    if (message.e === 'kline') {
                        const newData = message.k;
                        const candlestick: {
                            time: Time,
                            open: number,
                            high: number,
                            low: number,
                            close: number
                        } = {
                            time: Math.floor(newData.t / 1000) as Time,
                            open: parseFloat(newData.o),
                            high: parseFloat(newData.h),
                            low: parseFloat(newData.l),
                            close: parseFloat(newData.c)
                        };
        
                        candleStickChartSeries.update(candlestick);
                    }
                };
                
                ws.onerror = (error) => {
                    console.error("Lỗi WebSocket:", error);
                };
            }
            
            window.addEventListener('resize', handleResize)

            return () => {
                window.removeEventListener("resize", handleResize);
                ws.close()
                chart.remove();
            };
        }
    }, [candlestickChartData, theme, interval])

    return(
        <div ref={containerRef} className="h-[500px]" style={{position: 'relative'}}>

        </div>
    )
}

export default CandlestickChart
