import React, { useEffect, useState } from "react";
import { useMsalAuthentication, useMsal } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { protectedResources, msalConfig } from "../authConfig";
import { getClaimsFromStorage } from "../utils/storageUtils";
import { handleClaimsChallenge } from "../fetch";
import { getGraphClient } from "../graph";
import { ResponseType } from "@microsoft/microsoft-graph-client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import Grid from "@mui/material/Unstable_Grid2";
import SubCard from "./Card";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isToday);
dayjs.extend(isSameOrBefore);

export default function BucketCard({ bucketID, department }) {
  const { instance } = useMsal();
  const account = instance.getActiveAccount();
  const [graphData, setGraphData] = useState(null);

  // Auto refresh tasks
  const [refresh, setRefreshCounter] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCounter(!refresh);
    }, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  const resource = new URL(protectedResources.graphBucketTasks.endpoint)
    .hostname;

  const claims =
    account &&
    getClaimsFromStorage(
      `cc.${msalConfig.auth.clientId}.${account.idTokenClaims.oid}.${resource}`
    )
      ? window.atob(
          getClaimsFromStorage(
            `cc.${msalConfig.auth.clientId}.${account.idTokenClaims.oid}.${resource}`
          )
        )
      : undefined; // e.g {"access_token":{"xms_cc":{"values":["cp1"]}}}

  const request = {
    scopes: protectedResources.graphBucketTasks.scopes,
    account: account,
    claims: claims,
  };

  const { login, result, error } = useMsalAuthentication(
    InteractionType.Popup,
    {
      ...request,
      redirectUri: "/redirect.html",
    }
  );

  useEffect(() => {
    if (!!error) {
      if (
        error.errorCode === "popup_window_error" ||
        error.errorCode === "empty_window_error"
      ) {
        login(InteractionType.Redirect, request);
      }
      console.log(error);
      return;
    }

    if (result) {
      let accessToken = result.accessToken;
      getGraphClient(accessToken)
        .api(`/planner/buckets/${bucketID}/tasks`)
        .responseType(ResponseType.RAW)
        .get()
        .then((response) => {
          return handleClaimsChallenge(
            response,
            protectedResources.graphMe.endpoint,
            account
          );
        })
        .then((response) => {
          if (response && response.error === "claims_challenge_occurred")
            throw response.error;
          setGraphData(response);
        })
        .catch((error) => {
          if (error === "claims_challenge_occurred") {
            login(InteractionType.Redirect, request);
          } else {
            setGraphData(error);
          }
        });
    }
  }, [refresh, bucketID, result]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const data = [
    { name: "Todo", value: 0 },
    { name: "Complete", value: 0 },
    { name: "Priority", value: 0 },
    { name: "Late", value: 0 },
  ];
  const COLOURS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const tasks = graphData?.value || [{}];

  tasks.map((task, index) => {
    if (tasks !== null) {
      // Count todo and complete tasks with a due date of today or before
      if (
        task.percentComplete < 100 &&
        dayjs(task.dueDateTime).isSameOrBefore(dayjs(), "day")
      ) {
        data[0].value++;
      }
      // Count todo tasks with high priority with a due date of today or before
      if (
        task.percentComplete < 100 &&
        task.priority < 5 &&
        dayjs(task.dueDateTime).isSameOrBefore(dayjs(), "day")
      ) {
        data[2].value++;
      }
      // Only count tasks completed today
      if (
        task.percentComplete >= 100 &&
        dayjs(task.completedDateTime).isToday()
      ) {
        data[1].value++;
      }
      // Count late tasks
      if (
        task.percentComplete < 100 &&
        dayjs(task.dueDateTime).isBefore(dayjs(), "day")
      ) {
        data[3].value++;
      }
    }
  });

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        minHeight: "100%",
      }}
    >
      <Box>
        <Typography align="center" sx={{ fontSize: 20 }} noWrap pt={1}>
          {department}
        </Typography>
      </Box>
      <Box>
        <Grid container spacing={0}>
          <Grid xs={6}>
            <Grid container spacing={1} pl={{ xs: 1, xl: 5 }}>
              {data.map((entry, index) => (
                <Grid xs={6} key={data[index].name}>
                  <SubCard
                    title={data[index].name}
                    value={data[index].value}
                    isTaskCard
                    cardColor={COLOURS[index]}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid xs={6}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={60}
                  outerRadius={80}
                  // paddingAngle={4}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLOURS[index % COLOURS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}
