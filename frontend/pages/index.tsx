import { useState, useContext } from "react";
import { ThemeContext } from "styled-components";

import { HelperText, StyledH1, Grid } from "../styles/core-ui";
import { Layout, Seo } from "../components";
import FormInput from "../components/FormInput";
import Button from "../components/Button";

/**
 * Get tutorials
 *
 * @todo typescript types
 * @returns tutorials
 */
export const getServerSideProps = async () => {
  const response = await fetch("http://localhost:3000/api/getTutorial");
  return {
    props: {
      tutorials: await response.json(),
    },
  };
};

/**
 * Index Page - renders on '/' route
 *
 * @author shreyas1307, rakeshshubhu
 */
export default function index(props) {
  const [categories, setCategories] = useState(props.tutorials);
  const theme: any = useContext(ThemeContext);

  return (
    <Layout>
      <Seo />
      <Grid columns="2" align="center">
        <div>
          <StyledH1 textTransform="capitalize">
            Find the best courses and become a master
          </StyledH1>
          <HelperText faded fontSize={theme.fontSizes.lg}>
            All resources are 100% free. All courses are contributed by the open
            source community or platform Dev Isle. You can join us on discord.
          </HelperText>
          <Grid columns="1" rowGap="20px" marginTop="20px">
            <FormInput name="search_courses" placeholder="Search..." />
            <Button
              varientColor="success"
              varient="solid"
              size="md"
              ariaLabel="Join us"
            >
              Join Us
            </Button>
          </Grid>
        </div>
        <div>
          <img
            src="/assets/index-banner.svg"
            alt="girl reading book"
            width="100%"
          />
        </div>
      </Grid>
    </Layout>
  );
}
