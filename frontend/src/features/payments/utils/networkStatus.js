export const getNetworkStatus = () => {
    const online = navigator.onLine

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (!online) {
        return {
            status: "OFFLINE",
            message:
                "You appear to be offline. Please check your internet connection."
        }
    }

    if (!connection) {
        return {
            status: "UNKNOWN",
            message: null
        }
    }

    const effectiveType = connection.effectiveType;
    const downlink = connection.downlink;

    if (effectiveType === "slow-2g" || effectiveType === "2g" || downlink < 0.5) {
        return {
            status: "POOR",
            message:
                "Your internet connection is very weak. Move to an area with better network coverage before continuing."
        }
    }

    if (effectiveType === "3g" || downlink < 1) {
        return {
            status: "SLOW",
            message:
                "Your connection may be slow. A stable network is recommended for a smoother payment."
        }
    }

    return {
        status: "GOOD",
        message: null
    }
}