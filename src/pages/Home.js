import React from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

function HomePage() {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  return (
    <Container component="main">
      <AuthenticatedTemplate>
        {activeAccount ? (
          <Container
            disableGutters
            maxWidth="sm"
            component="main"
            sx={{ pt: 8, pb: 6 }}
          >
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Planner Tasks
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              component="p"
            >
              Welcome to the Peter Drew Workwear Planner Tasks App. Click the
              button below to view the Task Board.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button component={Link} to={"/tasks"} variant="contained">
                Task Board
              </Button>
            </Stack>
          </Container>
        ) : null}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Container
          disableGutters
          maxWidth="sm"
          component="main"
          sx={{ pt: 8, pb: 6 }}
        >
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Planner Tasks
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            component="p"
          >
            Please login to access the Planner Tasks App
          </Typography>
        </Container>
      </UnauthenticatedTemplate>
    </Container>
  );
}

export default HomePage;
