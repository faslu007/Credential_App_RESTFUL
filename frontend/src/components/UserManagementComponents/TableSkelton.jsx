import { Stack, Skeleton, Box, Avatar, Typography,  } from '@mui/material'


const TableSkelton = () => {
  return (
    <Stack spacing={1} width='250px' style={{height: 'auto', width: 'auto', marginLeft: '240px', marginTop: '-570px', padding: '25px'}}>
      <Skeleton variant='text'/>
      <Skeleton variant='rectangular' width={250} height={120} animation='wave'/>
    </Stack>
  )
}

export default TableSkelton
