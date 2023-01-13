import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

export default function OutlinedCard({ cardColor, title, value }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: cardColor,
        color: cardColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        p: 1,
      }}
    >
      <CardContent align="center" sx={{ p: 0, "&:last-child": { pb: 0 } }}>
        {title && (
          <Typography sx={{ fontSize: 16 }} noWrap pb={1}>
            {title}
          </Typography>
        )}
        {value || value === 0 ? (
          <Typography variant="h4" component="div">
            {value}
          </Typography>
        ) : (
          <Skeleton variant="rounded" width="80%" />
        )}
      </CardContent>
    </Card>
  );
}
