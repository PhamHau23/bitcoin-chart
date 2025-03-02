"use client"

import { useEffect, useState } from "react"
import { GetLiveCandle } from "../api/binanceApi"

const CurrentCoinPrice: React.FC = () => {
    const [currentPrice, setCurrentPrice] = useState<number | null>(null)
    const [oldPrice, setOldPrice] = useState<number | null>(null)

    useEffect(() => {
        const ws = new WebSocket(GetLiveCandle('1m','BTCUSDT'))
        ws.onopen = () => {
            const subscribeMsg = {
                method: "SUBSCRIBE",
                params: [
                    "btcusdt@kline_1m" 
                ],
                id: 1
            }

            ws.send(JSON.stringify(subscribeMsg));
            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.e === 'kline') {
                    const kline = message.k;
                    const value: any = {
                        open: parseFloat(kline.o),
                        close: parseFloat(kline.c)
                    };
    
                    setCurrentPrice(value.close)
                    setOldPrice(value.open)
                }
            };    
        }
    }, [currentPrice, oldPrice])

    return (
        <div className="">
            <span className="font-bold flex dark:text-white">Price: <p className="m-0 p-0 text-red-600 ml-2">{currentPrice}$</p></span>
            <span className="font-bold flex dark:text-white">Old Price(1m): <p className="m-0 p-0 text-blue-400 ml-2">{oldPrice}$</p></span>
        </div>
    )
}

export default CurrentCoinPrice