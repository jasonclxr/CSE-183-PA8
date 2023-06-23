import React from 'react';
import Box from '@mui/material/Box';
import TopBar from './TopBar';
import QuickLogin from './QuickLogin';
import SubCategories from './SubCategories';
import Search from './Search';
import Content from './Content';
import Sidebar from './Sidebar';
import GlobalStyles from '@mui/material/GlobalStyles';
import Divider from '@mui/material/Divider';
import Context from '../context/Context';
import Filters from './Filters';

/**
 * @return {object} JSX
 */
function HomePage() {
  const ctx = React.useContext(Context);
  if (!ctx.loginPage && !ctx.registerPage) {
    return (
      <React.Fragment>
        <TopBar />
        <Sidebar />
        {getHomePage(ctx)}
      </React.Fragment>
    );
  } else {
    return (
      <div></div>
    );
  }
}
/**
 * @param {*} ctx
 * @return {object} JSX
 */
function getHomePage(ctx) {
  if (ctx.isDesktop()) {
    return (
      <Box aria-label='desktop view' sx={{px: '20px', ml: '360px'}}>
        <GlobalStyles styles={{
          body: {backgroundColor: '#f0f2f5'},
        }}/>
        <QuickLogin />
        <SubCategories />
        <Content />
      </Box>
    );
  }
  return (
    <Box aria-label='mobile view' >
      <QuickLogin />
      <SubCategories />
      <Search mb='10px'/>
      <Divider />
      <Filters mt='10px'/>
      <br/>
      <Content />
    </Box>
  );
}

export default HomePage;
