import { createChart, HistogramSeries, MouseEventParams, Time } from "lightweight-charts"
import { useEffect, useRef, useState } from "react"
import convertUnixTime from "../lib/convertUnixTime"
import { GetLiveCandle, ICandleStick } from "../api/binanceApi"
import { useThemeContext } from "../context/toggleTheme"

interface Props{
    data: ICandleStick[],
    interval: string
}

interface volumechartDataType{
    time: Time,
    value: number
}

const VolumeChart = ({data, interval}: Props) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [volumechartData, setVolumechartData] = useState<volumechartDataType[]>([])
    const {theme} = useThemeContext()

    useEffect(() => {
        const _data = data.map((item: {openTime: number, volume: number}) => (
            {
                time: item.openTime as Time,
                value: item.volume
            }
        ))
        setVolumechartData(_data)
    }, [data])

    useEffect(() => {
        if(containerRef.current){
            const handleResize = () => {
                chart.applyOptions({ 
                    width: containerRef.current?.clientWidth,
                });
            };

            const chart = createChart(containerRef.current, {
                width: containerRef.current.clientWidth,
                height: containerRef.current.clientHeight,
                layout: {
                    background: {
                        color: theme === 'dark' ? "#242424" : "#F2F2F2"
                    },
                    textColor: theme === 'dark' ? "#e4e4e7" : "#333"
                },
                grid: {
                    vertLines: {
                        color: theme === "dark" ? "#282828" : "#e6e6e6",
                    },
                    horzLines: {
                        color: theme === "dark" ? "#282828" : "#e6e6e6",
                    },
                },
            });

            const volumechartSeries = chart.addSeries(HistogramSeries, {
                color: '#26a69a',
                priceFormat: { type: 'volume' }
            })

            chart.timeScale().applyOptions({
                barSpacing: 20
            })

            volumechartSeries.setData(volumechartData)

            //tao thong tin khi hover
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
                    const date = convertUnixTime(param.time)
                    toolTip.style.display = 'block'
                    const data = param.seriesData.get(volumechartSeries)
                    let volume

                    //kiem tra data, value, close va gan gia tri cho volume
                    if(data){
                        if('value' in data){
                            volume = data.value
                        }else if('close' in data){
                            volume = data.close
                        }
                    }
                    toolTip.innerHTML = `
                    <p class="font-bold">${date}</p>
                    <p class="font-bold text-red-600">
                        <label class="text-black">Volume:</label> ${volume}
                    </p>
                    `
            
                    // Position tooltip according to mouse cursor position
                    toolTip.style.left = param.point.x + 'px'
                    toolTip.style.top = param.point.y + 'px'
                }
            })

            //websocket de lay du lieu theo time thuc
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
                        const volumeNewData: {time: Time, value: number} = {
                            time: Math.floor(newData.t / 1000) as Time,
                            value: parseFloat(newData.v)
                        };
        
                        volumechartSeries.update(volumeNewData);
                    }
                };
    
                ws.onerror = (error) => {
                    console.error("Lỗi WebSocket:", error);
                };
            }


            window.addEventListener('resize', handleResize)

            return () => {
                window.removeEventListener('resize', handleResize)
                ws.close()
                chart.remove()
            }
        }
    }, [volumechartData, theme])

    return(
        <div ref={containerRef} style={{position: 'relative'}} className="h-[500px]">

        </div>
    )
}

export default VolumeChart