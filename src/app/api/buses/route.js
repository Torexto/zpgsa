import axios from "axios";

export async function GET() {
    try {
        const response = await axios.get('http://bielawa.trapeze.fi/bussit/web?command=olmapvehicles&action=getVehicles');

        const data = response.data.map(bus => {
            let abs_deviation = Math.abs(bus.deviation);
            let hours = (abs_deviation / 3600000);
            let minutes = Math.floor((abs_deviation % 3600000) / 60000);
            let seconds = ((abs_deviation % 60000) / 1000);

            let deviation_string = bus.deviation < 0 ? "-" : "+";

            if (abs_deviation >= 3600000) {
                deviation_string += `${hours}:`;
            }
            deviation_string += `${minutes}:${seconds}`;

            let icon;
            if (bus.deviation > 0) {
                icon = minutes >= 3 ? "bus-late" : "bus-on-time"
            } else {
                icon = minutes >= 1 ? "bus-ahead" : "bus-on-time"
            }

            let label = bus.label.slice(0, 3);

            return {
                id: bus.id,
                label,
                lat: bus.lat,
                lon: bus.lon,
                line: bus.line,
                deviation: deviation_string,
                icon,
                destination: bus.destination,
            }
        })

        return Response.json(data);
    } catch (error) {
        console.error('Error fetching buses:', error);
        return Response.json({message: 'Internal Server Error', error: error.message})
    }
}