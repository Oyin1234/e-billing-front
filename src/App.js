import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import routes from "routes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import { AuthContext } from "helpers/AuthContext";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  // useEffect(() => {
  //   const isLoggedIn = sessionStorage.getItem("user");

  //   if (isLoggedIn) {
  //     setLoggedIn(true);
  //   }
  // }, []);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("user") || null;

    const parsedData = JSON.parse(isLoggedIn);

    if (isLoggedIn) {
      setLoggedIn(true);
    }

    // parsedData?.auth === true
    //   ? setIsAuthenticated(true)
    //   : setIsAuthenticated(false);

    if (parsedData) {
      setLoading(true);

      const fetchData = async () => {
        const data = sessionStorage.getItem("user") || null;
        let parsedData = JSON.parse(data);
        const authToken = parsedData.token;

        try {
          const [usersResponse, candidatesResponse] = await Promise.all([
            fetch(`http://localhost:3001/users`),
            fetch(`http://localhost:3001/candidates`),
          ]);

          const usersData = await usersResponse.json();
          const candidatesData = await candidatesResponse.json();

          // Store the data in sessionStorage
          sessionStorage.setItem("users", JSON.stringify(usersData));
          sessionStorage.setItem("candidates", JSON.stringify(candidatesData));

          let storedCandidates = JSON.parse(
            sessionStorage.getItem("candidates", JSON.stringify(candidatesData))
          );

          setCandidates(storedCandidates);

          // Set loading to false to indicate that data fetching is complete
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };

      fetchData();
    } else {
      console.log("Not Authenticated");
    }
  }, [loggedIn]);

  return loading ? (
    <>Loading, please wait...</>
  ) : (
    <AuthContext.Provider value={{ candidates }}>
      {direction === "rtl" ? (
        <CacheProvider value={rtlCache}>
          <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
            <CssBaseline />
            {layout === "dashboard" && (
              <>
                <Sidenav
                  color={sidenavColor}
                  brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                  brandName="Material Dashboard 2"
                  routes={routes}
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
                />
                {/* <Configurator />
                {configsButton} */}
              </>
            )}
            {layout === "vr" && <Configurator />}
            <Routes>
              {getRoutes(routes)}
              <Route
                path="*"
                element={
                  loggedIn ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Navigate to="/authentication/sign-in" />
                  )
                }
              />
            </Routes>
          </ThemeProvider>
        </CacheProvider>
      ) : (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
          <CssBaseline />
          {layout === "dashboard" && (
            <>
              <Sidenav
                color={sidenavColor}
                brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                brandName="Material Dashboard 2"
                routes={routes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
              {/* <Configurator />
              {configsButton} */}
            </>
          )}
          {layout === "vr" && <Configurator />}
          <Routes>
            {getRoutes(routes)}
            <Route
              path="*"
              element={
                loggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/authentication/sign-in" />
              }
            />
          </Routes>
        </ThemeProvider>
      )}
    </AuthContext.Provider>
  );
}
