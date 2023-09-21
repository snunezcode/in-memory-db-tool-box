import env from "react-dotenv";
import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import Input from "@cloudscape-design/components/input";
import AppLayout from "@cloudscape-design/components/app-layout";
import SideNavigation, { SideNavigationProps, } from "@cloudscape-design/components/side-navigation";
import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";

import Axios from "axios";
import Header from "@cloudscape-design/components/header";
import Button from "@cloudscape-design/components/button";
import Pagination from "@cloudscape-design/components/pagination";
import Table from "@cloudscape-design/components/table";
import SpaceBetween from "@cloudscape-design/components/space-between";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Box from "@cloudscape-design/components/box";
import { ColumnLayout } from "@cloudscape-design/components";
import FormField from "@cloudscape-design/components/form-field";
import Flashbar from "@cloudscape-design/components/flashbar";
import Container from "@cloudscape-design/components/container";
import logo from "./local.png";

import { configuration } from "./Configs";


//-- Demo Components
import Counter from "./components/Counter";
import CounterSS from "./components/CounterSS";
import ApiCaching from "./components/ApiCaching";
import SeatingMap from "./components/SeatingMap";
import Cart from "./components/Cart";
import Users from "./components/Users";
import Intersection from "./components/Intersection";
import { UserProvider } from "./components/UserContext";
import GeoSpatialMap from "./components/GeoSpatialMap";
import "leaflet/dist/leaflet.css";

/*
import Monitor from './components/Monitor';
*/

export const splitPanelI18nStrings: SplitPanelProps.I18nStrings = {
  preferencesTitle: "Split panel preferences",
  preferencesPositionLabel: "Split panel position",
  preferencesPositionDescription:
    "Choose the default split panel position for the service.",
  preferencesPositionSide: "Side",
  preferencesPositionBottom: "Bottom",
  preferencesConfirm: "Confirm",
  preferencesCancel: "Cancel",
  closeButtonAriaLabel: "Close panel",
  openButtonAriaLabel: "Open panel",
  resizeHandleAriaLabel: "Resize split panel",
};

export const mainHeader = { text: "Data Types", href: "#/" };

export const mainMenu = [
  {
    text: "Demo resources",
    type: "section",
    defaultExpanded: true,
    items: [
      { type: "link", text: "Counter", href: "/?codeid=dt01" },
      { type: "link", text: "LeaderBoard", href: "/?codeid=dt02" },
      { type: "link", text: "Api Caching", href: "/?codeid=dt03" },
      { type: "link", text: "Seat Selection", href: "/?codeid=dt04" },
      { type: "link", text: "Shopping Cart", href: "/?codeid=dt05" },
      { type: "link", text: "User Directory", href: "/?codeid=dt06" },
      { type: "link", text: "Geospatial", href: "/?codeid=dt07" },
    ],
  },
];

const i18nStrings = {
  searchIconAriaLabel: "Search",
  searchDismissIconAriaLabel: "Close search",
  overflowMenuTriggerText: "More",
  overflowMenuTitleText: "All",
  overflowMenuBackIconAriaLabel: "Back",
  overflowMenuDismissIconAriaLabel: "Close menu",
};

const profileActions = [
  { type: "button", id: "profile", text: "Profile" },
  { type: "button", id: "preferences", text: "Preferences" },
  { type: "button", id: "security", text: "Security" },
  {
    type: "menu-dropdown",
    id: "support-group",
    text: "Support",
    items: [
      {
        id: "documentation",
        text: "Documentation",
        href: "#",
        external: true,
        externalIconAriaLabel: " (opens in new tab)",
      },
      {
        id: "feedback",
        text: "Feedback",
        href: "#",
        external: true,
        externalIconAriaLabel: " (opens in new tab)",
      },
      { id: "support", text: "Customer support" },
    ],
  },
  { type: "button", id: "signout", text: "Sign out" },
];

const protocol = window.location.protocol;
const domain = window.location.hostname;
const server_port = 3001;
//const server_port = env.SERVER_PORT;
// const server_port = 3001;
const ws_port = 3002;
/*
export const configuration = {
  "apps-settings": {
    "api-url": protocol + "//" + domain + ":" + server_port,
    "ws-url": protocol + "//" + domain + ":" + ws_port,
  },
};
*/

console.log(configuration);

function App() {
  //-- App variables
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [cart, setCart] = useState({});
  const handleSeatsSelected = (seats) => {
    setCart((prevCart) => ({ ...prevCart, ...seats }));
  };

  //-- Layout Configuration
  const [navigationOpen, setNavigationOpen] = useState(true);
  const appLayout = useRef();

  function NavigationChange() {
    setNavigationOpen(!navigationOpen);
  }

  const onFollowHandler: SideNavigationProps["onFollow"] = (event) => {
    // keep the locked href for our demo pages
    event.preventDefault();
  };

  //-- Gather Parameters
  const [params] = useSearchParams();
  const paramCodeId = params.get("codeid");
  console.log(paramCodeId);

  return (
    <div>
      <TopNavigation
        i18nStrings={i18nStrings}
        identity={{
          href: "#",
          title: "Amazon ElastiCache for Redis - Data Types Demo",
          logo: { src: logo, alt: "Service name logo" },
        }}
        utilities={[
          {
            type: "button",
            iconName: "notification",
            ariaLabel: "Notifications",
            badge: true,
            disableUtilityCollapse: true,
          },
          {
            type: "button",
            iconName: "settings",
            title: "Settings",
            ariaLabel: "Settings",
          },
          {
            type: "menu-dropdown",
            text: "customer@example.com",
            description: "customer@example.com",
            iconName: "user-profile",
            items: profileActions,
          },
        ]}
      />
      <AppLayout
        ref={appLayout}
        onFollow={onFollowHandler}
        navigation={
          <SideNavigation
            items={mainMenu}
            header={mainHeader}
            activeHref={"/home"}
          />
        }
        navigationOpen={navigationOpen}
        onNavigationChange={NavigationChange}
        contentType="dashboard"
        content={
          <>
            <br />
            <Container>
              {console.log(configuration)}
              {paramCodeId === "dt01" && (
                
                <Counter apiUrl={configuration["apps-settings"]["api-url"]} />
              )}

              {paramCodeId === "dt02" && (
                <CounterSS apiUrl={configuration["apps-settings"]["api-url"]} />
              )}

              {paramCodeId === "dt03" && (
                <ApiCaching
                  apiUrl={configuration["apps-settings"]["api-url"]}
                />
              )}

              {paramCodeId === "dt04" && (
                <SeatingMap
                  onSeatsSelected={handleSeatsSelected}
                  cart={cart}
                  apiUrl={configuration["apps-settings"]["api-url"]}
                />
              )}

              {paramCodeId === "dt05" && (
                <Cart
                  onSeatsSelected={handleSeatsSelected}
                  selectedSeats={selectedSeats}
                  apiUrl={configuration["apps-settings"]["api-url"]}
                />
              )}

              {paramCodeId === "dt06" && (
                <UserProvider
                  apiUrl={configuration["apps-settings"]["api-url"]}
                >
                  <Users apiUrl={configuration["apps-settings"]["api-url"]} />
                  <Intersection
                    apiUrl={configuration["apps-settings"]["api-url"]}
                  />
                </UserProvider>
              )}
            </Container>
            <br />
            <br />
          </>
        }
      />
    </div>
  );
}

export default App;
