import { Button, Box, Container, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function FinishUI() {
    const [windowDimension, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
        
    }, []);

    let navigate = useNavigate();

    const onButtonClicked = (e) => {
        navigate('/');
    }

    return(
        <Container maxWidth='md'>
            <Box
            mt={15}
            display='flex'
            justifyContent='center'
            width={windowDimension.width*.5}
            height={windowDimension.height*.5}
            sx={{
                border: '1px solid black',
                boxShadow: '0 10px 10px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                borderRadius: '20px'
            }}
            >   
                <Stack alignItems='center' direction='column'>
                    <Box mt={6}>
                        <Typography variant="h4">Thank you for answering the forms.</Typography>
                    </Box>
                    <Box mt={10} width={100} height={50}>
                        <Button 
                        variant='contained' 
                        onClick={onButtonClicked}
                        sx={{backgroundColor: 'green'}}>Return</Button>
                    </Box>
                </Stack>
            </Box>
        </Container>
    );
};