import { HomeInformation } from "../../components/homeInformation/HomeInformation";
import { HomeCalendar } from "../../components/homeCalendar/HomeCalendar";

import "./home.css";

export const Home = () => {
  /**Home Page */
  return (
    <div className="home-page">
      <div className="home-page__home-container">
        {/* <HomeInformation /> */}
        <HomeCalendar />
        {/* <Schedules refresh={refresh} updateRefresh={setRefresh} /> */}
      </div>
      {/* <div className="home-page__widgets"></div> */}
    </div>
  );
};
