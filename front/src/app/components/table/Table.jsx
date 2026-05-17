import React from 'react'
import "./Table.scss"
import MUIDataTable from "mui-datatables";
import {createTheme ,ThemeProvider } from '@mui/material/styles'

const Table = ({columns, tabledata, title}) => {
    const optionstable = {
        selectableRows:false ,
        elevation:3 // shadow 
        ,rowsPerPage:5 ,
        rowsPerPageOptions:[5, 10, 20, 30] ,
    
    }
    
    const getMuiTheme =() => createTheme ({
        typography:{
        fontFamily:"'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;"
        },
        palette:{
        background:{
        paper:"white", 
        default:"gray"
        },
        mode : 'light' ,// ou bien dark 
        },
        components :{
        MuiTableCell:{
            styleOverrides:{
            head:{
                padding:"10px 4px"
            },
            body:{
                padding:"7px 15px" ,
                color:"#" ,
    
            },
            footer:{
    
            }
            }
        }
        }
    
    })
    



return (
    <div className='table'>
        <ThemeProvider theme={getMuiTheme()}>
    <MUIDataTable 
title={title}
responsive
data={tabledata}
columns={columns}
options={optionstable}

/>
</ThemeProvider>
    </div>

)
}

export default Table