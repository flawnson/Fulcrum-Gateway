import DashboardStatsCard from "../atoms/DashboardStatsCard";
import {View} from "native-base";


type queuerStatsProps = {
    index: number,
    eta: number,
    waited: number,
    avg: number,
    values: Function,  // Not sure if this is the best way to be doing this...
}

export default function (props: queuerStatsProps) {
    const queuerStatCards = props.values().map((queuerStat: number) => <DashboardStatsCard stat={queuerStat}/>)

    return (
        <View>
            {queuerStatCards}
        </View>
    )
}



