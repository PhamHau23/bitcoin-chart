import moment from "moment"

const convertUnixTime = (time: number) => {
    const newTime = moment.unix(time).format('YYYY-MM-DD HH:mm:ss');
    return newTime
}

export default convertUnixTime