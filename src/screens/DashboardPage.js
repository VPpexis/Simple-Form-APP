import React, { useEffect, useState } from 'react';
import { Box,
    TableContainer, Paper, Typography, 
    Table, TableHead, 
    TableCell, TableBody, 
    TableRow, 
    Stack,
    TablePagination} from '@mui/material';
import firebase from '../scripts/initFirebase.js';
import { useNavigate } from 'react-router-dom';

const rowHeader = [
    { id: 'issueDate', label: 'Issue Date', minWidth: 150 },
    { id: 'controlNumber', label: 'Control Number', minWidth: 150 },
    { id: 'attentionTo', label: 'Attention To', minWidth: 170 },
    { id: 'reportedBy', label: 'Reported By', minWidth: 170 },
    { id: 'facilityAffected', label: 'Facility Affected', minWidth: 170 },
    { id: 'supplier', label: 'Supplier', minWidth: 170 },
    { id: 'status', label: 'Status', minWidth: 170 }
];

export default function DashboardPage() {
    const [dataList, setDataList] = useState([]);
    const [page, setPage] = useState(0);
    const [rowPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    }

    let navigate = useNavigate();
    const routeChange = (id) => {
        let path = `report/${id}`;
        navigate(path);
    }

    useEffect(() => {
        const fetchData = async () => {
            const dt = firebase.database();
            const dataRef = dt.ref('data');

            const keysToRetrieve = [
                'issueDate',
                'controlNumber',
                'attentionTo',
                'reportedBy',
                'facilityAffected',
                'supplier',
                'source',
                'status',
            ];

            try {
                const snapshot = await dataRef.get();
                const retrievedData = [];
                snapshot.forEach((childSnapshot) => {
                    const data = childSnapshot.val();
                    const filteredData = {};
                    filteredData['id'] = childSnapshot.key;
                    keysToRetrieve.forEach((key) => {
                        filteredData[key] = data[key];
                    });
                    retrievedData.push(filteredData);
                });
                setDataList(retrievedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <Box sx={{ alignItems: 'center', justifyContent: 'center', display: 'flex', marginTop: 4 }}>
            <Stack>
                <Typography sx={{fontSize: 'h5.fontSize'}}>Inter Facility Issue Feedback Dashboard</Typography>
                <Paper sx={{ width: '100%', overflow: 'hidden'}}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label='sticky table'>
                            <TableHead>
                                <TableRow>
                                    {rowHeader.map((header) => (
                                        <TableCell id={header.id} sx={{ minWidth: header.minWidth }} align='center'>{header.label}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataList
                                .slice()
                                .reverse()
                                .slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                                .map((data) => (
                                <TableRow key={data.id} hover role="checkbox" tabIndex={-1} onClick={() => routeChange(data.id)}>
                                    <TableCell align='center'>{data.issueDate}</TableCell>
                                    <TableCell align='center'>{data.controlNumber}</TableCell>
                                    <TableCell align='center'>{data.attentionTo}</TableCell>
                                    <TableCell align='center'>{data.reportedBy}</TableCell>
                                    <TableCell align='center'>{data.facilityAffected}</TableCell>
                                    <TableCell align='center'>{data.supplier}</TableCell>
                                    <TableCell align='center'>{data.status ? data.status: 'Unreviewed'}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination 
                        rowsPerPageOptions={[10, 25, 100]}
                        component='div'
                        count={dataList.length}
                        rowsPerPage={rowPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Stack>
        </Box>
    );
}