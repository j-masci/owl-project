import React from 'react';
import styled from 'styled-components';

const Layout = ({ children }) => {
  return (
      <Root>
          <Main>
              {children}
          </Main>
      </Root>
  );
};

export const Root = styled.div``;

export const Main = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 70px 4%;  
`;

export default Layout;
