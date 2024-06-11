/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { Card, DialogActions, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";

import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import MDSnackbar from "components/MDSnackbar";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

// const { columns, rows } = authorsTableData();
const { columns: pColumns, rows: pRows } = projectsTableData();

function Dashboard() {
  const [selectedValue, setSelectedValue] = React.useState("");
  const { sales, tasks } = reportsLineChartData;
  const [open, setOpen] = React.useState(false);
  const [openLogout, setOpenLogout] = React.useState(false);
  const [openAboutProject, setOpenAboutProject] = React.useState(false);
  const [successSB, setSuccessSB] = React.useState(false);
  const [errorSB, setErrorSB] = React.useState(false);
  const [users, setUsers] = React.useState();
  const [userInfo, setUserInfo] = React.useState({});
  const [candidates, setCandidates] = React.useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);
  const handleOpenAboutProject = () => setOpenAboutProject(true);
  const handleCloseAboutProject = () => setOpenAboutProject(false);
  const radioGroupRef = React.useRef(null);
  const options = candidates && candidates;
  const [totalVoteCount, setTotalVoteCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const columns = [
    { Header: "full name", accessor: "fullName", width: "45%", align: "left" },
    { Header: "email", accessor: "email", align: "left" },
    { Header: "Vote Count", accessor: "voteCount", align: "center" },
  ];

  React.useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    setUserInfo(user);
  }, []);

  console.log("this is our user info: ", userInfo);
  const getCandidates = async () => {
    try {
      const response = await fetch("http://localhost:3001/candidates", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch candidates");
      }

      const candidates = await response.json();

      const updatedRows = candidates.map((candidate) => ({
        fullName: candidate.firstName + " " + candidate.lastName,
        email: candidate.email,
        voteCount: candidate.votes,
      }));

      console.log(updatedRows);
      const total = updatedRows.reduce((acc, curr) => acc + curr.voteCount, 0);
      setTotalVoteCount(total);
      setRows(updatedRows);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    getCandidates();
  }, []);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const handleVote = async () => {
    try {
      const response = await fetch("http://localhost:3001/vote", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({ username: userInfo && userInfo.username, candidate: selectedValue }),
      }).then((res) => res.json());

      if (response.message === "Vote casted successfully") {
        setSuccessMessage(response.message);
        handleClose();
        openSuccessSB();
        getCandidates();
      } else {
        setErrorMessage(response.message);
        openErrorSB();
      }
      console.log(response);
    } catch (error) {
      console.log("This is error, :", error);
    }
  };

  const renderSuccessSB = (message) => (
    <MDSnackbar
      color="success"
      icon="check"
      title="Vote Casted successfully"
      content={message}
      dateTime="Just now"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
    />
  );
  const renderErrorSB = (error) => (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Error"
      content={error}
      dateTime="Just now"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const handleRadioChange = (value) => {
    setSelectedValue(value);
  };

  React.useEffect(() => {
    const users = JSON.parse(sessionStorage.getItem("users"));
    const candidates = JSON.parse(sessionStorage.getItem("candidates"));
    setUsers(users);
    setCandidates(candidates);
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar
        handleOpen={handleOpen}
        handleOpenLogout={handleOpenLogout}
        handleOpenAboutProject={handleOpenAboutProject}
      />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Total Candidates"
                count={candidates && candidates.length}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Total Users"
                count={users && users.length}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Total votes"
                count={totalVoteCount}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          {/* <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Followers"
                count="+91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid> */}
        </Grid>

        <Grid item xs={12} sx={{ mt: 5 }}>
          <Card>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
            >
              <MDTypography variant="h6" color="white">
                Candidates
              </MDTypography>
            </MDBox>
            {!isLoading && (
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={true}
                  noEndBorder
                  // canSearch={true}
                />
              </MDBox>
            )}
          </Card>
        </Grid>

        {/* <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox> */}
      </MDBox>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Select candidate to vote for
          </Typography>
          <RadioGroup
            ref={radioGroupRef}
            aria-label="ringtone"
            name="ringtone"
            value={selectedValue} // assuming you have a state to manage the selected value
            onChange={(event) => {
              const selectedValue = event.target.value;
              console.log("Selected value:", selectedValue);
              handleRadioChange(selectedValue);
            }} // handleRadioChange is your function to handle the change
          >
            {options.map((option) => (
              <FormControlLabel
                value={option.id}
                key={option.id}
                control={<Radio />}
                label={option.firstName + " " + option.lastName}
              />
            ))}
          </RadioGroup>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              onClick={handleClose}
              color="primary"
              variant="outlined"
              sx={{ mr: 1, border: "0.5px solid black", color: "#000" }}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                handleVote();
              }}
              color="dark"
              variant="contained"
              sx={{ border: "0.5px solid black", color: "#fff", background: "#000" }}
            >
              Vote
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={openLogout}
        onClose={handleCloseLogout}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to log out?
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              onClick={handleCloseLogout}
              color="primary"
              variant="outlined"
              sx={{ mr: 1, border: "0.5px solid black", color: "#000" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                sessionStorage.clear();
                window.location.href = "/authentication/sign-in";
              }}
              color="dark"
              variant="contained"
              sx={{ border: "0.5px solid black", color: "#fff", background: "#000" }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openAboutProject}
        onClose={handleCloseAboutProject}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            About this project
          </Typography>

          <Typography>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry`&apos`s standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type specimen book. It has
            survived not only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </Typography>
        </Box>
      </Modal>
      {renderSuccessSB(successMessage)}
      {renderErrorSB(errorMessage)}
    </DashboardLayout>
  );
}

export default Dashboard;
