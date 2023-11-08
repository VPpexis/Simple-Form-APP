import { Box, Button, Divider, ImageList, ImageListItem, Select, Stack, TextField, Typography, makeStyles } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import generatePDF from '../scripts/generatePDF';
import firebase from '../scripts/initFirebase';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styled from "@emotion/styled";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateField } from '@mui/x-date-pickers/';
import dayjs from "dayjs";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

var dataVar = {};

export default function ReportView() {
    const {id} = useParams();
    const [data, setData] = useState({});
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const [screenHeight, setScreenHeight] = useState(window.innerHeight)
    const [imageURLs, setImageURLs] = useState([]);
    const [badIlluUpload, setBadIlluUpload] = useState(null);
    const [goodIlluUpload, setGoodIlluUpload] = useState(null);

    let navigate = useNavigate();
    const routeChange = () => {
        let path = '/dashboard';
        navigate(path);
      }

    const changeHandler = (e) => {  
        setData({...data, [e.target.id]: e.target.value})   
        dataVar = {...dataVar, [e.target.id]: e.target.value}
    };
    const handleGoodIlluChange = (e) => {   setGoodIlluUpload(e.target.files[0])    };
    const handleBadIlluChange = (e) => {    
        setBadIlluUpload(e.target.files[0]);
        console.log(badIlluUpload)}
    const performedDateHandler = (date) => { setData({...data, performedDate: `${date.$D}-${date.$M}-${date.$y}`}); };
    const verifiedDateHandler = (date) => { setData({...data, verifiedDate: `${date.$D}-${date.$M}-${date.$y}`}); };

    const onRemoveClicked = () => {
        const db = firebase.database();
        const dataRef = db.ref(`data/${id}`);
        dataRef.remove().then(() => {
            console.log('Document successfuly deleted.');
            let path = '/dashboard';
            navigate(path)
        }).catch((error) => {
            console.error('Error Removing document: ', error);
        })

    }

    const onReviewClicked = (e) => {

        const db = firebase.database();
        const st = firebase.storage();
        const dataRef = db.ref(`data/${id}`);
        const storageRef = st.ref(`${id}`)
        const fileRef1 = storageRef.child(`/goodIllu/${id}goodIllu.png`);
        const fileRef2 = storageRef.child(`/badIllu/${id}badIllu.png`);
        fileRef1.put(goodIlluUpload);
        fileRef2.put(badIlluUpload);
        console.log(dataVar);
        dataRef.set(dataVar);
        db.ref(`data/${id}/status`).set('Reviewed')
        navigate('/dashboard');
    }

    const onDraftClicked = (e) => {
        const db = firebase.database();
        const dataRef = db.ref(`data/${id}`);

        if (goodIlluUpload != null || badIlluUpload != null) {
            const st = firebase.storage();
            const storageRef = st.ref(`${id}`);
            const fileRef1 = storageRef.child(`/goodIlllu/${id}goodIllu.png`);
            const fileRef2 = storageRef.child(`/badIllu/${id}badIllu.png`);
            fileRef1.put(goodIlluUpload);
            fileRef2.put(badIlluUpload);
        }
        console.log(dataVar);
        dataRef.set(dataVar);
    }

    const onGenerateClicked = () => {
        dataVar = {...dataVar, 
            illustration2: badIlluUpload,
            illustration3: goodIlluUpload,
        };
        console.log('datavar', data)
        generatePDF(dataVar);
    }

    
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth)
            setScreenHeight(window.innerHeight)
        };

        const fetchData = () => {
            const dt = firebase.database();
            const dataRef = dt.ref(`data/${id}`);
            dataRef.get().then((snapshot) => {
                setData(snapshot.val());
                if (snapshot.exists()) {
                    setData(snapshot.val());
                    dataVar = snapshot.val();
                }else{
                    console.log('Data not found');
                }
            })
            .catch((error) => {
                console.error('Error getting data: ', error);
            })   
        };
        fetchData();

        const storageRef = firebase.storage().ref(`${id}`);
        storageRef.listAll()
            .then((result) => {
                const downloadPromises = result.items.map((item) => {
                    return item.getDownloadURL();
                });
                return Promise.all(downloadPromises);
            })
            .then((urls) => {
                console.log(urls)
                setImageURLs(urls);
                if (urls[0] != undefined) {
                    setData({...data, illustration1: urls[0]});
                    dataVar = {...dataVar, illustration1: urls[0]};
                }
            })
            .catch((error) => {
                console.error('Error retrieveing images: ', error);
            });
        
        window.addEventListener('resize', handleResize);
        console.log('raw_data', data);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [id]);

    return (
        <Box
        display='flex'
        flexDirection='columns'
        justifyContent='center'
        sx={{backgroundColor: 'grey'}}
        >
            <Box
            marginTop={8}
            marginBottom={8}
            width={screenWidth * .90}
            sx={{backgroundColor: 'white', borderColor: 'black', borderRadius: 8}}
            >
                <Box margin={3}>
                    <Typography sx={{marginBottom: 1}}variant="h4">Inter Facility Issue Feedback Report</Typography>
                    <Divider/>
                    <Stack mt={2} direction='row'>
                        <Box marginTop={3} width={screenWidth * .6}>
                            <TextField
                            id='controlNumber'
                            variant="standard"
                            label='Control Number'
                            sx={{width: screenWidth*.5, marginBottom: 3, color: 'red'
                            }}
                            InputLabelProps={{ shrink: true,}}
                            InputProps={{sx: {color: 'black'}}}
                            onChange={changeHandler}
                            value={data.controlNumber}
                            ></TextField>
                            <TextField
                            variant="standard"
                            id='attentionTo'
                            label='Attention To'
                            sx={{width: screenWidth*.5, marginBottom: 3}}
                            InputLabelProps={{ shrink: true}}
                            onChange={changeHandler}
                            value={data.attentionTo}
                            ></TextField>
                            <TextField
                            variant="standard"
                            id='facilityAffected'
                            label='Facility Affected'
                            sx={{width: screenWidth*.5, marginBottom: 3}}
                            InputLabelProps={{ shrink: true}}
                            value={data.facilityAffected}
                            onChange={changeHandler}
                            ></TextField>
                            <TextField
                            variant="standard"
                            id='supplier'
                            label='Supplier'
                            sx={{width: screenWidth*.5, marginBottom: 3}}
                            InputLabelProps={{ shrink: true}}
                            onChange={changeHandler}
                            value={data.supplier}
                            ></TextField>
                            <TextField
                            variant="standard"
                            id='source'
                            label='Source'
                            sx={{width: screenWidth*.5, marginBottom: 3}}
                            InputLabelProps={{ shrink: true}}
                            onChange={changeHandler}
                            value={data.source}
                            ></TextField>
                            <TextField
                            variant="standard"
                            id='poNumber'
                            label='P.O. Number'
                            sx={{width: screenWidth*.5, marginBottom: 3}}
                            InputLabelProps={{ shrink: true}}
                            onChange={changeHandler}
                            value={data.poNumber}
                            ></TextField>
                        </Box>
                        <Box marginTop={3} height={100} width={screenWidth * .4}>
                            <TextField
                            variant="standard"
                            id='detectedAt'
                            label='Detected At'
                            sx={{width: screenWidth*.3, marginBottom: 3}}
                            InputLabelProps={{ shrink: true}}
                            value={data.detectedAt}
                            onChange={changeHandler}
                            ></TextField>
                            <TextField
                            variant="standard"
                            id='category'
                            label='Category'
                            sx={{width: screenWidth*.3, marginBottom: 3}}
                            InputLabelProps={{ shrink: true}}
                            onChange={changeHandler}
                            value={data.category}
                            ></TextField>
                            <TextField
                            variant="standard"
                            id='classification'
                            label='Classification'
                            sx={{width: screenWidth*.3, marginBottom: 3}}
                            InputLabelProps={{ shrink: true}}
                            onChange={changeHandler}
                            value={data.classification}
                            ></TextField>
                        </Box>
                    </Stack>
                    <Box>
                        <Typography variant='h6' sx={{marginBottom: 2}}>Non-Conformity Description</Typography>
                        <TextField 
                        multiline
                        rows={10}
                        id='defectDescription' 
                        label='Defect Description'
                        sx={{width:screenWidth*.8, marginBottom: 3}}
                        InputLabelProps={{ shrink: true}}
                        onChange={changeHandler}
                        value={data.defectDescription}
                        >
                        </TextField>
                    </Box>
                    <Stack direction='row'>
                        <Box marginTop={3} width={screenWidth * .6}>
                            <TextField
                            variant="standard"
                            id='partNumber'
                            label='Part Number'
                            sx={{width: screenWidth*.5, marginBottom: 3}}
                            InputLabelProps={{ shrink: true}}
                            onChange={changeHandler}
                            value={data.partNumber}
                            ></TextField>
                            <TextField
                            variant="standard"
                            id='partDescription'
                            label='part Description'
                            sx={{width: screenWidth*.5, marginBottom: 3}}
                            InputLabelProps={{ shrink: true}}
                            onChange={changeHandler}
                            value={data.partDescription}
                            ></TextField>
                            <TextField
                            variant="standard"
                            id='datacode'
                            label='Datacode'
                            sx={{width: screenWidth*.5, marginBottom: 3}}
                            InputLabelProps={{ shrink: true}}
                            onChange={changeHandler}
                            value={data.datacode}
                            ></TextField>
                            <TextField
                            variant="standard"
                            id='dataReceived'
                            label='Data Received'
                            sx={{width: screenWidth*.5, marginBottom: 3}}
                            InputLabelProps={{ shrink: true}}
                            onChange={changeHandler}
                            value={data.dataReceived}
                            ></TextField>
                            <TextField
                            variant="standard"
                            id='affectedModel'
                            label='Affected Model/SKU'
                            sx={{width: screenWidth*.5, marginBottom: 3}}
                            InputLabelProps={{ shrink: true}}
                            onChange={changeHandler}
                            value={data.affectedModel}
                            ></TextField>
                        </Box>
                        <Box marginTop={3} width={screenWidth * .4}>
                            <TextField
                            variant="standard"
                            id='inspectedQty'
                            label='Inspected Quantity'
                            sx={{width: screenWidth*.3, marginBottom: 3}}
                            InputLabelProps={{ shrink: true}}
                            onChange={changeHandler}
                            value={data.inspectedQty}
                            ></TextField>
                            <TextField
                            variant="standard"
                            id='detectedQty'
                            label='Detected Quantity'
                            sx={{width: screenWidth*.3, marginBottom: 3}}
                            InputLabelProps={{ shrink: true}}
                            onChange={changeHandler}
                            value={data.detectedQty}
                            ></TextField>
                            <TextField
                            variant="standard"
                            id='percent'
                            label='Percent'
                            sx={{width: screenWidth*.3, marginBottom: 3}}
                            InputLabelProps={{ shrink: true}}
                            onChange={changeHandler}
                            value= {data.percent}
                            ></TextField>
                            <TextField
                            variant="standard"
                            id='recievedQuantity'
                            label='Received Quantity'
                            sx={{width: screenWidth*.3, marginBottom: 3}}
                            InputLabelProps={{ shrink: true}}
                            onChange={changeHandler}
                            value={data.receivedQty}
                            ></TextField>
                            <TextField
                            variant='standard'
                            id='cell'
                            label='Cell'
                            sx={{width: screenWidth*.3, marginBottom: 3}}
                            InputLabelProps={{ shrink: true}}
                            onChange={changeHandler}
                            value={data.cell}
                            ></TextField>
                        </Box>
                    </Stack>
                    <Box mb={4}>
                        <Typography variant="h6">Illustration/Picture</Typography>
                        <ImageList
                        sx = {{width: screenWidth*.8, height: 500}}
                        cols={1}
                        >
                            {imageURLs.map((image) => (
                                <ImageListItem key={image}>
                                    <img src={`${image}`} alt=''/>
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Box>
                    <Divider/>
                    <Stack mt={4} mb={4} spacing={2}>
                        <Typography variant='h5'>This portion is to be filled up by factory</Typography>
                        <TextField 
                        id='containmentActionFac' 
                        label='Containment Action' 
                        multiline 
                        onChange={changeHandler}
                        defaultValue={data.containmentActionFac}
                        InputLabelProps={{ shrink: true}}
                        rows={8}/>
                        <TextField 
                        id='rootcauseAnalysisFac' 
                        label='Rootcause Analysis'
                        multiline 
                        onChange={changeHandler}
                        defaultValue={data.rootcauseAnalysisFac}
                        InputLabelProps={{ shrink: true}}
                        rows={8}/>
                    </Stack>
                    <Divider/>
                    <Stack mt={4} mb={4} spacing={2}>
                        <Typography variant='h5'>This portion is to be filled up by supplier</Typography>
                        <TextField 
                        id='containmentActionSup' 
                        label='Containment Action'
                        multiline 
                        onChange={changeHandler}
                        defaultValue={data.containmentActionSup}
                        InputLabelProps={{ shrink: true}}
                        rows={8}/>
                        <TextField 
                        id='rootcauseAnalysisSup' 
                        label='Rootcause Analysis' 
                        multiline 
                        onChange={changeHandler}
                        defaultValue={data.rootcauseAnalysisSup}
                        InputLabelProps={{ shrink: true}}
                        rows={8}/>
                        <TextField 
                        id='correctiveActionSup' 
                        label='Corrective Action' 
                        multiline 
                        onChange={changeHandler}
                        defaultValue={data.correctiveActionSup}
                        InputLabelProps={{ shrink: true}}
                        rows={6}/>
                        <Box mt={3}>
                            <Typography variant='h6'>Illustration/Pictures</Typography>
                        </Box>
                        <Stack>
                            <Typography>Bad (Illustration of the Problem)</Typography>
                            <Button sx={{width: 150}} component='label' variant='contained' startIcon={<CloudUploadIcon />}>
                                Upoad file
                                <VisuallyHiddenInput 
                                type='file'
                                onChange={handleBadIlluChange}
                                />
                            </Button>
                            { badIlluUpload && (
                                <Box>
                                    <Typography variant='body1'>
                                        File upload: {badIlluUpload.name}
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                        <Stack>
                            <Typography>Good (Illustration of the Ideal State)</Typography>
                            <Button sx={{width: 150}} component='label' variant='contained' startIcon={<CloudUploadIcon />}>
                                Upoad file
                                <VisuallyHiddenInput 
                                type='file' 
                                onChange={handleGoodIlluChange}
                                />
                            </Button>
                            { goodIlluUpload && (
                                <Typography variant='body1'>
                                    File upload: {goodIlluUpload.name}
                                </Typography>
                            )}
                        </Stack>
                    </Stack>
                    <Stack mb={3} spacing={2}>
                        <Typography variant="h5">Details</Typography>
                        <TextField
                        id='veriCorrAct' 
                        multiline 
                        rows={5} 
                        onChange={changeHandler}
                        defaultValue={data.veriCorrAct}
                        InputLabelProps={{ shrink: true}}
                        label="Verification of corrective action"/>
                    </Stack>
                    <Stack mb={3} direction='row' spacing={8} justifyContent='center'>
                        <Stack mb={3} spacing={2} direction='column'>
                            <TextField
                            id='performedby'
                            onChange={changeHandler}
                            value={data.performedby}
                            InputLabelProps={{ shrink: true }}
                            label='Performed By: '
                            sx={{width: screenWidth*.3}}
                            ></TextField>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateField 
                                id="performedDate"
                                value={dayjs(data.performedDate)}
                                onChange={performedDateHandler}
                                sx={{width: screenWidth*.1}}
                                label="Date" />
                            </LocalizationProvider>
                        </Stack>
                        <Stack mb={3} spacing={2} direction='column'>
                            <TextField 
                            id="verifiedBy"
                            onChange={changeHandler}
                            value={data.verifiedBy}
                            InputLabelProps={{ shrink: true}}
                            sx={{width: screenWidth*.3}} 
                            label='Verified By:'/>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateField']}>
                                    <DateField 
                                    id="verifiedDate"
                                    defaultValue={dayjs(data.verifiedDate)}
                                    onChange={verifiedDateHandler}
                                    sx={{width: screenWidth*.1}} 
                                    label="Date" />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Stack>
                    </Stack>
                    <Divider variant="middle"/>
                    <Box mt={2} mb={2} marginLeft='auto' display='flex'>
                        <Stack spacing={3} direction='row'>
                            <Button variant="contained" color='success' onClick={onReviewClicked}>Review</Button>
                            <Button variant='contained' color='success' onClick={onDraftClicked}>Save Draft</Button>
                            <Button variant="contained" color='success' onClick={onGenerateClicked}>Generate PDF</Button>
                            <Button variant="contained" color='success' onClick={onRemoveClicked}>Remove</Button>
                            <Button variant="outlined" color='success' onClick={routeChange}>Cancel</Button>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}