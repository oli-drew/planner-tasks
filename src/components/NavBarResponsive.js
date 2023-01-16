import React, { useState } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { clearStorage } from "../utils/storageUtils";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

function NavBar() {
  const { instance } = useMsal();

  let activeAccount;

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  const handleLoginPopup = () => {
    instance
      .loginPopup({
        ...loginRequest,
        redirectUri: "/redirect.html",
      })
      .catch((error) => console.log(error));
  };

  const handleLogoutPopup = () => {
    let account = instance.getActiveAccount();
    clearStorage(account);

    instance.logoutPopup({
      mainWindowRedirectUri: "/", // redirects the top level app after logout
      account: instance.getActiveAccount(),
    });
  };

  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Account login menu
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <TaskAltIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Link
            to="/"
            component={RouterLink}
            color="inherit"
            underline="none"
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Planner Tasks
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <AuthenticatedTemplate>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link
                    to="/tasks"
                    component={RouterLink}
                    color="inherit"
                    underline="none"
                    textAlign="center"
                  >
                    Task Board
                  </Link>
                </MenuItem>
              </Menu>
            </AuthenticatedTemplate>
          </Box>

          <TaskAltIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Link
            to="/"
            component={RouterLink}
            color="inherit"
            underline="none"
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Planner Tasks
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <AuthenticatedTemplate>
              <Link
                to="/tasks"
                component={RouterLink}
                color="inherit"
                underline="hover"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Task Board
              </Link>
            </AuthenticatedTemplate>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <AuthenticatedTemplate>
              {/* <Button color="inherit" onClick={handleLogoutPopup}>
                Logout - {activeAccount ? activeAccount.name : "Unknown"}
              </Button> */}
              <div>
                <IconButton
                  size="large"
                  aria-label={`account of ${activeAccount.name}`}
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleLogoutPopup}>Logout</MenuItem>
                </Menu>
              </div>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
              <Button color="inherit" onClick={handleLoginPopup}>
                Login
              </Button>
            </UnauthenticatedTemplate>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
