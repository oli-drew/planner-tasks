import React, { useEffect, useState } from "react";
import { useMsalAuthentication, useMsal } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { protectedResources, msalConfig } from "../authConfig";
import { getClaimsFromStorage } from "../utils/storageUtils";
import { handleClaimsChallenge } from "../fetch";
import { getGraphClient } from "../graph";
import { ResponseType } from "@microsoft/microsoft-graph-client";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import Grid from "@mui/material/Unstable_Grid2";
import SubCard from "./Card";

export default function BucketCard({ bucketID, department }) {
  const { instance } = useMsal();
  const account = instance.getActiveAccount();
  const [graphData, setGraphData] = useState(null);

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
    if (!!graphData) {
      return;
    }

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
  }, [graphData, result, error, login, bucketID]);

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
      // Count todo and complete tasks
      if (task.percentComplete < 100) {
        data[0].value++;
      } else if (task.percentComplete >= 100) {
        data[1].value++;
      }
      // Count todo tasks with high priority
      if (task.percentComplete < 100 && task.priority < 5) {
        data[2].value++;
      }
      // Count late tasks
      if (
        task.percentComplete < 100 &&
        dayjs(task.dueDateTime).isBefore(dayjs())
      ) {
        data[3].value++;
      }
    }
  });

  console.log(data);

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
            <Grid container spacing={1} pl={5}>
              {data.map((entry, index) => (
                <Grid xs={6}>
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
