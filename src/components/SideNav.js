import { Box, Button, Drawer, Stack, Typography } from "@mui/material";
import  styled from "@emotion/styled";
import React from "react";

export default function SideNav() {
    const temp = {
        width: 250,
        height: 80,
        backgroundColor: 'yellow'
    };

    return(
        <div>
            <Drawer
            variant="permanent"
            anchor="left"
            sx= {{
                width: 240,
                flexShrink: 0,
            }}
            >
                <Box
                margin={3}
                >
                    <Box style={temp}>Logo</Box>
                    <Stack
                    marginTop={6}
                    >
                        <Button>Home</Button>
                    </Stack>
                </Box>
            </Drawer>
        </div>
    )
};