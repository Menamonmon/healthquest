import { Box, BoxProps, Heading } from "@chakra-ui/layout";
import { Token } from "@chakra-ui/styled-system/dist/types/utils";
import * as CSS from "csstype";
import React from "react";

const HomepageSection: React.FC<
  BoxProps & {
    title: string;
    headingColor: Token<CSS.Property.Color, "colors">;
  }
> = ({ children, title, headingColor, ...props }) => {
  return (
    <Box {...props} rounded="10px" py="10px" my="10px" px="5px">
      <Heading size="sm" color={headingColor} mb="10px">
        {title}
      </Heading>
      {children}
    </Box>
  );
};

export default HomepageSection;
