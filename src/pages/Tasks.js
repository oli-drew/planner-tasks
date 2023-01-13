import React, { useEffect, useState } from "react";
import { useMsalAuthentication, useMsal } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { protectedResources, msalConfig } from "../authConfig";
import { getClaimsFromStorage } from "../utils/storageUtils";
import { handleClaimsChallenge } from "../fetch";
import { getGraphClient } from "../graph";
import { ResponseType } from "@microsoft/microsoft-graph-client";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BucketCard from "../components/BucketCard";
import Card from "@mui/material/Card";

export default function TasksPage() {
  const planID = `${process.env["REACT_APP_AAD_APP_PLAN_ID"]}`;
  const { instance } = useMsal();
  const account = instance.getActiveAccount();
  const [graphData, setGraphData] = useState(null);

  const resource = new URL(protectedResources.graphPlanBuckets.endpoint)
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
    scopes: protectedResources.graphPlanBuckets.scopes,
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
        .api(`/planner/plans/${planID}/buckets`)
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
  }, [graphData, result, error, login, planID]);

  if (error) {
    return (
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: { xs: "60px", lg: "6vh" },
          borderColor: "warning.main",
          color: "warning.main",
        }}
      >
        <Typography align="center" variant="h4" component="div" noWrap p={1}>
          Error: {error.message}
        </Typography>
      </Card>
    );
  }

  return (
    <Box component="main" p={1}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: { xs: "60px", lg: "6vh" },
        }}
      >
        <Link
          to="/"
          component={RouterLink}
          color="inherit"
          align="center"
          variant="h4"
          noWrap
          p={1}
          underline="none"
        >
          Today's Tasks
        </Link>
      </Card>
      <Grid
        container
        spacing={1}
        sx={{
          py: 1,
          minHeight: { xs: "1000px", lg: "94vh" },
        }}
      >
        <>
          {graphData ? (
            <>
              {graphData.value.map((bucket, index) => {
                if (index < 12) {
                  return (
                    <Grid xs={12} md={6} lg={4} key={bucket.id}>
                      <BucketCard
                        department={bucket.name}
                        bucketID={bucket.id}
                      />
                    </Grid>
                  );
                }
              })}
            </>
          ) : null}
        </>
      </Grid>
    </Box>
  );
}
