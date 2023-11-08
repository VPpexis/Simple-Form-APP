import React, { useEffect, useState } from 'react';
import { Typography, Box, AppBar, TextField, Stack, Select, Button, MenuItem } from '@mui/material/';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { dataObj } from '../scripts/dataObj.js';
import firebase from '../scripts/initFirebase';
import { useNavigate } from 'react-router-dom';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo/DemoContainer.js';
import dayjs from 'dayjs';
import { calculateNewValue } from '@testing-library/user-event/dist/utils/index.js';

const db = firebase.database();
const st = firebase.storage();

export default function FormUI() {
    const [data, setData] = useState({
        defectDescription: "What is the problem: \nWhy is it the problem: \nWho detected the problem: \nWhen it was detected: \nWhere it was detected: \nWhere it was detected: \nHow it was detected: ",
    });
    const [date, setDate] = useState(new dayjs());
    const [fileUpload, setFileUpload] = useState();
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const classificationVar = [
        'Raw Material',
        'W.I.P',
        'Finish Goods',
        'Customer Complain',
        'Design Problems',
        'Supplier Issue',
        'Delivery Problem',
    ]

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'insert(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const updateScreenSize = () => {
        setScreenSize({
            width: window.innerWidth,
            height:window.innerHeight
        });
    };

    const deleteFileHandler = () => {
        setFileUpload(null);
    }

    const changeHandler = (e) => {
        setData({...data, [e.target.id]: e.target.value})
    };

    const issueDateHandler = (date) => { setData({...data, issueDate: `${date.$D}-${date.$M+1}-${date.$y}`}); };

    let navigate = useNavigate();
    const onButtonClicked = (e) => {
        const dataRef = db.ref('data');
        const newDataRef = dataRef.push();

        if (fileUpload != undefined) {
            const storageRef = st.ref()
            const fileRef = storageRef.child(`${newDataRef.key}/${newDataRef.key}pic.png`)
            fileRef.put(fileUpload);
            console.log("raw", data);
        }
        newDataRef.set(data);
        navigate('/finish');
    };

    useEffect(() => {
        window.addEventListener('resize', updateScreenSize);

        return () => {
            window.removeEventListener('resize', updateScreenSize);
        };
    }, []);

    return(
        <Box sx = {{flexGrow: 10}}>
            <Box
            backgroundColor= 'grey'
            display= 'flex'
            sx= {{
                width: screenSize.width,
            }}
            >
            </Box>
            <Box
            justifyContent= 'center'
            display= 'flex'
            sx= {{
                width: screenSize.width,

            }}
            backgroundColor= 'grey'
            >
                <Box
                marginTop={8}
                marginBottom={8}
                borderRadius= {8}
                display= 'flex'
                sx= {{
                    width: screenSize.width - 350,
                    boxShadow: 333,
                    backgroundColor: 'white',
                    align: 'center'
                }}
                >  
                    <Stack
                    marginBottom={5}
                    >
                        <Box
                            marginTop= {4}
                            marginLeft= {4}
                            sx= {{
                                width: screenSize.width - 350,
                            }}
                        >
                            <Typography
                                variant='h4'
                            >
                                Inter Facility Issue Feedback Report
                            </Typography>
                        </Box>
                        <Box
                        display= 'flex'
                        marginTop={4}
                        justifyContent= 'center'
                        sx= {{
                            align: 'center'
                        }}
                        >
                            <Stack
                            direction= 'row'
                            >
                                <Stack
                                    direction= 'column'
                                    spacing= {1.5}
                                    sx= {{
                                        width: ((screenSize.width - 350)/2) * .9
                                    }}
                                >
                                    <TextField
                                        required
                                        id='controlNumber'
                                        onChange={changeHandler}
                                        label= 'Control Number'
                                        defaultValue= {""}
                                        style={{
                                            width: ((screenSize.width - 350)/2) * .8
                                        }}
                                    ></TextField>
                                    <TextField
                                        required
                                        id= 'attentionTo'
                                        onChange={changeHandler}
                                        label= 'Attention To'
                                        style={{
                                            width: ((screenSize.width - 350)/2) * .8
                                        }}
                                    ></TextField>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker 
                                            label="Issue Date" 
                                            id="issueDate2"
                                            onChange={issueDateHandler}
                                            >
                                            </DatePicker>
                                        </DemoContainer>
                                    </LocalizationProvider>
                                    <TextField
                                        required
                                        id='facilityAffected'
                                        onChange={changeHandler}
                                        label= 'Facility Affected'
                                        style={{
                                            width: ((screenSize.width - 350)/2) * .8
                                        }}
                                    ></TextField>
                                    <TextField
                                        required
                                        id='reportedBy'
                                        onChange={changeHandler}
                                        label= 'Reported By'
                                        style={{
                                            width: ((screenSize.width - 350)/2) * .8
                                        }}
                                    ></TextField>
                                    <TextField
                                        required
                                        id='supplier'
                                        onChange={changeHandler}
                                        label= 'Supplier'
                                        style={{
                                            width: ((screenSize.width - 350)/2) * .8
                                        }}
                                    ></TextField>
                                    <TextField
                                        required
                                        id='source'
                                        onChange={changeHandler}
                                        label= 'Source'
                                        style={{
                                            width: ((screenSize.width - 350)/2) * .8
                                        }}
                                    ></TextField>
                                    <TextField
                                        required
                                        id= 'poNumber'
                                        onChange={changeHandler}
                                        label= 'P.O. Number'
                                        style={{
                                            width: ((screenSize.width - 350)/2) * .8
                                        }}
                                    ></TextField>
                                </Stack>
                                <Stack
                                    spacing= {2}
                                    sx= {{
                                        width: ((screenSize.width - 350)/2) * .9,
                                    }}
                                    >   <Box>
                                            <Typography>
                                                Detected at:
                                            </Typography>
                                            <Select
                                            defaultValue=""
                                            id='detectedAt'
                                            onChange={
                                                (e) => {
                                                    setData({...data, detectedAt: e.target.value})
                                                }
                                            }
                                            sx= {{
                                                width: ((screenSize.width - 350)/2) * .8
                                            }}
                                            >
                                                <MenuItem value='IQC'>IQC</MenuItem>
                                                <MenuItem value='SMT/AI/MI/FA'>SMT/AI/MI/FA</MenuItem>
                                                <MenuItem value='QA'>QA</MenuItem>
                                                <MenuItem value='Other(JAC)'>Other(JAC)</MenuItem>
                                            </Select>
                                            <TextField
                                            sx= {{marginTop: 1}}
                                            label= 'Others'
                                            ></TextField>
                                        </Box>
                                        <Box>
                                            <Typography>
                                                Category
                                            </Typography>
                                            <Select
                                            defaultValue=""
                                            id='category'
                                            onChange={
                                                (e) => {
                                                    setData({...data, category: e.target.value})
                                                }
                                            }
                                            sx= {{
                                                width: ((screenSize.width - 350)/2) * .8
                                            }}
                                            >
                                                <MenuItem value='Major'>Major</MenuItem>
                                                <MenuItem value='Minor'>Minor</MenuItem>
                                            </Select>
                                        </Box>
                                        <Box>
                                            <Typography>
                                                Classification
                                            </Typography>
                                            <Select
                                            id='classification'
                                            onChange={
                                                (e) => {
                                                    setData({...data, classification: e.target.value})
                                                }
                                            }
                                            defaultValue=""
                                            sx= {{
                                                width: ((screenSize.width - 350)/2) * .8
                                            }}
                                            >
                                                {classificationVar.map((classificationVar) => (
                                                    <MenuItem
                                                        value={classificationVar}>{classificationVar}</MenuItem>
                                                ))}
                                            </Select>
                                            <TextField
                                            sx= {{marginTop: 1}}
                                            label= 'Others'
                                            ></TextField>
                                        </Box>
                                </Stack>
                            </Stack>
                        </Box>
                        <Box
                        marginTop={3}
                        >
                            <Typography sx= {{marginLeft: screenSize.width * .006}}>Noncomformity Description</Typography>
                            <TextField
                            multiline
                            id='defectDescription'
                            onChange={changeHandler}
                            value={data.defectDescription}
                            label= 'Defect Description'
                            maxRows= {5}
                            minRows= {5}
                            sx= {{
                                marginLeft: screenSize.width * .006,
                                width: (screenSize.width - 350) * .85
                            }}
                            ></TextField>
                            <Stack
                            direction= 'row'
                            display= 'flex'
                            marginTop={3}
                            justifyContent= 'center'
                            sx= {{
                                align: 'center'
                            }}
                            >
                                <Stack
                                    direction= 'column'
                                    spacing= {1.5}
                                    sx= {{
                                        width: ((screenSize.width - 350)/2) * .9,
                                    }}
                                >
                                    <TextField
                                    id='partNumber'
                                    onChange={changeHandler}
                                    label= 'Part Number'
                                    sx= {{
                                        width: ((screenSize.width - 350)/2) * .8
                                    }}
                                    ></TextField>
                                    <TextField
                                    id='partDescription'
                                    onChange={changeHandler}
                                    label= 'Part Description'
                                    sx= {{
                                        width: ((screenSize.width - 350)/2) * .8
                                    }}
                                    >
                                    </TextField>
                                    <TextField
                                    id='datacode'
                                    onChange={changeHandler}
                                    label= 'Datacode'
                                    sx= {{
                                        width: ((screenSize.width - 350)/2) * .8
                                    }}
                                    >
                                    </TextField>
                                    <TextField
                                    id='dataReceived'
                                    onChange={changeHandler}
                                    label= 'Data Received'
                                    sx= {{
                                        width: ((screenSize.width - 350)/2) * .8
                                    }}
                                    >
                                    </TextField>
                                    <TextField
                                    id='affectedModel'
                                    onChange={changeHandler}
                                    label= 'Affected model/SKU'
                                    sx= {{
                                        width: ((screenSize.width - 350)/2) * .8
                                    }}
                                    >
                                    </TextField>
                                </Stack>
                                <Stack
                                    direction= 'column'
                                    spacing= {1.5}
                                    sx= {{
                                        width: ((screenSize.width - 350)/2) * .9,
                                    }}
                                >
                                    <TextField
                                    id='inspectedQty'
                                    onChange={changeHandler}
                                    label= 'Inspected Qty'
                                    sx= {{
                                        width: ((screenSize.width - 350)/2) * .8
                                    }}
                                    >
                                    </TextField>
                                    <TextField
                                    id='defectQty'
                                    onChange={changeHandler}
                                    label= 'Detected Qty'
                                    sx= {{
                                        width: ((screenSize.width - 350)/2) * .8
                                    }}
                                    >
                                    </TextField>
                                    <TextField
                                    id='percent'
                                    onChange={changeHandler}
                                    label= 'Percent'
                                    sx= {{
                                        width: ((screenSize.width - 350)/2) * .8
                                    }}
                                    >
                                    </TextField>
                                    <TextField
                                    id='receivedQty'
                                    onChange={changeHandler}
                                    label= 'Received Qty'
                                    sx= {{
                                        width: ((screenSize.width - 350)/2) * .8
                                    }}
                                    >
                                    </TextField>
                                    <TextField
                                    id='cell'
                                    onChange={changeHandler}
                                    label= 'Cell'
                                    sx= {{
                                        width: ((screenSize.width - 350)/2) * .8
                                    }}
                                    >
                                    </TextField>
                                </Stack>
                            </Stack>
                        </Box>
                        <Stack
                            direction= 'column'
                            marginTop={4}
                            marginLeft={screenSize.width * .006}
                            >
                            <Typography>Attach Illustration/Pictures</Typography>
                            <Button
                                component= 'label'
                                variant= 'outlined'
                                startIcon= {<CloudUploadIcon/>}
                                sx= {{width: 200, height: 40}}
                            >
                                Upload File
                                <VisuallyHiddenInput 
                                type='file'
                                onChange={(e) => {setFileUpload(e.target.files[0])}}
                                />
                            </Button>
                            { fileUpload && (
                                <Stack direction='row'>
                                    <Typography variant='body1'>
                                    File Upload: {fileUpload.name}
                                    </Typography>
                                    <Button startIcon={<DeleteIcon/>} onClick={deleteFileHandler}></Button>
                                </Stack>
                                
                            )}
                         </Stack>
                         <Box
                         marginTop={3}
                         justifyContent= 'center'
                         alignItems= 'center'
                         display= 'flex'
                         >
                            <Button
                                variant= 'contained'
                                size= 'large'
                                onClick={onButtonClicked}
                                sx= {{
                                    width: ((screenSize.width - 350)/2) * .8
                                }}
                            >Submit</Button>  
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}

