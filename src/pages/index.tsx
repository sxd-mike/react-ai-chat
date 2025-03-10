import type { NextPage } from 'next';
import ChatWindow from '../components/ChatWindow';
import { Box } from '@mui/material';

const Home: NextPage = () => {
  return (
    <Box sx={{ height: '100vh' }}>
      <ChatWindow />
    </Box>
  );
};

export default Home; 