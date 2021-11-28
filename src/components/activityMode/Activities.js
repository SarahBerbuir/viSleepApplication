import React from 'react'
import OneActivity from './OneActivity'
//import sportsDataSet from '../csv/sports.csv'
//import * as d3 from 'd3'
//import Try from './Try'

export default function Activities() {
    //const [sportsData, setSportsData] = useState([])
    //const [loaded, setLoaded] = useState(false)
    //var data = [["Sport", "Football", "2021-08-04"], ["Mood", "Good", "2021-08-10"]]
    // var sportsDataList = []
    
    /*function createList(data){
        d3.csv(data, function (d) {
            d.type = d.type
            d.description = d.description
            d.date = d.date
            d.duration = + d.duration
            d.calories = + d.calories
            return d
        }).then(function (data) {
            setSportsData(data)
            data.map((item, index) => {
                console.log(item)
                sportsDataList.push(<OneActivity badgeName={item.type} activityName={item.description} activityDate={item.date} />)
            })
            return sportsDataList
        });
    }*/
    
    /*useEffect(() => {
        sportsItemList = sportsData.map((item, index) => {
            console.log(item)
            return <OneActivity badgeName={item.type} activityName={item.description} activityDate={item.date} />
        })
    }, [sportsData])*/

    return (
        <div>
            
            <OneActivity badgeName="Sport" activityName="Yoga with Lea" activityDate="2021-08-04" />

            <OneActivity badgeName="Mood" activityName="Bad Mood" activityDate="2021-08-09" />

            <OneActivity badgeName="Food" activityName="Pizza" activityDate="2021-08-15" />

            <OneActivity badgeName="Sport" activityName="Yoga with Lea" activityDate="2021-08-04" />

            <OneActivity badgeName="Mood" activityName="Bad Mood" activityDate="2021-08-09" />

            <OneActivity badgeName="Food" activityName="Pizza" activityDate="2021-08-15" />
            
        </div>
    )
}
