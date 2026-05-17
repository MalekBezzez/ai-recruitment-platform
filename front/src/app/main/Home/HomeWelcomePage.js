// HomeWelcomePage.jsx
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";

export default function HomeWelcomePage() {
  return (
    <Box
      component="section"
      sx={{
        minHeight: "86.5vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
        overflow: "hidden"
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4 } }}>
        <Grid container alignItems="center" spacing={6}>
          {/* Colonne texte à gauche */}
          <Grid item xs={12} md={6}>
            <Stack spacing={4}>
              <Typography
                variant="h1"
                sx={{ 
                  fontWeight: 800, 
                  fontSize: { xs: "2.6rem", sm: "3.2rem", md: "3.7rem" }, 
                  lineHeight: 1.1,
                  color: "#1a202c",
                  whiteSpace: "nowrap"
                }}
              >
                Welcome To Your <Box component="span" sx={{ color: "#4299e1" }}>HR</Box> Platform
              </Typography>

              <Typography variant="h6" sx={{ 
                color: "#4a5568", 
                fontSize: { xs: "1.6rem", md: "2.2rem" },
                lineHeight: 1.8,
                fontWeight: 450,
                maxWidth: "100%"
              }}>
                Quickly access employees, leave requests, and projects. 
                Manage your HR workflows efficiently — all in one modern 
                and intuitive platform designed for your business needs.
              </Typography>

              <Stack direction="row" spacing={3} sx={{ pt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/timesheet"
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: "1.5rem",
                    bgcolor: "#4299e1",
                    "&:hover": { 
                      bgcolor: "#3182ce",
                    }
                  }}
                >
                  Go to Timesheet
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/projectlist"
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: "1.5rem",
                    borderWidth: 2,
                    borderColor: "#4299e1",
                    color: "#4299e1",
                    "&:hover": {
                      borderColor: "#3182ce",
                      backgroundColor: "rgba(66, 153, 225, 0.05)",
                      borderWidth: 2,
                    }
                  }}
                >
                  View Projects
                </Button>
              </Stack>
            </Stack>
          </Grid>

          {/* Colonne image à droite */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%"
              }}
            >
              <Box
                component="img"
                src="/assets/images/demo-content/Home-image-3.png"
                alt="Team collaboration"
                sx={{
                  width: "100%",
                  maxWidth: 600,
                  height: "auto"
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}