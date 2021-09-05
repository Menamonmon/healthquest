import { IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Box,
  Flex,
  Heading,
  List,
  ListItem,
  VStack,
  Divider,
} from "@chakra-ui/layout";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Route, Switch } from "react-router";
import { useHistory } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import { NavRoute } from "../types";
import ProtectedRoute, { UnprotectedRoute } from "./ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  routes: NavRoute[];
}

const NavDrawerItem: React.FC<{ pageTitle: string; path: string }> = ({
  pageTitle,
  path,
}) => (
  <Fragment>
    <ListItem as={RouterLink} to={path}>
      {pageTitle}
    </ListItem>
    <Divider />
  </Fragment>
);

const Nav: React.FC<Props> = ({ routes }) => {
  const [currentPageTitle, setCurrentPageTitle] = useState("My Page");
  const [currentRoutes, setCurrentRoutes] = useState<NavRoute[]>([]);

  const { isAuthenticated } = useAuth();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  const history = useHistory();

  history.listen((location) => {
    const pagePath = location.pathname;
    const matchingRoute = routes.find((r) => r.path === pagePath);
    setCurrentPageTitle(
      matchingRoute ? matchingRoute.pageTitle : "INVALID PAGE"
    );
  });

  useEffect(() => {
    setCurrentRoutes(
      routes.filter((route) => {
        const { _protected, unprotected, onDrawer } = route;
        if (onDrawer) {
          if (_protected && isAuthenticated) {
            return route;
          } else if (unprotected && !isAuthenticated) {
            return route;
          }
        }
        return null;
      })
    );
  }, [isAuthenticated, routes]);

  return (
    <VStack spacing="0">
      <Flex
        flexDir="row"
        alignItems="center"
        w="100%"
        maxWidth="500px"
        bgColor="blue.100"
        p="10px"
        boxShadow="lg"
      >
        <IconButton
          ref={btnRef}
          colorScheme="blue"
          aria-label="nav-toggle"
          onClick={onOpen}
        >
          <GiHamburgerMenu />
        </IconButton>
        <Heading flex="0.9" textAlign="center" size="sm">
          {currentPageTitle}
        </Heading>
      </Flex>
      <Box
        maxWidth="500px"
        maxHeight="900px"
        w="100vw"
        mx="auto"
        h="calc(100vh - 60px)"
      >
        <Switch>
          {routes.map(({ _protected, unprotected, pageTitle, ...rest }) => {
            if (_protected) {
              return <ProtectedRoute exact strict {...rest} />;
            } else if (unprotected) {
              return <UnprotectedRoute exact strict {...rest} />;
            } else {
              return <Route exact strict {...rest} />;
            }
          })}
        </Switch>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>CAC App</DrawerHeader>
          <DrawerBody>
            <List onClick={onClose}>
              {currentRoutes.map(({ pageTitle, path }) => (
                <NavDrawerItem pageTitle={pageTitle} path={path} />
              ))}
            </List>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </VStack>
  );
};

export default Nav;
