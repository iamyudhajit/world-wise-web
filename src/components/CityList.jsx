import Spinner from "./Spinner";
import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCities } from "../context/CitiesContext";

function CityList() {

  const {cities , isLoading} = useCities();

  if (isLoading) return <Spinner />;
  if(!cities.length) return <Message message = "Add Your First City By Clicking On A City On The Map"/>
  return (
    <ul className={styles.cityList}>
      {cities.map(city=><CityItem city = {city} key = {city.id}/>)}
    </ul>
  );
}

export default CityList;
