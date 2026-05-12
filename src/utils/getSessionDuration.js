export const getSessionDuration = (startTime, endTime = new Date()) => {
    if (!startTime) return "---";

    const start = new Date(startTime);
    const end = new Date(endTime);

    let diff = Math.abs(end - start);

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ${days === 1 ? "day" : "days"} ago`;
    if (hours > 0) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    if (minutes > 0) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;

    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
};